import { NextResponse, type NextRequest } from 'next/server';
import { createBOSAdmin } from '@/lib/supabase/server';

// ── SLA Level Thresholds ───────────────────────────────────────────────────────
// Maps hours-overdue breakpoints to escalation levels and their target roles.
// Levels are cumulative: a task escalates to the highest applicable level.

const SLA_LEVELS = [
  {
    level: 4,
    minHours: 24,
    label: 'Level 4 — Co-Founders',
    targetRole: 'co_founder',
  },
  {
    level: 3,
    minHours: 8,
    label: 'Level 3 — CEO',
    targetRole: 'ceo',
  },
  {
    level: 2,
    minHours: 4,
    label: 'Level 2 — Admin / Operations Lead',
    targetRole: 'operations_lead',
  },
  {
    level: 1,
    minHours: 0,
    label: 'Level 1 — Department Lead',
    targetRole: 'dept_lead',
  },
] as const;

// ── Type definitions ──────────────────────────────────────────────────────────

interface OverdueTask {
  id: string;
  title: string;
  due_date: string;
  assigned_to: string | null;
  status: string;
}

interface EscalationSummaryItem {
  taskId: string;
  taskTitle: string;
  hoursOverdue: number;
  level: number;
  label: string;
  action: 'created' | 'upgraded' | 'unchanged';
}

// ── Helper: derive escalation level from hours overdue ────────────────────────

function getEscalationLevel(hoursOverdue: number): (typeof SLA_LEVELS)[number] {
  // SLA_LEVELS is sorted descending — return the first match
  for (const sla of SLA_LEVELS) {
    if (hoursOverdue >= sla.minHours) {
      return sla;
    }
  }
  return SLA_LEVELS[SLA_LEVELS.length - 1]; // fallback to Level 1
}

// ── Route Handler ─────────────────────────────────────────────────────────────

export async function GET(request: NextRequest) {
  // ── 1. Security Gate: validate CRON_SECRET bearer token ───────────────────
  if (!process.env.CRON_SECRET) {
    console.error('[Escalation Engine] CRON_SECRET environment variable is not set.');
    return NextResponse.json(
      { error: 'Cron secret is not configured on this server.' },
      { status: 500 }
    );
  }

  if (request.headers.get('Authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
    console.warn('[Escalation Engine] Unauthorized cron invocation attempt.');
    return NextResponse.json(
      { error: 'Unauthorized. Valid Authorization: Bearer <CRON_SECRET> header required.' },
      { status: 401 }
    );
  }

  // ── 2. Admin client (bypasses RLS — cron is a system-level actor) ─────────
  const admin = createBOSAdmin();
  const runStartedAt = new Date();
  const summary: EscalationSummaryItem[] = [];

  console.log(`[Escalation Engine] Run started at ${runStartedAt.toISOString()}`);

  try {
    // ── 3. Fetch all overdue, non-terminal tasks ─────────────────────────────
    const { data: overdueTasks, error: fetchError } = await admin
      .from('tasks')
      .select('id, title, due_date, assigned_to, status')
      .not('status', 'in', '("done","archived","Completed")')
      .lt('due_date', runStartedAt.toISOString());

    if (fetchError) {
      console.error('[Escalation Engine] Failed to fetch overdue tasks:', fetchError);
      return NextResponse.json(
        { error: 'Failed to query overdue tasks', details: fetchError.message },
        { status: 500 }
      );
    }

    const tasks = (overdueTasks || []) as OverdueTask[];
    console.log(`[Escalation Engine] Found ${tasks.length} overdue task(s).`);

    if (tasks.length === 0) {
      return NextResponse.json(
        {
          message: 'Escalation Engine: No overdue tasks found.',
          processedAt: runStartedAt.toISOString(),
          escalations: [],
        },
        { status: 200 }
      );
    }

    // ── 4. Process each overdue task ─────────────────────────────────────────
    for (const task of tasks) {
      const dueDate   = new Date(task.due_date);
      const msOverdue = runStartedAt.getTime() - dueDate.getTime();
      const hoursOverdue = msOverdue / (1000 * 60 * 60);

      const sla = getEscalationLevel(hoursOverdue);

      // ── 4a. Check for an existing active escalation on this task ──────────
      const { data: existing, error: lookupError } = await admin
        .from('escalations')
        .select('id, escalation_level')
        .eq('task_id', task.id)
        .eq('status', 'active')
        .maybeSingle();

      if (lookupError) {
        console.error(
          `[Escalation Engine] Lookup failed for task ${task.id}:`,
          lookupError
        );
        continue; // skip this task, don't halt the whole run
      }

      let action: EscalationSummaryItem['action'] = 'unchanged';

      if (!existing) {
        // ── 4b. No active escalation → INSERT a new record ────────────────
        const { error: insertError } = await admin.from('escalations').insert({
          task_id: task.id,
          escalation_level: sla.level,
          status: 'active',
          assigned_to: task.assigned_to ?? null,
          escalated_at: runStartedAt.toISOString(),
          notes: `Auto-escalated after ${hoursOverdue.toFixed(1)}h overdue. Target: ${sla.label}.`,
        });

        if (insertError) {
          console.error(
            `[Escalation Engine] Insert failed for task ${task.id}:`,
            insertError
          );
          continue;
        }

        action = 'created';
        console.log(
          `[Escalation Engine] CREATED escalation for task "${task.title}" → ${sla.label}`
        );
      } else if (existing.escalation_level < sla.level) {
        // ── 4c. Existing escalation is stale (lower level) → UPGRADE it ──
        const { error: updateError } = await admin
          .from('escalations')
          .update({
            escalation_level: sla.level,
            escalated_at: runStartedAt.toISOString(),
            notes: `Upgraded from Level ${existing.escalation_level} to ${sla.level} after ${hoursOverdue.toFixed(1)}h overdue. Target: ${sla.label}.`,
          })
          .eq('id', existing.id);

        if (updateError) {
          console.error(
            `[Escalation Engine] Update failed for escalation ${existing.id}:`,
            updateError
          );
          continue;
        }

        action = 'upgraded';
        console.log(
          `[Escalation Engine] UPGRADED escalation for task "${task.title}" → Level ${existing.escalation_level} → ${sla.label}`
        );
      } else {
        // Existing escalation is already at the correct or higher level — skip
        action = 'unchanged';
      }

      // ── 4d. Write audit log for any create/upgrade action ─────────────────
      if (action !== 'unchanged') {
        const auditPayload = {
          action: `ESCALATION_${action.toUpperCase()}`,
          module: 'ESCALATION_ENGINE',
          entity_type: 'tasks',
          entity_id: task.id,
          new_value: {
            task_title: task.title,
            escalation_level: sla.level,
            sla_label: sla.label,
            hours_overdue: parseFloat(hoursOverdue.toFixed(2)),
            action,
          },
        };

        // Silently swallow audit failures — they should not block cron processing
        await admin.from('audit_log').insert(auditPayload).then(({ error }: { error: any }) => {
          if (error) {
            console.warn(`[Escalation Engine] Audit log write failed for task ${task.id}:`, error);
          }
        });
      }

      summary.push({
        taskId: task.id,
        taskTitle: task.title || '(untitled)',
        hoursOverdue: parseFloat(hoursOverdue.toFixed(2)),
        level: sla.level,
        label: sla.label,
        action,
      });
    }

    // ── 5. Return execution summary ──────────────────────────────────────────
    const runEndedAt = new Date();
    const durationMs = runEndedAt.getTime() - runStartedAt.getTime();

    const created   = summary.filter((s) => s.action === 'created').length;
    const upgraded  = summary.filter((s) => s.action === 'upgraded').length;
    const unchanged = summary.filter((s) => s.action === 'unchanged').length;

    console.log(
      `[Escalation Engine] Run complete in ${durationMs}ms — ` +
      `Created: ${created}, Upgraded: ${upgraded}, Unchanged: ${unchanged}`
    );

    return NextResponse.json(
      {
        message: 'Escalation Engine run complete.',
        processedAt: runStartedAt.toISOString(),
        durationMs,
        stats: { total: tasks.length, created, upgraded, unchanged },
        escalations: summary,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('[Escalation Engine] Unhandled exception:', error);
    return NextResponse.json(
      {
        error: 'Internal server error during escalation run.',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
