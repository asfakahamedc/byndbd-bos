'use server';

import { createBOSClient } from '@/lib/supabase/server';

/**
 * Server Action: Fetches active users to populate assignee dropdowns in the UI.
 */
export async function getUsers() {
  const supabase = createBOSClient();

  try {
    const { data, error } = await supabase
      .from('users')
      .select('id, full_name, layer, department')
      .eq('status', 'active');

    if (error) {
      console.error('Error fetching active users from Supabase:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Unhandled error during getUsers execution:', error);
    return [];
  }
}
