import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "../../_shared/cors.ts";

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Service client for admin operations
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Auth check
    const authClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      {
        global: {
          headers: { Authorization: req.headers.get("Authorization")! },
        },
      }
    );
    const { data: { user }, error: authError } = await authClient.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = await req.json();

    // 1. Create tenant
    const { data: tenant, error: tenantError } = await supabase
      .from("tenants")
      .insert({
        name: body.name,
        slug: body.slug,
        status: "active",
        plan: body.plan || "professional",
        business_type: body.business_type || "general_contractor",
        phone: body.phone,
        email: body.email,
        website: body.website,
        tagline: body.tagline,
        address_line1: body.address_line1,
        address_city: body.address_city,
        address_state: body.address_state,
        address_zip: body.address_zip,
        service_area_description: body.service_area,
      })
      .select()
      .single();

    if (tenantError || !tenant) {
      return new Response(
        JSON.stringify({ error: tenantError?.message || "Failed to create tenant" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // 2. Create theme
    await supabase.from("tenant_themes").insert({
      tenant_id: tenant.id,
      color_primary: body.color_primary || "#1b2a4a",
      color_secondary: body.color_secondary || "#2e75b6",
      color_accent: body.color_accent || "#d4a84b",
      color_background: "#ffffff",
      color_surface: "#f8f8f8",
      color_text: "#1a1a1a",
      color_text_secondary: "#555555",
      color_success: "#2d6a4f",
      color_warning: "#cc8a00",
      color_error: "#c1292e",
      border_radius: "8px",
      font_heading: body.font_heading || "Outfit",
      font_body: body.font_body || "Outfit",
    });

    // 3. Create subdomain
    await supabase.from("tenant_domains").insert({
      tenant_id: tenant.id,
      domain: `${body.slug}.contractorsos.com`,
      domain_type: "subdomain",
      is_primary: true,
      is_verified: true,
    });

    // 4. Initialize sequences
    await supabase.rpc("initialize_tenant_sequences", {
      p_tenant_id: tenant.id,
    });

    // 5. Set default AI routing (claude-sonnet-4-6 for all modules)
    const modules = [
      "scope_generator",
      "estimate_builder",
      "proposal_writer",
      "contract_writer",
      "chat",
      "lead_scorer",
      "report_generator",
      "general",
    ];

    for (const mod of modules) {
      await supabase.from("ai_module_routing").insert({
        tenant_id: tenant.id,
        module: mod,
        primary_model_key: "claude-sonnet-4-6",
        fallback_model_key: "gpt-4o",
        routing_strategy: "primary_only",
      });
    }

    return new Response(
      JSON.stringify({
        success: true,
        tenant_id: tenant.id,
        slug: tenant.slug,
        subdomain: `${body.slug}.contractorsos.com`,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: (error as Error).message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
