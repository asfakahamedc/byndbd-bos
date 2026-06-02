import { NextResponse, type NextRequest } from 'next/server';
import { updateSession } from './lib/supabase/middleware';

/**
 * Global Edge Middleware for routing and session validation.
 * Keeps user session alive and enforces protected route access control.
 */
export async function middleware(request: NextRequest) {
  // Call updateSession to refresh the session token and get the user
  const { response, user } = await updateSession(request);

  const { pathname } = request.nextUrl;

  // Security Rules for dashboard paths
  if (pathname.startsWith('/dashboard')) {
    // Rule 1: Redirect to /login if there is no active session
    if (!user) {
      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = '/login';
      // Store current path as redirect query param
      loginUrl.searchParams.set('next', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Rule 2: Custom claims / layer extraction and 2FA verification
    // Extracting user roles or security layers from metadata:
    // e.g., const userLayer = user.app_metadata?.layer ?? user.user_metadata?.layer;
    // e.g., const twoFaEnabled = user.app_metadata?.two_fa_enabled ?? user.user_metadata?.two_fa_enabled;

    /**
     * @todo
     * 1. Fetch the complete BOSUser profile from the database (via createBOSClient or database query)
     *    to verify actual 2FA registration status and verify that JWT claims are not stale.
     * 2. For users belonging to Security Layers 0, 1, and 2, enforce multi-factor authentication:
     *    If 2FA is not fully verified/enabled for these layers, redirect the request to a 2FA verification flow (e.g., /auth/2fa).
     */
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public assets (svg, png, jpg, jpeg, gif, webp)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
