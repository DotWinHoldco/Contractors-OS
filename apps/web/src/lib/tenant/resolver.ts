export async function resolveTenant(
  hostname: string,
  supabase: any
): Promise<string | null> {
  // Check for custom domain first
  const { data: domainMatch } = await supabase
    .from("tenant_domains")
    .select("tenant_id")
    .eq("domain", hostname)
    .eq("is_verified", true)
    .single();

  if (domainMatch) return domainMatch.tenant_id;

  // Check for subdomain
  const platformDomain =
    process.env.NEXT_PUBLIC_PLATFORM_DOMAIN || "contractorsos.com";
  if (hostname.endsWith(`.${platformDomain}`)) {
    const slug = hostname.replace(`.${platformDomain}`, "");
    const { data: tenantMatch } = await supabase
      .from("tenants")
      .select("id")
      .eq("slug", slug)
      .eq("status", "active")
      .single();

    if (tenantMatch) return tenantMatch.id;
  }

  return null; // Platform context (no tenant)
}
