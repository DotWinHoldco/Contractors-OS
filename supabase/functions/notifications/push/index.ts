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

    const { user_ids, title, body, icon, url, tenant_id } = await req.json();

    if (!user_ids?.length || !title) {
      return new Response(
        JSON.stringify({ error: "user_ids and title are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const results = [];

    for (const userId of user_ids) {
      const { data: subscriptions } = await supabase
        .from("push_subscriptions")
        .select("*")
        .eq("user_id", userId)
        .eq("is_active", true);

      if (!subscriptions?.length) {
        results.push({ user_id: userId, sent: 0, reason: "no_subscriptions" });
        continue;
      }

      let sent = 0;
      for (const sub of subscriptions) {
        try {
          const payload = JSON.stringify({ title, body, icon, url });
          console.log(`Push to ${sub.endpoint}: ${payload}`);

          await supabase
            .from("push_subscriptions")
            .update({ last_used_at: new Date().toISOString() })
            .eq("id", sub.id);

          sent++;
        } catch (e) {
          console.error(`Push failed for subscription ${sub.id}:`, e);
          await supabase
            .from("push_subscriptions")
            .update({ is_active: false })
            .eq("id", sub.id);
        }
      }

      results.push({ user_id: userId, sent });
    }

    return new Response(
      JSON.stringify({ success: true, results }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: (error as Error).message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
