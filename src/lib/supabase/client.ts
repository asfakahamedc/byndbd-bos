import { createBrowserClient } from '@supabase/ssr';

/**
 * Creates a Supabase client for use in browser/client environments.
 */
export function createBOSBrowserClient() {
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

  return createBrowserClient(
    supabaseUrl,
    supabaseAnonKey
  );
}

// Export a singleton instance for standard client component usage
export const supabase = createBOSBrowserClient();
