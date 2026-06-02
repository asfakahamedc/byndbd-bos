import { NextResponse, type NextRequest } from 'next/server';
import { createBOSAdmin } from '@/lib/supabase/server';

// Helper to generate a random 8-character string for temporary passwords
function generateTempPassword(name: string) {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()';
  let rand = '';
  for (let i = 0; i < 8; i++) {
    rand += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `BOS-${name}-${rand}`;
}

async function handleInit(request: NextRequest) {
  try {
    const admin = createBOSAdmin();

    // 1. Security Gate: Verify the system is in an uninitialized state
    // Check if there are any records in public.users table
    const { count, error: countError } = await admin
      .from('users')
      .select('id', { count: 'exact', head: true });

    if (countError) {
      console.error('Bootstrapping error verifying users count:', countError);
      return NextResponse.json(
        { error: 'Failed to verify system initialization state' },
        { status: 500 }
      );
    }

    if (count !== null && count > 0) {
      return NextResponse.json(
        { error: 'System already initialized. Action forbidden.' },
        { status: 403 }
      );
    }

    // 2. Define Master Co-Founder Users
    const coFounders = [
      {
        email: 'asfakahamedc@gmail.com',
        fullName: 'Asfak Ahamed Chowdhury',
        tempPass: generateTempPassword('Asfak'),
      },
      {
        email: 'maharubhossainmaruf@gmail.com',
        fullName: 'Maharub Hossain Maruf',
        tempPass: generateTempPassword('Maruf'),
      },
    ];

    const ipAddress = request.headers.get('x-forwarded-for')?.split(',')[0].trim() || request.ip || '127.0.0.1';
    const userAgent = request.headers.get('user-agent') || 'system-seeder';

    const createdUsers = [];

    for (const cf of coFounders) {
      // Step A: Create authenticated identity with auto email verification
      const { data: authData, error: authError } = await admin.auth.admin.createUser({
        email: cf.email,
        password: cf.tempPass,
        email_confirm: true,
      });

      if (authError || !authData.user) {
        console.error(`Bootstrap failed to create auth identity for ${cf.email}:`, authError);
        return NextResponse.json(
          { error: `Auth identity creation failed for ${cf.email}`, details: authError },
          { status: 500 }
        );
      }

      const userId = authData.user.id;

      // Step B: Insert the dynamic user profile into public.users
      const { error: dbError } = await admin
        .from('users')
        .insert({
          id: userId,
          email: cf.email,
          full_name: cf.fullName,
          layer: 0,
          status: 'active',
          two_fa_enabled: false,
        });

      if (dbError) {
        console.error(`Bootstrap failed to insert profile row for ${cf.email}:`, dbError);
        // Safety Clean Up: delete the created auth identity so seeding can be re-run
        await admin.auth.admin.deleteUser(userId);
        return NextResponse.json(
          { error: `Database profile insertion failed for ${cf.email}`, details: dbError },
          { status: 500 }
        );
      }

      // Step C: Log the creation event in public.audit_log
      const { error: auditError } = await admin
        .from('audit_log')
        .insert({
          user_id: userId,
          action: 'SYSTEM_INIT: Created Co-Founder',
          module: 'SYSTEM_SETUP',
          entity_type: 'users',
          entity_id: userId,
          new_value: { email: cf.email, full_name: cf.fullName, layer: 0 },
          ip_address: ipAddress,
          user_agent: userAgent,
        });

      if (auditError) {
        // Log auditing failure, but don't halt bootstrapping as main entities are stored
        console.error(`Audit logging failed for seeded user ${cf.email}:`, auditError);
      }

      createdUsers.push({
        email: cf.email,
        fullName: cf.fullName,
        password: cf.tempPass,
        userId: userId,
      });
    }

    // 3. Return successfully seeded Co-Founder credentials
    return NextResponse.json(
      {
        message: 'System initialized successfully. Co-Founder accounts seeded.',
        coFounders: createdUsers,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Bootstrap unhandled exception:', error);
    return NextResponse.json(
      { error: 'Internal server error occurred during bootstrap setup' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  return handleInit(request);
}

export async function POST(request: NextRequest) {
  return handleInit(request);
}
