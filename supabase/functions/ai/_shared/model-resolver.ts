export async function resolveModel(
  supabase: any,
  tenantId: string,
  module: string
) {
  const { data, error } = await supabase.rpc("resolve_ai_model", {
    p_tenant_id: tenantId,
    p_module: module,
  });

  if (error || !data?.[0]) {
    // Fallback to Claude Sonnet
    return {
      model_key: "claude-sonnet-4-6",
      api_model_id: "claude-sonnet-4-6",
      provider: "anthropic",
      temperature: 0.7,
      max_tokens: 4096,
    };
  }

  return data[0];
}
