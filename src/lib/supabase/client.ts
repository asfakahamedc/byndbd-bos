import { createBrowserClient } from '@supabase/ssr';

/**
 * Creates a Supabase client for use in browser/client environments.
 */
export function createBOSBrowserClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

// Export a singleton instance for standard client component usage
export const supabase = createBOSBrowserClient();
