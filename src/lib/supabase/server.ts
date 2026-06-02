import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

/**
 * Standard authenticated Supabase client for Server Components, Server Actions,
 * and Route Handlers. Automatically handles reading and writing session cookies.
 * This client is subject to Row Level Security (RLS) rules.
 */
export function createBOSClient() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    if (process.env.NODE_ENV === 'production' && typeof window === 'undefined') {
      console.warn("BOS Warning: Supabase credentials are missing during static generation. Skipping client initialization.");
      return null;
    }
    throw new Error("Missing or malformed Supabase Environment Variables.");
  }

  const cookieStore = cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing user sessions.
          }
        },
      },
    }
  );
}

/**
 * @name createBOSAdmin
 * @description High-privilege administrative Supabase client utilizing the service role key.
 * Bypasses Row Level Security (RLS).
 * 
 * @warning STRICT SECURITY NOTICE:
 * - NEVER expose this client or the SUPABASE_SERVICE_ROLE_KEY to the browser/client-side.
 * - This client should ONLY be used in secure server environments (API routes, system webhooks)
 *   for initial user registration, admin tasks, or operations that require system-level access.
 * - Under no circumstances should this be utilized for typical user-facing operations or flows.
 */
export function createBOSAdmin() {
  const cookieStore = cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing user sessions.
          }
        },
      },
    }
  );
}
