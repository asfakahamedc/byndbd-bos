'use server';

import { createBOSClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { getCurrentUser } from './auth';

/**
 * Represents a single trip record as returned from public.trips.
 */
export interface Trip {
  id: string;
  booking_ref: string;
  trip_name: string;
  destination_name: string;
  travel_start: string;
  travel_end: string;
  group_size: number;
  status: 'draft' | 'planning' | 'ready' | 'active' | 'completed' | 'cancelled';
  created_by: string | null;
  host_id: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * Server Action: Fetches all trips ordered by travel start date (ascending).
 * RLS ensures the caller is authenticated before any rows are returned.
 */
export async function getTrips(): Promise<Trip[]> {
  const supabase = createBOSClient();
  if (!supabase) return [];

  try {
    const { data, error } = await supabase
      .from('trips')
      .select('*')
      .order('travel_start', { ascending: true });

    if (error) {
      console.error('Error fetching trips from Supabase:', error);
      return [];
    }

    return (data || []) as Trip[];
  } catch (error) {
    console.error('Unhandled error during getTrips execution:', error);
    return [];
  }
}

/**
 * Server Action: Creates a new trip record.
 *
 * - Extracts all required fields from the FormData payload.
 * - Auto-injects the authenticated caller's ID as created_by.
 * - Defaults status to 'draft'.
 * - Triggers revalidation of the /trips route on success.
 *
 * @param formData - FormData with: booking_ref, trip_name, destination_name,
 *                   travel_start, travel_end, group_size.
 * @returns { success: true } on success, or { error: string } on failure.
 */
export async function createTrip(
  formData: FormData
): Promise<{ success: boolean; error?: string }> {
  try {
    // ── 1. Auth Check ─────────────────────────────────────────────────────────
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return { success: false, error: 'You must be signed in to create a trip.' };
    }

    // ── 2. Extract Fields ─────────────────────────────────────────────────────
    const booking_ref      = (formData.get('booking_ref') as string)?.trim();
    const trip_name        = (formData.get('trip_name') as string)?.trim();
    const destination_name = (formData.get('destination_name') as string)?.trim();
    const travel_start     = (formData.get('travel_start') as string)?.trim();
    const travel_end       = (formData.get('travel_end') as string)?.trim();
    const group_size_raw   = formData.get('group_size') as string;

    // ── 3. Validate Required Fields ───────────────────────────────────────────
    if (!booking_ref || !trip_name || !destination_name || !travel_start || !travel_end || !group_size_raw) {
      return { success: false, error: 'All fields are required.' };
    }

    const group_size = parseInt(group_size_raw, 10);
    if (isNaN(group_size) || group_size < 1) {
      return { success: false, error: 'Group size must be a positive number.' };
    }

    if (travel_end < travel_start) {
      return { success: false, error: 'End date must be on or after the start date.' };
    }

    // ── 4. Insert via BOS Client (RLS-scoped) ────────────────────────────────
    const supabase = createBOSClient();
  if (!supabase) return { success: false, error: "Supabase not initialized" };

    const { error } = await supabase.from('trips').insert({
      booking_ref,
      trip_name,
      destination_name,
      travel_start,
      travel_end,
      group_size,
      status: 'draft',
      created_by: currentUser.id,
    });

    if (error) {
      console.error('Error inserting trip into Supabase:', error);
      if (error.code === '23505') {
        return { success: false, error: `Booking reference "${booking_ref}" already exists.` };
      }
      return { success: false, error: error.message };
    }

    // ── 5. Invalidate Cache ───────────────────────────────────────────────────
    revalidatePath('/trips');

    return { success: true };
  } catch (error) {
    console.error('Unhandled error during createTrip execution:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unexpected error occurred.',
    };
  }
}
