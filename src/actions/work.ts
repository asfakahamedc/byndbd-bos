'use server';

import { createBOSClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { getCurrentUser } from './auth';

/**
 * Server Action: Fetches active tasks from the public.tasks table.
 * Supabase Row Level Security (RLS) handles filtering by active user scope.
 */
export async function getTasks() {
  const supabase = createBOSClient();
  if (!supabase) return null;

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
  if (!supabase) return null;

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

/**
 * Server Action: Fetches all projects from the public.projects table.
 */
export async function getProjects() {
  const supabase = createBOSClient();
  if (!supabase) return null;

  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching projects from Supabase:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Unhandled error during getProjects execution:', error);
    return [];
  }
}

/**
 * Server Action: Inserts a new project, auto-injecting owner and creator attributes.
 */
export async function createProject(data: Record<string, unknown>) {
  const supabase = createBOSClient();
  if (!supabase) return null;

  try {
    const user = await getCurrentUser();
    if (!user) {
      throw new Error('User is unauthenticated');
    }

    const { data: newProject, error } = await supabase
      .from('projects')
      .insert({
        ...data,
        owner_id: user.id,
        created_by: user.id,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating project in Supabase:', error);
      throw error;
    }

    revalidatePath('/work');
    return newProject;
  } catch (error) {
    console.error('Unhandled error during createProject execution:', error);
    throw error;
  }
}

/**
 * Server Action: Inserts a new task, auto-assigning/assigning_by attributes.
 */
export async function createTask(data: Record<string, unknown>) {
  const supabase = createBOSClient();
  if (!supabase) return null;

  try {
    const user = await getCurrentUser();
    if (!user) {
      throw new Error('User is unauthenticated');
    }

    const { data: newTask, error } = await supabase
      .from('tasks')
      .insert({
        ...data,
        assigned_by: user.id,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating task in Supabase:', error);
      throw error;
    }

    revalidatePath('/work');
    revalidatePath('/executive');
    return newTask;
  } catch (error) {
    console.error('Unhandled error during createTask execution:', error);
    throw error;
  }
}
