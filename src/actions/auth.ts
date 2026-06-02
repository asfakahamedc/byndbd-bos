'use server';

import { createBOSClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { BOSUser } from '@/lib/types/auth';

/**
 * Server Action: Fetches the authenticated user profile from Supabase.
 * Connects the auth.getUser() with the public.users database profile.
 */
export async function getCurrentUser(): Promise<BOSUser | null> {
  try {
    // Check for missing or malformed Supabase environment variables on Vercel
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey || supabaseUrl.includes('"') || supabaseAnonKey.includes('"')) {
      throw new Error("Missing or malformed Supabase Environment Variables on Vercel.");
    }

    const supabase = createBOSClient();

    // 1. Retrieve the authenticated user session
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return null;
    }

    // 2. Query the public.users table to resolve user layers & metadata
    const { data: profile, error: dbError } = await supabase
      .from('users')
      .select('layer, department, full_name, status, two_fa_enabled')
      .eq('id', user.id)
      .single();

    if (dbError) {
      throw dbError;
    }

    if (!profile) {
      console.warn(`No database profile found for auth user ID: ${user.id}`);
      return null;
    }

    // 3. Return the fully resolved custom BOSUser profile
    return {
      id: user.id,
      email: user.email || '',
      full_name: profile.full_name || '',
      layer: profile.layer,
      department: profile.department,
      status: profile.status || 'active',
      two_fa_enabled: !!profile.two_fa_enabled,
    };
  } catch (error) {
    console.error('Unhandled error resolving current user profile:', error);
    throw error;
  }
}


/**
 * Server Action: Triggers user sign out and redirects to the login screen.
 */
export async function signOut() {
  const supabase = createBOSClient();
  await supabase.auth.signOut();
  redirect('/login');
}

/**
 * Server Action: Authenticates user credentials using Supabase auth.
 */
export async function signIn(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) {
    return { error: 'Email and password are required' };
  }

  const supabase = createBOSClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  const user = await getCurrentUser();

  let redirectPath = '/login';
  switch (user?.layer) {
    case 0:
      redirectPath = '/owner';
      break;
    case 1:
    case 2:
      redirectPath = '/ceo';
      break;
    case 3:
      redirectPath = '/operations';
      break;
    case 4:
      redirectPath = '/executive';
      break;
    case 5:
      redirectPath = '/host';
      break;
    default:
      redirectPath = '/login';
  }

  redirect(redirectPath);
}

