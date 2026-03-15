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

    const { tenant_id, event_type, payload } = await req.json();

    if (!tenant_id || !event_type) {
      return new Response(
        JSON.stringify({ error: "tenant_id and event_type are required" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Get active webhooks for this tenant + event
    const { data: webhooks } = await supabase
      .from("webhooks")
      .select("*")
      .eq("tenant_id", tenant_id)
      .eq("is_active", true)
      .contains("events", [event_type]);

    if (!webhooks?.length) {
      return new Response(
        JSON.stringify({ success: true, dispatched: 0 }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const results = [];

    for (const webhook of webhooks) {
      let attempt = 0;
      let success = false;
      let lastError = "";

      // Retry up to 3 times with backoff
      while (attempt < 3 && !success) {
        attempt++;
        try {
          const response = await fetch(webhook.url, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "X-Webhook-Secret": webhook.secret || "",
              "X-Event-Type": event_type,
            },
            body: JSON.stringify({
              event: event_type,
              timestamp: new Date().toISOString(),
              data: payload,
            }),
          });

          if (response.ok) {
            success = true;
          } else {
            lastError = `HTTP ${response.status}`;
          }
        } catch (e) {
          lastError = (e as Error).message;
        }

        if (!success && attempt < 3) {
          await new Promise((r) => setTimeout(r, Math.pow(2, attempt) * 1000));
        }
      }

      // Log delivery
      await supabase.from("webhook_deliveries").insert({
        webhook_id: webhook.id,
        event_type,
        payload,
        status: success ? "delivered" : "failed",
        attempts: attempt,
        error: success ? null : lastError,
      });

      results.push({
        webhook_id: webhook.id,
        url: webhook.url,
        success,
        attempts: attempt,
      });
    }

    return new Response(
      JSON.stringify({ success: true, dispatched: results.length, results }),
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
