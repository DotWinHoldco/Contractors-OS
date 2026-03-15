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
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const payload = await req.json();
    const { type, record } = payload;

    if (type !== "INSERT") {
      return new Response(JSON.stringify({ message: "Ignored" }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const authUser = record;
    const metadata = authUser.raw_user_meta_data || {};

    // Create public.users record
    const { error: userError } = await supabase.from("users").insert({
      id: authUser.id,
      email: authUser.email,
      first_name: metadata.first_name || metadata.full_name?.split(" ")[0] || "",
      last_name: metadata.last_name || metadata.full_name?.split(" ").slice(1).join(" ") || "",
      avatar_url: metadata.avatar_url || null,
      phone: metadata.phone || null,
      role: metadata.role || "client",
      tenant_id: metadata.tenant_id || null,
      status: "active",
    });

    if (userError) {
      console.error("Error creating user record:", userError);
      return new Response(JSON.stringify({ error: userError.message }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // If invitation token exists, process invitation
    if (metadata.invitation_id) {
      await supabase
        .from("invitations")
        .update({
          status: "accepted",
          accepted_at: new Date().toISOString(),
          accepted_by: authUser.id,
        })
        .eq("id", metadata.invitation_id);
    }

    // If signup came from booking flow, create client record
    if (metadata.source === "booking" && metadata.tenant_id) {
      await supabase.from("clients").insert({
        tenant_id: metadata.tenant_id,
        user_id: authUser.id,
        first_name: metadata.first_name || "",
        last_name: metadata.last_name || "",
        email: authUser.email,
        phone: metadata.phone || null,
        type: "residential",
        status: "active",
        source: "booking_flow",
        portal_enrolled: true,
        portal_last_login: new Date().toISOString(),
      });
    }

    return new Response(
      JSON.stringify({ success: true, user_id: authUser.id }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("on-signup error:", error);
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
