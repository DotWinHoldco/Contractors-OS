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
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      {
        global: {
          headers: { Authorization: req.headers.get("Authorization")! },
        },
      }
    );

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

    const { message, conversation_id, tenant_id, context } = await req.json();

    if (!message) {
      return new Response(
        JSON.stringify({ error: "message is required" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Load conversation history if exists
    let messages: Array<{ role: string; content: string }> = [];
    if (conversation_id) {
      const { data: conversation } = await supabase
        .from("ai_conversations")
        .select("messages")
        .eq("id", conversation_id)
        .single();

      if (conversation?.messages) {
        messages = conversation.messages;
      }
    }

    // Add new user message
    messages.push({ role: "user", content: message });

    // Build system prompt with context
    let systemPrompt =
      "You are an AI assistant for a home services contractor. Help with project management, estimating, scheduling, client communication, and general business operations.";
    if (context) {
      systemPrompt += `\n\nCurrent context: ${JSON.stringify(context)}`;
    }

    // Resolve model
    const { data: modelConfig } = await supabase.rpc("resolve_ai_model", {
      p_tenant_id: tenant_id,
      p_module: "ai_chat",
    });

    const config = modelConfig?.[0] ?? {
      api_model_id: "claude-sonnet-4-6",
      provider: "anthropic",
      temperature: 0.7,
      max_tokens: 2048,
    };

    let assistantMessage = "";

    if (config.provider === "anthropic") {
      const apiKey = Deno.env.get("ANTHROPIC_API_KEY");
      if (!apiKey) throw new Error("Anthropic API key not configured");

      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: config.api_model_id,
          max_tokens: config.max_tokens,
          temperature: config.temperature,
          system: systemPrompt,
          messages: messages.map((m) => ({
            role: m.role === "assistant" ? "assistant" : "user",
            content: m.content,
          })),
        }),
      });

      const data = await response.json();
      assistantMessage = data.content?.[0]?.text ?? "I couldn't generate a response.";
    } else if (config.provider === "openai") {
      const apiKey = Deno.env.get("OPENAI_API_KEY");
      if (!apiKey) throw new Error("OpenAI API key not configured");

      const response = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: config.api_model_id,
            max_tokens: config.max_tokens,
            temperature: config.temperature,
            messages: [
              { role: "system", content: systemPrompt },
              ...messages,
            ],
          }),
        }
      );

      const data = await response.json();
      assistantMessage = data.choices?.[0]?.message?.content ?? "";
    }

    // Add assistant response
    messages.push({ role: "assistant", content: assistantMessage });

    // Save conversation
    const serviceClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    let convId = conversation_id;
    if (convId) {
      await serviceClient
        .from("ai_conversations")
        .update({ messages, updated_at: new Date().toISOString() })
        .eq("id", convId);
    } else {
      const { data: newConv } = await serviceClient
        .from("ai_conversations")
        .insert({
          tenant_id,
          user_id: user.id,
          title: message.substring(0, 100),
          messages,
        })
        .select("id")
        .single();
      convId = newConv?.id;
    }

    return new Response(
      JSON.stringify({
        message: assistantMessage,
        conversation_id: convId,
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
