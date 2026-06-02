import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

/**
 * Refreshes the user's session token and updates the request/response cookies.
 * This is crucial for keeping Server Component, Server Action, and Route Handler sessions alive.
 * 
 * @param request The incoming Next.js request object.
 * @returns An object containing the updated NextResponse and the authenticated User object (if any).
 */
export async function updateSession(request: NextRequest) {
  // Create an initial response
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          // Update the request cookies to ensure subsequent middleware or route handlers see the new values
          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value);
          });
          
          // Re-create the response to include the updated request headers/cookies
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });

          // Set the updated cookies in the response headers for the browser
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  // Refresh the session if needed and retrieve user profile info
  const { data: { user } } = await supabase.auth.getUser();

  return { response, user };
}
