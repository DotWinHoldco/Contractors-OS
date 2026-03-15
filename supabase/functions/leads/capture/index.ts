import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "../../_shared/cors.ts";

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Use service role for lead capture (public endpoint)
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const body = await req.json();
    const {
      tenant_id,
      first_name,
      last_name,
      email,
      phone,
      address,
      city,
      state,
      zip,
      project_type,
      project_details,
      estimate_low,
      estimate_high,
      consultation_date,
      consultation_time,
    } = body;

    if (!tenant_id || !first_name || !last_name || !email) {
      return new Response(
        JSON.stringify({
          error: "tenant_id, first_name, last_name, and email are required",
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Check if client already exists
    const { data: existingClient } = await supabase
      .from("clients")
      .select("id")
      .eq("tenant_id", tenant_id)
      .eq("email", email)
      .single();

    let clientId = existingClient?.id;

    // Create client if new
    if (!clientId) {
      const { data: newClient, error: clientError } = await supabase
        .from("clients")
        .insert({
          tenant_id,
          first_name,
          last_name,
          email,
          phone: phone || null,
          source: "booking_flow",
          status: "lead",
        })
        .select("id")
        .single();

      if (clientError) throw clientError;
      clientId = newClient.id;
    }

    // Create property if address provided
    let propertyId = null;
    if (address) {
      const { data: property, error: propError } = await supabase
        .from("properties")
        .insert({
          tenant_id,
          client_id: clientId,
          address_line1: address,
          city: city || null,
          state: state || "MI",
          zip_code: zip || null,
        })
        .select("id")
        .single();

      if (!propError && property) {
        propertyId = property.id;
      }
    }

    // Create lead
    const { data: lead, error: leadError } = await supabase
      .from("leads")
      .insert({
        tenant_id,
        client_id: clientId,
        property_id: propertyId,
        source: "website_booking",
        status: "new",
        project_type,
        project_details: {
          ...project_details,
          estimate_low,
          estimate_high,
          consultation_date,
          consultation_time,
        },
        estimated_value:
          estimate_high || estimate_low
            ? Math.round(((estimate_low || 0) + (estimate_high || 0)) / 2)
            : null,
      })
      .select("id")
      .single();

    if (leadError) throw leadError;

    // Create consultation event if scheduled
    if (consultation_date && consultation_time) {
      await supabase.from("schedule_events").insert({
        tenant_id,
        title: `Consultation: ${first_name} ${last_name} - ${project_type}`,
        event_type: "consultation",
        start_time: consultation_date,
        notes: `${project_type} consultation\nEstimate: $${estimate_low?.toLocaleString()} - $${estimate_high?.toLocaleString()}\nTime: ${consultation_time}`,
        related_lead_id: lead.id,
        related_client_id: clientId,
      });
    }

    return new Response(
      JSON.stringify({
        success: true,
        lead_id: lead.id,
        client_id: clientId,
        property_id: propertyId,
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
