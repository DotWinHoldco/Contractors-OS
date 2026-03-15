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

    const { project_id, tenant_id, contract_type, estimate_data } =
      await req.json();

    // Resolve AI model
    const { data: modelConfig } = await supabase.rpc("resolve_ai_model", {
      p_tenant_id: tenant_id,
      p_module: "contract_drafter",
    });

    const config = modelConfig?.[0] ?? {
      api_model_id: "claude-sonnet-4-6",
      provider: "anthropic",
      temperature: 0.3,
      max_tokens: 8192,
    };

    const prompt = `Generate a professional ${contract_type || "construction"} contract with the following sections:
1. Parties (contractor and client)
2. Scope of Work
3. Schedule (start date, completion date, milestones)
4. Contract Price and Payment Terms
5. Change Order Process
6. Warranty
7. Insurance and Liability
8. Dispute Resolution
9. Termination Clause
10. Signatures

Project details: ${JSON.stringify(estimate_data || {})}

Return the contract as a JSON object with keys: parties, scope, schedule, pricing, change_orders, warranty, insurance, disputes, termination, signatures. Each value should be the full text for that section.`;

    let result: string;

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
          messages: [{ role: "user", content: prompt }],
        }),
      });

      const data = await response.json();
      result = data.content?.[0]?.text ?? "";
    } else {
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
            messages: [{ role: "user", content: prompt }],
          }),
        }
      );

      const data = await response.json();
      result = data.choices?.[0]?.message?.content ?? "";
    }

    // Try to parse as JSON, fallback to raw text
    let sections;
    try {
      sections = JSON.parse(result);
    } catch {
      sections = { full_text: result };
    }

    return new Response(
      JSON.stringify({ success: true, sections }),
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
