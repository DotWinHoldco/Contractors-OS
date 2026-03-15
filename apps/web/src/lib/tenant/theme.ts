import type { TenantTheme } from "./context";

export function themeToCSS(theme: TenantTheme): Record<string, string> {
  return {
    "--tenant-primary": theme.color_primary,
    "--tenant-secondary": theme.color_secondary,
    "--tenant-accent": theme.color_accent,
    "--tenant-background": theme.color_background,
    "--tenant-surface": theme.color_surface,
    "--tenant-text": theme.color_text,
    "--tenant-text-secondary": theme.color_text_secondary,
    "--color-success": theme.color_success,
    "--color-warning": theme.color_warning,
    "--color-error": theme.color_error,
    "--border-radius": theme.border_radius,
  };
}

export const defaultTheme: TenantTheme = {
  color_primary: "#000000",
  color_secondary: "#1a1a1a",
  color_accent: "#d4a84b",
  color_background: "#ffffff",
  color_surface: "#f8f8f8",
  color_text: "#1a1a1a",
  color_text_secondary: "#555555",
  color_success: "#2d6a4f",
  color_warning: "#cc8a00",
  color_error: "#c1292e",
  border_radius: "8px",
  font_heading: "Outfit",
  font_body: "Outfit",
  logo_url: null,
  logo_icon_url: null,
  favicon_url: null,
};
