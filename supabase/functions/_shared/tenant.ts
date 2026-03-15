export async function getTenantForUser(
  supabase: any,
  userId: string
): Promise<string | null> {
  const { data } = await supabase
    .from("users")
    .select("tenant_id")
    .eq("id", userId)
    .single();

  return data?.tenant_id ?? null;
}
