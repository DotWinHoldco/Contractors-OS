import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "../../_shared/cors.ts";

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    const { hostname } = await req.json();

    if (!hostname) {
      return new Response(
        JSON.stringify({ error: "hostname is required" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Check custom domain
    const { data: domainMatch } = await supabase
      .from("tenant_domains")
      .select("tenant_id")
      .eq("domain", hostname)
      .eq("is_verified", true)
      .single();

    let tenantId = domainMatch?.tenant_id;

    // Check subdomain
    if (!tenantId) {
      const platformDomain = Deno.env.get("PLATFORM_DOMAIN") || "contractorsos.com";
      if (hostname.endsWith(`.${platformDomain}`)) {
        const slug = hostname.replace(`.${platformDomain}`, "");
        const { data: tenantMatch } = await supabase
          .from("tenants")
          .select("id")
          .eq("slug", slug)
          .eq("status", "active")
          .single();
        if (tenantMatch) tenantId = tenantMatch.id;
      }
    }

    if (!tenantId) {
      return new Response(
        JSON.stringify({ error: "Tenant not found" }),
        {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Fetch tenant + theme
    const { data: tenant } = await supabase
      .from("tenants")
      .select("id, name, slug, status, phone, email, tagline")
      .eq("id", tenantId)
      .single();

    const { data: theme } = await supabase
      .from("tenant_themes")
      .select("*")
      .eq("tenant_id", tenantId)
      .single();

    return new Response(
      JSON.stringify({ tenant, theme }),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
          "Cache-Control": "public, max-age=300, s-maxage=600",
        },
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
