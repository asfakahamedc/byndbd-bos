'use server';

import { createBOSClient, createBOSAdmin } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { getCurrentUser } from './auth';

/**
 * Defines the structure of a BOS team member profile as returned by the directory query.
 */
export interface TeamMember {
  id: string;
  full_name: string;
  email: string;
  layer: number;
  department: string | null;
  status: 'active' | 'inactive' | 'offboarded';
  created_at: string;
}

/**
 * Server Action: Fetches all user profiles from the public.users table.
 * Used to populate the Team Directory. The logged-in user's own profile is also
 * included. RLS ensures only authorized callers can read this data.
 */
export async function getTeamMembers(): Promise<TeamMember[]> {
  const supabase = createBOSClient();
  if (!supabase) return [];

  try {
    const { data, error } = await supabase
      .from('users')
      .select('id, full_name, email, layer, department, status, created_at')
      .order('layer', { ascending: true })
      .order('full_name', { ascending: true });

    if (error) {
      console.error('Error fetching team members from Supabase:', error);
      return [];
    }

    return (data || []) as TeamMember[];
  } catch (error) {
    console.error('Unhandled error during getTeamMembers execution:', error);
    return [];
  }
}

/**
 * Server Action: Invites a new team member into the BOS system.
 *
 * Security Model:
 * - Uses `createBOSAdmin` to call auth.admin.inviteUserByEmail, bypassing RLS for
 *   the user creation step. This is necessary because only the service_role key
 *   has permission to create auth users and insert profiles.
 * - Only Layer 0–2 users (Owner, CEO, Operations Lead) should be permitted to
 *   call this action; authorization is enforced server-side before any DB write.
 *
 * @param formData - FormData containing: full_name, email, layer, department.
 * @returns { success: true } on success, or { error: string } on failure.
 */
export async function inviteTeamMember(
  formData: FormData
): Promise<{ success: boolean; error?: string }> {
  try {
    // ── 1. Authorization Gate ─────────────────────────────────────────────────
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return { success: false, error: 'You must be signed in to invite members.' };
    }
    if (currentUser.layer > 2) {
      return {
        success: false,
        error: 'Insufficient permissions. Only Layer 0–2 users may invite team members.',
      };
    }

    // ── 2. Extract & Validate Fields ─────────────────────────────────────────
    const full_name = (formData.get('full_name') as string)?.trim();
    const email = (formData.get('email') as string)?.trim().toLowerCase();
    const layerRaw = formData.get('layer') as string;
    const department = (formData.get('department') as string)?.trim() || null;

    if (!full_name || !email || !layerRaw) {
      return { success: false, error: 'Full name, email, and layer are required.' };
    }

    const layer = parseInt(layerRaw, 10);
    if (isNaN(layer) || layer < 0 || layer > 6) {
      return { success: false, error: 'Invalid layer value. Must be between 0 and 6.' };
    }

    // ── 3. Admin Client for Bypassing RLS ────────────────────────────────────
    const adminSupabase = createBOSAdmin();

    // ── 4. Create Auth User via Admin Invite API ──────────────────────────────
    const { data: inviteData, error: inviteError } =
      await adminSupabase.auth.admin.inviteUserByEmail(email, {
        data: { full_name },
      });

    if (inviteError) {
      console.error('Supabase auth.admin.inviteUserByEmail error:', inviteError);
      // Surface a clean, user-readable error
      if (inviteError.message.toLowerCase().includes('already registered')) {
        return { success: false, error: 'A user with this email address already exists in the system.' };
      }
      return { success: false, error: inviteError.message };
    }

    const newUserId = inviteData?.user?.id;
    if (!newUserId) {
      return { success: false, error: 'Invite succeeded but no user ID was returned. Contact system admin.' };
    }

    // ── 5. Upsert Public Profile (bypass RLS via admin client) ───────────────
    const { error: profileError } = await adminSupabase
      .from('users')
      .upsert({
        id: newUserId,
        full_name,
        email,
        layer,
        department,
        status: 'active',
        two_fa_enabled: false,
      });

    if (profileError) {
      console.error('Error inserting profile into public.users:', profileError);
      return {
        success: false,
        error: `Auth user created but profile write failed: ${profileError.message}`,
      };
    }

    // ── 6. Write Audit Log ────────────────────────────────────────────────────
    await adminSupabase.from('audit_log').insert({
      action: 'INVITE_TEAM_MEMBER',
      performed_by: currentUser.id,
      target_user_id: newUserId,
      metadata: {
        invited_email: email,
        assigned_layer: layer,
        assigned_department: department,
        invited_by_layer: currentUser.layer,
      },
    });

    // ── 7. Revalidate Team Directory Cache ────────────────────────────────────
    revalidatePath('/team');

    return { success: true };
  } catch (error) {
    console.error('Unhandled error during inviteTeamMember execution:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unexpected error occurred.',
    };
  }
}
