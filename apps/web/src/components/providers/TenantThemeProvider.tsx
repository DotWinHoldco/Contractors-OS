"use client";

import { useTenant } from "@/lib/tenant/context";
import { themeToCSS } from "@/lib/tenant/theme";

export function TenantThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { theme } = useTenant();

  if (!theme) return <>{children}</>;

  const cssVars = themeToCSS(theme) as React.CSSProperties;

  return <div style={cssVars}>{children}</div>;
}
