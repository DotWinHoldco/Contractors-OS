import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  const { user, response } = await updateSession(request);
  const pathname = request.nextUrl.pathname;

  // Public routes — no auth required
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
  if (isAuthPath) {
    if (user) {
      return Response.redirect(new URL("/admin/dashboard", request.url));
    }
    return response;
  }
  if (isPublicPath) return response;

  // Protected routes — redirect to login if no user
  if (!user) {
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return Response.redirect(loginUrl);
  }

  // TODO Phase 2: Add tenant resolution here
  // TODO Phase 2: Add role-based route protection here

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
