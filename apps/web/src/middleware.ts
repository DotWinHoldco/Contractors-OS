import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

const PLATFORM_DOMAIN =
  process.env.NEXT_PUBLIC_PLATFORM_DOMAIN || "contractorsos.com";

export async function middleware(request: NextRequest) {
  const { supabase, user, response } = await updateSession(request);
  const pathname = request.nextUrl.pathname;
  const hostname = request.headers.get("host") || "";

  // --- Public / static paths — always allow ---
  const publicPaths = [
    "/",
    "/services",
    "/portfolio",
    "/about",
    "/contact",
    "/book",
    "/faq",
    "/reviews",
  ];
  const isPublicPath = publicPaths.some(
    (p) => pathname === p || pathname.startsWith(p + "/")
  );
  const isAuthPath = pathname.startsWith("/auth");
  const isStaticPath =
    pathname.startsWith("/_next") || pathname.startsWith("/favicon");

  if (isStaticPath) return response;
  if (isPublicPath) return response;

  // If Supabase is not configured, allow all routes (demo mode)
  if (!supabase) {
    return response;
  }

  // --- Tenant Resolution ---
  let tenantId: string | null = null;
  let tenantSlug: string | null = null;

  const isPlatformDomain =
    hostname === PLATFORM_DOMAIN ||
    hostname === `www.${PLATFORM_DOMAIN}` ||
    hostname.includes("localhost") ||
    hostname.includes("127.0.0.1") ||
    hostname.includes("vercel.app");

  if (!isPlatformDomain) {
    try {
      if (hostname.endsWith(`.${PLATFORM_DOMAIN}`)) {
        tenantSlug = hostname.replace(`.${PLATFORM_DOMAIN}`, "");
        const { data } = await supabase
          .from("tenants")
          .select("id")
          .eq("slug", tenantSlug)
          .eq("status", "active")
          .single();
        if (data) tenantId = data.id;
      } else {
        const { data } = await supabase
          .from("tenant_domains")
          .select("tenant_id")
          .eq("domain", hostname)
          .eq("is_verified", true)
          .single();
        if (data) tenantId = data.tenant_id;
      }
    } catch {
      // Supabase query failed — continue without tenant context
    }
  }

  // Set tenant headers on response
  if (tenantId) {
    response.headers.set("x-tenant-id", tenantId);
    response.cookies.set("tenant-id", tenantId, {
      path: "/",
      httpOnly: false,
      sameSite: "lax",
    });
  }
  if (tenantSlug) {
    response.headers.set("x-tenant-slug", tenantSlug);
    response.cookies.set("tenant-slug", tenantSlug, {
      path: "/",
      httpOnly: false,
      sameSite: "lax",
    });
  }

  // --- Route Protection ---
  if (isAuthPath) {
    if (user) {
      return NextResponse.redirect(
        new URL("/admin/dashboard", request.url)
      );
    }
    return response;
  }

  // Protected routes — redirect to login if no user
  if (!user) {
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Platform admin routes
  if (pathname.startsWith("/platform")) {
    return response;
  }

  // Admin routes
  if (pathname.startsWith("/admin")) {
    return response;
  }

  // Portal routes
  if (pathname.startsWith("/portal")) {
    return response;
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
