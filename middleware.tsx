import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

/**
 * Middleware function that handles authentication redirection
 * @param request - The incoming Next.js request object
 * @returns NextResponse for redirection or continuation
 */
export async function middleware(request: NextRequest) {
  // Check for existing session cookies
  const cookies = getSessionCookie(request);

  // Check if current page is the auth page (root path)
  const isAuthPage = request.nextUrl.pathname === "/";

  // If no cookies and not on auth page, redirect to auth page
  if (!cookies && !isAuthPage) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // If cookies exist and user is on auth page, redirect to chat
  if (cookies && isAuthPage) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Continue with the request if no redirection is needed
  return NextResponse.next();
}

/**
 * Configuration object specifying which paths should run this middleware
 */
export const config = {
  // Only run middleware on root path and all chat paths
  matcher: ["/chat/:path*", "/api/project"],
};
