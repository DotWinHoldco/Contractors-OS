import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "../../_shared/cors.ts";

const STRIPE_SECRET_KEY = Deno.env.get("STRIPE_SECRET_KEY") ?? "";
const PLATFORM_URL = Deno.env.get("PLATFORM_URL") ?? "https://contractorsos.com";

serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    // Create Supabase client with user's auth
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      {
        global: {
          headers: { Authorization: req.headers.get("Authorization")! },
        },
      }
    );

    // Authenticate user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { invoice_id, tenant_id } = await req.json();

    if (!invoice_id || !tenant_id) {
      return new Response(
        JSON.stringify({ error: "invoice_id and tenant_id are required" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Fetch invoice details
    const { data: invoice, error: invoiceError } = await supabase
      .from("invoices")
      .select(
        `
        id,
        number,
        total_amount,
        paid_amount,
        status,
        client:clients(id, name, email),
        project:projects(id, name)
      `
      )
      .eq("id", invoice_id)
      .eq("tenant_id", tenant_id)
      .single();

    if (invoiceError || !invoice) {
      return new Response(
        JSON.stringify({ error: "Invoice not found" }),
        {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    if (invoice.status === "paid") {
      return new Response(
        JSON.stringify({ error: "Invoice is already fully paid" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Fetch tenant's Stripe connected account
    const { data: tenant, error: tenantError } = await supabase
      .from("tenants")
      .select("stripe_account_id, stripe_platform_fee_percent")
      .eq("id", tenant_id)
      .single();

    if (tenantError || !tenant?.stripe_account_id) {
      return new Response(
        JSON.stringify({
          error: "Tenant does not have a connected Stripe account",
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Calculate amount due (total minus already paid)
    const amountDue = invoice.total_amount - (invoice.paid_amount ?? 0);
    const amountInCents = Math.round(amountDue * 100);

    // Calculate platform fee
    const platformFeePercent = tenant.stripe_platform_fee_percent ?? 2.9;
    const platformFeeAmount = Math.round(
      amountInCents * (platformFeePercent / 100)
    );

    // Create Stripe Checkout Session
    const checkoutResponse = await fetch(
      "https://api.stripe.com/v1/checkout/sessions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${STRIPE_SECRET_KEY}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          "mode": "payment",
          "payment_method_types[]": "card",
          "line_items[0][price_data][currency]": "usd",
          "line_items[0][price_data][unit_amount]": String(amountInCents),
          "line_items[0][price_data][product_data][name]": `Invoice ${invoice.number}`,
          "line_items[0][price_data][product_data][description]": invoice.project?.name
            ? `Payment for ${invoice.project.name}`
            : `Payment for Invoice ${invoice.number}`,
          "line_items[0][quantity]": "1",
          "payment_intent_data[transfer_data][destination]":
            tenant.stripe_account_id,
          "payment_intent_data[application_fee_amount]":
            String(platformFeeAmount),
          "payment_intent_data[metadata][invoice_id]": invoice_id,
          "payment_intent_data[metadata][tenant_id]": tenant_id,
          "customer_email": invoice.client?.email ?? "",
          "success_url": `${PLATFORM_URL}/pay/${invoice_id}/success?session_id={CHECKOUT_SESSION_ID}`,
          "cancel_url": `${PLATFORM_URL}/pay/${invoice_id}`,
          "metadata[invoice_id]": invoice_id,
          "metadata[tenant_id]": tenant_id,
        }).toString(),
      }
    );

    if (!checkoutResponse.ok) {
      const stripeError = await checkoutResponse.json();
      console.error("Stripe error:", stripeError);
      return new Response(
        JSON.stringify({
          error: "Failed to create checkout session",
          details: stripeError.error?.message,
        }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const session = await checkoutResponse.json();

    // Log the checkout attempt
    await supabase.from("payment_logs").insert({
      invoice_id,
      tenant_id,
      stripe_session_id: session.id,
      amount: amountDue,
      platform_fee: platformFeeAmount / 100,
      status: "checkout_created",
      created_by: user.id,
    });

    return new Response(JSON.stringify({ url: session.url }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Create checkout error:", error);
    return new Response(
      JSON.stringify({ error: (error as Error).message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
