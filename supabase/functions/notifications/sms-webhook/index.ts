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

    const contentType = req.headers.get("content-type") || "";
    let body: Record<string, string> = {};

    if (contentType.includes("application/x-www-form-urlencoded")) {
      const text = await req.text();
      const params = new URLSearchParams(text);
      for (const [key, value] of params.entries()) {
        body[key] = value;
      }
    } else {
      body = await req.json();
    }

    const messageStatus = body.MessageStatus || body.SmsStatus;
    const messageSid = body.MessageSid || body.SmsSid;
    const from = body.From;
    const messageBody = body.Body;

    // Handle status callbacks
    if (messageStatus && messageSid && !messageBody) {
      await supabase
        .from("sms_log")
        .update({
          status: messageStatus.toLowerCase(),
          updated_at: new Date().toISOString(),
        })
        .eq("external_id", messageSid);

      return new Response(
        "<Response></Response>",
        { status: 200, headers: { ...corsHeaders, "Content-Type": "text/xml" } }
      );
    }

    // Handle inbound SMS
    if (messageBody && from) {
      const stopKeywords = ["stop", "unsubscribe", "cancel", "quit", "end"];
      const isOptOut = stopKeywords.includes(messageBody.trim().toLowerCase());

      if (isOptOut) {
        const { data: client } = await supabase
          .from("clients")
          .select("id, tenant_id")
          .or(`phone.eq.${from},phone.eq.${from.replace("+1", "")}`)
          .single();

        if (client) {
          await supabase
            .from("clients")
            .update({ is_do_not_contact: true })
            .eq("id", client.id);
        }

        return new Response(
          "<Response><Message>You have been unsubscribed. Reply START to re-subscribe.</Message></Response>",
          { status: 200, headers: { ...corsHeaders, "Content-Type": "text/xml" } }
        );
      }

      // Route inbound message to thread
      const { data: client } = await supabase
        .from("clients")
        .select("id, tenant_id, user_id")
        .or(`phone.eq.${from},phone.eq.${from.replace("+1", "")}`)
        .single();

      if (client) {
        let threadId: string | null = null;
        const { data: existingThread } = await supabase
          .from("message_threads")
          .select("id")
          .eq("tenant_id", client.tenant_id)
          .eq("client_id", client.id)
          .eq("channel", "sms")
          .single();

        if (existingThread) {
          threadId = existingThread.id;
        } else {
          const { data: newThread } = await supabase
            .from("message_threads")
            .insert({
              tenant_id: client.tenant_id,
              client_id: client.id,
              channel: "sms",
              subject: `SMS from ${from}`,
              status: "open",
            })
            .select("id")
            .single();
          threadId = newThread?.id ?? null;
        }

        if (threadId) {
          await supabase.from("messages").insert({
            thread_id: threadId,
            tenant_id: client.tenant_id,
            sender_type: "client",
            sender_id: client.user_id || client.id,
            channel: "sms",
            body: messageBody,
            external_id: messageSid,
          });
        }
      }

      return new Response(
        "<Response></Response>",
        { status: 200, headers: { ...corsHeaders, "Content-Type": "text/xml" } }
      );
    }

    return new Response(
      JSON.stringify({ received: true }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("SMS webhook error:", error);
    return new Response(
      "<Response></Response>",
      { status: 200, headers: { ...corsHeaders, "Content-Type": "text/xml" } }
    );
  }
});
