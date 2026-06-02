import { NextResponse, type NextRequest } from 'next/server';
import { createBOSAdmin } from '@/lib/supabase/server';
import { auditLogSchema } from '@/lib/validations/audit';
import { ZodError } from 'zod';

/**
 * API route to securely record immutable audit logs.
 * Bypasses RLS restrictions using createBOSAdmin client to ensure
 * application logging succeeds regardless of client-side restrictions.
 */
export async function POST(request: NextRequest) {
  try {
    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: 'Invalid JSON body' },
        { status: 400 }
      );
    }

    // Validate the request body
    const validatedData = auditLogSchema.parse(body);

    // Extract IP address and User-Agent headers
    const ipAddress = request.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    // Initialize the admin client to bypass Row Level Security
    const supabase = createBOSAdmin();

    // Execute the Supabase insert into the audit_log table
    const { error } = await supabase
      .from('audit_log')
      .insert({
        user_id: validatedData.user_id,
        action: validatedData.action,
        module: validatedData.module,
        entity_type: validatedData.entity_type,
        entity_id: validatedData.entity_id,
        old_value: validatedData.old_value,
        new_value: validatedData.new_value,
        ip_address: ipAddress,
        user_agent: userAgent,
      });

    if (error) {
      console.error('Supabase audit log insertion failed:', error);
      return NextResponse.json(
        { error: 'Internal database insertion failure' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.issues },
        { status: 400 }
      );
    }

    console.error('Unexpected error in audit log API route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
