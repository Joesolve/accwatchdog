import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the path is an admin route (excluding login)
  if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login")) {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    // If no token, redirect to login
    if (!token) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Check role-based access for specific routes
    const userRole = token.role as string;

    // Only admins can access user management
    if (pathname.startsWith("/admin/users") && userRole !== "ADMIN") {
      return NextResponse.redirect(new URL("/admin", request.url));
    }

    // Viewers can only view, not edit
    if (
      userRole === "VIEWER" &&
      (pathname.includes("/new") || pathname.includes("/edit"))
    ) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
