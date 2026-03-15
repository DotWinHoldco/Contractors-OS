"use client";

import { createContext, useContext, type ReactNode } from "react";

export interface TenantTheme {
  color_primary: string;
  color_secondary: string;
  color_accent: string;
  color_background: string;
  color_surface: string;
  color_text: string;
  color_text_secondary: string;
  color_success: string;
  color_warning: string;
  color_error: string;
  border_radius: string;
  font_heading: string;
  font_body: string;
  logo_url: string | null;
  logo_icon_url: string | null;
  favicon_url: string | null;
}

export interface Tenant {
  id: string;
  name: string;
  slug: string;
  status: string;
  business_type: string;
  phone: string | null;
  email: string | null;
  website: string | null;
  address_line1: string | null;
  address_city: string | null;
  address_state: string | null;
  address_zip: string | null;
  service_area_description: string | null;
  tagline: string | null;
}

export interface TenantContextValue {
  tenant: Tenant | null;
  theme: TenantTheme | null;
  tenantId: string | null;
  isPlatform: boolean;
}

const TenantContext = createContext<TenantContextValue>({
  tenant: null,
  theme: null,
  tenantId: null,
  isPlatform: true,
});

export function TenantProvider({
  children,
  tenant,
  theme,
}: {
  children: ReactNode;
  tenant: Tenant | null;
  theme: TenantTheme | null;
}) {
  return (
    <TenantContext.Provider
      value={{
        tenant,
        theme,
        tenantId: tenant?.id ?? null,
        isPlatform: !tenant,
      }}
    >
      {children}
    </TenantContext.Provider>
  );
}

export function useTenant() {
  const context = useContext(TenantContext);
  if (context === undefined) {
    throw new Error("useTenant must be used within a TenantProvider");
  }
  return context;
}
