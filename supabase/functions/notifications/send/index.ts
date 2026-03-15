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

    const {
      tenant_id,
      notification_type,
      entity_type,
      entity_id,
      user_ids,
      title,
      body,
      data,
    } = await req.json();

    if (!tenant_id || !notification_type || !user_ids?.length) {
      return new Response(
        JSON.stringify({
          error: "tenant_id, notification_type, and user_ids are required",
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const results = [];

    for (const userId of user_ids) {
      // Create in-app notification
      const { data: notification, error } = await supabase
        .from("notifications")
        .insert({
          tenant_id,
          user_id: userId,
          type: notification_type,
          title: title || notification_type.replace(/_/g, " "),
          body: body || "",
          entity_type: entity_type || null,
          entity_id: entity_id || null,
          data: data || {},
        })
        .select("id")
        .single();

      if (error) {
        results.push({ user_id: userId, error: error.message });
        continue;
      }

      // Check user notification preferences for email/SMS
      const { data: prefs } = await supabase
        .from("notification_preferences")
        .select("channel, enabled")
        .eq("user_id", userId)
        .eq("notification_type", notification_type);

      const channels = (prefs || [])
        .filter((p: any) => p.enabled)
        .map((p: any) => p.channel);

      // Send email if enabled
      if (channels.includes("email")) {
        await supabase.functions.invoke("notifications/email", {
          body: { tenant_id, user_id: userId, title, body, data },
        });
      }

      // Send SMS if enabled
      if (channels.includes("sms")) {
        await supabase.functions.invoke("notifications/sms", {
          body: { tenant_id, user_id: userId, title, body, data },
        });
      }

      results.push({
        user_id: userId,
        notification_id: notification?.id,
        channels_sent: channels,
      });
    }

    return new Response(JSON.stringify({ success: true, results }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
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
