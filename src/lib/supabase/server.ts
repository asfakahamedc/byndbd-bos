import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

/**
 * Standard authenticated Supabase client for Server Components, Server Actions,
 * and Route Handlers. Automatically handles reading and writing session cookies.
 * This client is subject to Row Level Security (RLS) rules.
 */
export function createBOSClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    if (typeof window === 'undefined') {
      console.warn("BOS Build Guard: Supabase keys are missing during compilation. Returning null client.");
      return new Proxy({}, {
        get: () => () => Promise.resolve({ data: null, error: null })
      }) as any;
    }
    throw new Error("Missing Supabase Environment Keys.");
  }

  return createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        async getAll() {
          const cookieStore = await cookies();
          return cookieStore.getAll();
        },
        async setAll(cookiesToSet) {
          try {
            const cookieStore = await cookies();
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
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    if (typeof window === 'undefined') {
      console.warn("BOS Build Guard: Supabase admin keys are missing during compilation. Returning null client.");
      return new Proxy({}, {
        get: () => () => Promise.resolve({ data: null, error: null })
      }) as any;
    }
    throw new Error("Missing Supabase Environment Keys.");
  }

  return createServerClient(
    supabaseUrl,
    serviceRoleKey,
    {
      cookies: {
        async getAll() {
          const cookieStore = await cookies();
          return cookieStore.getAll();
        },
        async setAll(cookiesToSet) {
          try {
            const cookieStore = await cookies();
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
