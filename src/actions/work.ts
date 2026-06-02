'use server';

import { createBOSClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

/**
 * Server Action: Fetches active tasks from the public.tasks table.
 * Supabase Row Level Security (RLS) handles filtering by active user scope.
 */
export async function getTasks() {
  const supabase = createBOSClient();

  try {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .order('priority', { ascending: true })
      .order('due_date', { ascending: true });

    if (error) {
      console.error('Error fetching tasks from Supabase:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Unhandled error during getTasks execution:', error);
    return [];
  }
}

/**
 * Server Action: Updates a task status and triggers layout revalidation.
 */
export async function updateTaskStatus(taskId: string, status: string) {
  const supabase = createBOSClient();

  try {
    const { error } = await supabase
      .from('tasks')
      .update({ status })
      .eq('id', taskId);

    if (error) {
      console.error(`Error updating status for task ${taskId}:`, error);
      throw error;
    }

    // Trigger visual updates on dashboard views
    revalidatePath('/work');
    revalidatePath('/executive');
    
    return { success: true };
  } catch (error) {
    console.error('Unhandled error during updateTaskStatus execution:', error);
    throw error;
  }
}
