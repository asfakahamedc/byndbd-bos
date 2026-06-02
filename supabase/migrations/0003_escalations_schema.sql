-- ============================================================
-- Migration: 0003_escalations_schema.sql
-- Creates the public.escalations table for the automated
-- Escalation Engine. Escalation records are system-generated
-- by the /api/cron/escalate background job.
-- ============================================================

-- ── Create escalations table ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.escalations (
  id                UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id           UUID        NOT NULL REFERENCES public.tasks(id) ON DELETE CASCADE,
  escalation_level  INTEGER     NOT NULL CHECK (escalation_level BETWEEN 1 AND 4),
  status            TEXT        NOT NULL DEFAULT 'active'
                                  CHECK (status IN ('active', 'resolved')),
  assigned_to       UUID        REFERENCES auth.users(id) ON DELETE SET NULL,
  escalated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  resolved_at       TIMESTAMPTZ,
  notes             TEXT,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── Unique constraint: one active escalation per task ────────────────────────
-- Prevents duplicate active escalation rows for the same task.
CREATE UNIQUE INDEX IF NOT EXISTS escalations_task_active_unique
  ON public.escalations (task_id)
  WHERE status = 'active';

-- ── General indexes ───────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS escalations_task_id_idx   ON public.escalations (task_id);
CREATE INDEX IF NOT EXISTS escalations_status_idx    ON public.escalations (status);
CREATE INDEX IF NOT EXISTS escalations_level_idx     ON public.escalations (escalation_level);
CREATE INDEX IF NOT EXISTS escalations_assigned_idx  ON public.escalations (assigned_to);

-- ── Auto-update updated_at ───────────────────────────────────────────────────
DROP TRIGGER IF EXISTS escalations_updated_at ON public.escalations;
CREATE TRIGGER escalations_updated_at
  BEFORE UPDATE ON public.escalations
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ── Enable Row Level Security ─────────────────────────────────────────────────
ALTER TABLE public.escalations ENABLE ROW LEVEL SECURITY;

-- ── RLS Policies ──────────────────────────────────────────────────────────────

-- Authenticated users may read all escalations (visibility across org)
CREATE POLICY "escalations_read_authenticated"
  ON public.escalations
  FOR SELECT
  TO authenticated
  USING (true);

-- Only the service role (cron job via createBOSAdmin) may insert/update escalations.
-- Regular authenticated users cannot create or mutate escalations directly.
-- No INSERT / UPDATE / DELETE policies are defined for authenticated users;
-- the cron route uses the service_role key which bypasses RLS entirely.
