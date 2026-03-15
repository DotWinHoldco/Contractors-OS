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

    const { lead_id } = await req.json();

    if (!lead_id) {
      return new Response(
        JSON.stringify({ error: "lead_id is required" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Fetch lead details
    const { data: lead, error: leadError } = await supabase
      .from("leads")
      .select("*, clients(*)")
      .eq("id", lead_id)
      .single();

    if (leadError || !lead) {
      return new Response(
        JSON.stringify({ error: "Lead not found" }),
        {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Score factors
    const factors: Record<string, number> = {};
    let score = 50; // Base score

    // Project value factor (0-20 points)
    const estimatedValue = lead.estimated_value || 0;
    if (estimatedValue > 100000) factors.project_value = 20;
    else if (estimatedValue > 50000) factors.project_value = 15;
    else if (estimatedValue > 25000) factors.project_value = 12;
    else if (estimatedValue > 10000) factors.project_value = 8;
    else factors.project_value = 5;
    score += factors.project_value - 10;

    // Completeness of info (0-15 points)
    let completeness = 0;
    if (lead.clients?.email) completeness += 3;
    if (lead.clients?.phone) completeness += 3;
    if (lead.property_id) completeness += 3;
    if (lead.project_details?.consultation_date) completeness += 3;
    if (lead.project_type) completeness += 3;
    factors.info_completeness = completeness;
    score += completeness - 7;

    // Timeline urgency (0-15 points)
    const timeline = lead.project_details?.timeline;
    if (timeline === "ASAP") factors.timeline_urgency = 15;
    else if (timeline === "1-3 months") factors.timeline_urgency = 10;
    else if (timeline === "3-6 months") factors.timeline_urgency = 5;
    else factors.timeline_urgency = 2;
    score += factors.timeline_urgency - 7;

    // Clamp score to 0-100
    score = Math.max(0, Math.min(100, score));

    // Update lead
    const { error: updateError } = await supabase
      .from("leads")
      .update({
        score,
        score_factors: factors,
      })
      .eq("id", lead_id);

    if (updateError) throw updateError;

    return new Response(
      JSON.stringify({ success: true, score, factors }),
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
