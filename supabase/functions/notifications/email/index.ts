import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { corsHeaders } from "../../_shared/cors.ts";

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { tenant_id, user_id, title, body, data, to_email, template_id } =
      await req.json();

    // TODO: Integrate with SendGrid/SES
    // For now, log the email that would be sent
    console.log("Email send request:", {
      tenant_id,
      user_id,
      to_email,
      title,
      body,
      template_id,
    });

    return new Response(
      JSON.stringify({
        success: true,
        message: "Email queued (integration pending)",
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
