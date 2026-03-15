import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "../../_shared/cors.ts";

const STRIPE_SECRET_KEY = Deno.env.get("STRIPE_SECRET_KEY") ?? "";
const STRIPE_WEBHOOK_SECRET = Deno.env.get("STRIPE_WEBHOOK_SECRET") ?? "";

async function verifyStripeSignature(
  payload: string,
  signature: string,
  secret: string
): Promise<boolean> {
  const parts = signature.split(",");
  const timestampPart = parts.find((p) => p.startsWith("t="));
  const sigPart = parts.find((p) => p.startsWith("v1="));

  if (!timestampPart || !sigPart) return false;

  const timestamp = timestampPart.split("=")[1];
  const expectedSig = sigPart.split("=")[1];

  const signedPayload = `${timestamp}.${payload}`;

  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const signatureBytes = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(signedPayload)
  );

  const computedSig = Array.from(new Uint8Array(signatureBytes))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  return computedSig === expectedSig;
}

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
    const body = await req.text();
    const signature = req.headers.get("stripe-signature");

    if (!signature) {
      return new Response(
        JSON.stringify({ error: "Missing stripe-signature header" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Verify webhook signature
    const isValid = await verifyStripeSignature(
      body,
      signature,
      STRIPE_WEBHOOK_SECRET
    );

    if (!isValid) {
      console.error("Invalid webhook signature");
      return new Response(
        JSON.stringify({ error: "Invalid signature" }),
        {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const event = JSON.parse(body);

    // Use service role client for admin operations
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;
        const invoiceId = session.metadata?.invoice_id;
        const tenantId = session.metadata?.tenant_id;

        if (!invoiceId || !tenantId) {
          console.error("Missing metadata on checkout session:", session.id);
          break;
        }

        // Update payment log
        await supabase
          .from("payment_logs")
          .update({
            status: "checkout_completed",
            stripe_payment_intent_id: session.payment_intent,
            updated_at: new Date().toISOString(),
          })
          .eq("stripe_session_id", session.id);

        console.log(
          `Checkout completed for invoice ${invoiceId}, tenant ${tenantId}`
        );
        break;
      }

      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object;
        const invoiceId = paymentIntent.metadata?.invoice_id;
        const tenantId = paymentIntent.metadata?.tenant_id;

        if (!invoiceId || !tenantId) {
          console.log(
            "Payment intent without invoice metadata:",
            paymentIntent.id
          );
          break;
        }

        const amountPaid = paymentIntent.amount_received / 100;

        // Fetch current invoice
        const { data: invoice } = await supabase
          .from("invoices")
          .select("total_amount, paid_amount")
          .eq("id", invoiceId)
          .single();

        if (!invoice) {
          console.error("Invoice not found:", invoiceId);
          break;
        }

        const newPaidAmount = (invoice.paid_amount ?? 0) + amountPaid;
        const isFullyPaid = newPaidAmount >= invoice.total_amount;

        // Update invoice
        await supabase
          .from("invoices")
          .update({
            paid_amount: newPaidAmount,
            status: isFullyPaid ? "paid" : "partial",
            paid_at: isFullyPaid ? new Date().toISOString() : null,
            updated_at: new Date().toISOString(),
          })
          .eq("id", invoiceId);

        // Record payment
        await supabase.from("payments").insert({
          invoice_id: invoiceId,
          tenant_id: tenantId,
          amount: amountPaid,
          stripe_payment_intent_id: paymentIntent.id,
          stripe_charge_id: paymentIntent.latest_charge,
          method: paymentIntent.payment_method_types?.[0] ?? "card",
          status: "succeeded",
        });

        // Update payment log
        await supabase
          .from("payment_logs")
          .update({
            status: "payment_succeeded",
            updated_at: new Date().toISOString(),
          })
          .eq("stripe_payment_intent_id", paymentIntent.id);

        console.log(
          `Payment succeeded: $${amountPaid} for invoice ${invoiceId}`
        );
        break;
      }

      case "charge.refunded": {
        const charge = event.data.object;
        const paymentIntentId = charge.payment_intent;

        if (!paymentIntentId) {
          console.log("Refund on charge without payment intent:", charge.id);
          break;
        }

        // Find the associated payment
        const { data: payment } = await supabase
          .from("payments")
          .select("id, invoice_id, tenant_id, amount")
          .eq("stripe_charge_id", charge.id)
          .single();

        if (!payment) {
          console.error("Payment not found for charge:", charge.id);
          break;
        }

        const refundAmount = charge.amount_refunded / 100;

        // Update payment status
        await supabase
          .from("payments")
          .update({
            status: charge.refunded ? "refunded" : "partial_refund",
            refunded_amount: refundAmount,
            updated_at: new Date().toISOString(),
          })
          .eq("id", payment.id);

        // Update invoice paid amount
        const { data: invoice } = await supabase
          .from("invoices")
          .select("paid_amount, total_amount")
          .eq("id", payment.invoice_id)
          .single();

        if (invoice) {
          const newPaidAmount = Math.max(
            0,
            (invoice.paid_amount ?? 0) - refundAmount
          );
          await supabase
            .from("invoices")
            .update({
              paid_amount: newPaidAmount,
              status: newPaidAmount <= 0 ? "sent" : "partial",
              updated_at: new Date().toISOString(),
            })
            .eq("id", payment.invoice_id);
        }

        console.log(
          `Refund processed: $${refundAmount} for charge ${charge.id}`
        );
        break;
      }

      case "account.updated": {
        const account = event.data.object;

        // Update tenant's Stripe account status
        await supabase
          .from("tenants")
          .update({
            stripe_charges_enabled: account.charges_enabled,
            stripe_payouts_enabled: account.payouts_enabled,
            stripe_details_submitted: account.details_submitted,
            updated_at: new Date().toISOString(),
          })
          .eq("stripe_account_id", account.id);

        console.log(
          `Account updated: ${account.id}, charges_enabled: ${account.charges_enabled}`
        );
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Webhook error:", error);
    return new Response(
      JSON.stringify({ error: (error as Error).message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
