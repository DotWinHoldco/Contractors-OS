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

    const body = await req.json();
    const { module, prompt, context, project_id, client_id, tenant_id } = body;

    if (!module || !prompt) {
      return new Response(
        JSON.stringify({ error: "module and prompt are required" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Resolve AI model for this tenant + module
    const { data: modelConfig } = await supabase.rpc("resolve_ai_model", {
      p_tenant_id: tenant_id,
      p_module: module,
    });

    const config = modelConfig?.[0] ?? {
      model_key: "claude-sonnet-4-6",
      api_model_id: "claude-sonnet-4-6",
      provider: "anthropic",
      temperature: 0.7,
      max_tokens: 4096,
    };

    let result: string;
    const startTime = Date.now();

    // Route to correct provider
    if (config.provider === "anthropic") {
      const apiKey = Deno.env.get("ANTHROPIC_API_KEY");
      if (!apiKey) {
        return new Response(
          JSON.stringify({ error: "Anthropic API key not configured" }),
          {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      const response = await fetch(
        "https://api.anthropic.com/v1/messages",
        {
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
            messages: [
              {
                role: "user",
                content: context
                  ? `Context:\n${JSON.stringify(context)}\n\n${prompt}`
                  : prompt,
              },
            ],
          }),
        }
      );

      const data = await response.json();
      result = data.content?.[0]?.text ?? "";
    } else if (config.provider === "openai") {
      const apiKey = Deno.env.get("OPEN_AI_API_KEY");
      if (!apiKey) {
        return new Response(
          JSON.stringify({ error: "OpenAI API key not configured" }),
          {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

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
              {
                role: "user",
                content: context
                  ? `Context:\n${JSON.stringify(context)}\n\n${prompt}`
                  : prompt,
              },
            ],
          }),
        }
      );

      const data = await response.json();
      result = data.choices?.[0]?.message?.content ?? "";
    } else {
      return new Response(
        JSON.stringify({ error: `Unsupported provider: ${config.provider}` }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const durationMs = Date.now() - startTime;

    // Log to ai_generations
    const serviceClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    await serviceClient.from("ai_generations").insert({
      tenant_id,
      user_id: user.id,
      module,
      model_key: config.model_key,
      provider: config.provider,
      prompt: prompt.substring(0, 2000),
      response: result.substring(0, 5000),
      tokens_in: 0, // TODO: parse from provider response
      tokens_out: 0,
      duration_ms: durationMs,
      project_id: project_id || null,
      client_id: client_id || null,
    });

    return new Response(
      JSON.stringify({ result, model: config.model_key, duration_ms: durationMs }),
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
