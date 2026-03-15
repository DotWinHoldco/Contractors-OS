import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "../../_shared/cors.ts";

interface ProposalRequest {
  project_id: string;
  tenant_id: string;
  estimate_data: {
    client_name: string;
    project_name: string;
    project_description: string;
    line_items: Array<{
      description: string;
      quantity: number;
      unit: string;
      unit_price: number;
      total: number;
    }>;
    subtotal: number;
    tax: number;
    total: number;
    timeline_weeks: number;
  };
}

interface ProposalResponse {
  cover_letter: string;
  scope: string;
  timeline: string;
  pricing: string;
  terms: string;
}

serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    // Create Supabase client with user's auth
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      {
        global: {
          headers: { Authorization: req.headers.get("Authorization")! },
        },
      }
    );

    // Verify authenticated user
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

    const body: ProposalRequest = await req.json();
    const { project_id, tenant_id, estimate_data } = body;

    if (!project_id || !tenant_id || !estimate_data) {
      return new Response(
        JSON.stringify({
          error: "Missing required fields: project_id, tenant_id, estimate_data",
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Verify user belongs to tenant
    const { data: membership, error: memberError } = await supabase
      .from("tenant_members")
      .select("role")
      .eq("tenant_id", tenant_id)
      .eq("user_id", user.id)
      .single();

    if (memberError || !membership) {
      return new Response(
        JSON.stringify({ error: "Not authorized for this tenant" }),
        {
          status: 403,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Fetch tenant info for branding the proposal
    const { data: tenant } = await supabase
      .from("tenants")
      .select("name, business_name, phone, email, address")
      .eq("id", tenant_id)
      .single();

    const companyName = tenant?.business_name || tenant?.name || "Our Company";

    // Resolve AI model for this tenant/module
    const { data: modelConfig } = await supabase.rpc("resolve_ai_model", {
      p_tenant_id: tenant_id,
      p_module: "proposal_generator",
    });

    const model = modelConfig?.[0] || {
      model_key: "claude-sonnet-4-6",
      api_model_id: "claude-sonnet-4-6",
      provider: "anthropic",
      temperature: 0.7,
      max_tokens: 4096,
    };

    // Build the prompt
    const lineItemsText = estimate_data.line_items
      .map(
        (item) =>
          `- ${item.description}: ${item.quantity} ${item.unit} @ $${item.unit_price.toFixed(2)} = $${item.total.toFixed(2)}`
      )
      .join("\n");

    const prompt = `Generate a professional contractor proposal with the following sections. Return valid JSON with keys: cover_letter, scope, timeline, pricing, terms.

Project Details:
- Client: ${estimate_data.client_name}
- Project: ${estimate_data.project_name}
- Description: ${estimate_data.project_description}
- Timeline: ${estimate_data.timeline_weeks} weeks
- Company: ${companyName}

Line Items:
${lineItemsText}

Subtotal: $${estimate_data.subtotal.toFixed(2)}
Tax: $${estimate_data.tax.toFixed(2)}
Total: $${estimate_data.total.toFixed(2)}

Requirements:
- cover_letter: A warm, professional cover letter (2-3 paragraphs) addressed to the client.
- scope: A detailed scope of work section listing all deliverables and exclusions.
- timeline: A week-by-week project timeline with milestones.
- pricing: A formatted pricing breakdown with payment schedule (deposit, progress, final).
- terms: Standard terms and conditions including warranty, change orders, and liability.

Return ONLY valid JSON. No markdown, no code fences.`;

    let proposal: ProposalResponse;

    // Route to the correct AI provider
    if (model.provider === "anthropic") {
      const anthropicKey = Deno.env.get("ANTHROPIC_API_KEY");
      if (!anthropicKey) {
        throw new Error("ANTHROPIC_API_KEY not configured");
      }

      const aiResponse = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": anthropicKey,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: model.api_model_id,
          max_tokens: model.max_tokens || 4096,
          temperature: model.temperature || 0.7,
          messages: [
            {
              role: "user",
              content: prompt,
            },
          ],
        }),
      });

      if (!aiResponse.ok) {
        const errText = await aiResponse.text();
        throw new Error(`Anthropic API error: ${aiResponse.status} — ${errText}`);
      }

      const aiData = await aiResponse.json();
      const content = aiData.content?.[0]?.text || "";
      proposal = JSON.parse(content);

      // Log the generation
      await supabase.from("ai_generations").insert({
        tenant_id,
        user_id: user.id,
        module: "proposal_generator",
        model_key: model.model_key,
        provider: model.provider,
        input_tokens: aiData.usage?.input_tokens || 0,
        output_tokens: aiData.usage?.output_tokens || 0,
        metadata: { project_id },
      });
    } else if (model.provider === "openai") {
      const openaiKey = Deno.env.get("OPENAI_API_KEY");
      if (!openaiKey) {
        throw new Error("OPENAI_API_KEY not configured");
      }

      const aiResponse = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${openaiKey}`,
          },
          body: JSON.stringify({
            model: model.api_model_id,
            max_tokens: model.max_tokens || 4096,
            temperature: model.temperature || 0.7,
            messages: [
              {
                role: "user",
                content: prompt,
              },
            ],
          }),
        }
      );

      if (!aiResponse.ok) {
        const errText = await aiResponse.text();
        throw new Error(`OpenAI API error: ${aiResponse.status} — ${errText}`);
      }

      const aiData = await aiResponse.json();
      const content = aiData.choices?.[0]?.message?.content || "";
      proposal = JSON.parse(content);

      // Log the generation
      await supabase.from("ai_generations").insert({
        tenant_id,
        user_id: user.id,
        module: "proposal_generator",
        model_key: model.model_key,
        provider: model.provider,
        input_tokens: aiData.usage?.prompt_tokens || 0,
        output_tokens: aiData.usage?.completion_tokens || 0,
        metadata: { project_id },
      });
    } else {
      throw new Error(`Unsupported AI provider: ${model.provider}`);
    }

    // Store the proposal linked to the project
    const { error: insertError } = await supabase
      .from("documents")
      .insert({
        tenant_id,
        project_id,
        type: "proposal",
        title: `Proposal — ${estimate_data.project_name}`,
        content: proposal,
        created_by: user.id,
        status: "draft",
      });

    if (insertError) {
      console.error("Failed to save proposal document:", insertError);
      // Still return the proposal even if saving fails
    }

    return new Response(
      JSON.stringify({
        success: true,
        proposal,
        project_id,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("generate-proposal error:", error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Internal server error",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
