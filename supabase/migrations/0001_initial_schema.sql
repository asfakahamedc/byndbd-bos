-- ============================================================
-- Migration: 0001_initial_schema.sql
-- Creates the base tables for Bynd BD BOS.
-- ============================================================

-- ── 1. Create public.users table ──────────────────────────────
CREATE TABLE IF NOT EXISTS public.users (
  id             UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email          TEXT NOT NULL UNIQUE,
  full_name      TEXT NOT NULL,
  layer          INTEGER NOT NULL CHECK (layer BETWEEN 0 AND 6),
  department     TEXT,
  status         TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'offboarded')),
  two_fa_enabled BOOLEAN NOT NULL DEFAULT false,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── 2. Create public.projects table ───────────────────────────
CREATE TABLE IF NOT EXISTS public.projects (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title        TEXT NOT NULL,
  description  TEXT,
  progress     INTEGER NOT NULL DEFAULT 0 CHECK (progress BETWEEN 0 AND 100),
  status       TEXT NOT NULL DEFAULT 'Planning' CHECK (status IN ('Healthy', 'At Risk', 'Planning')),
  icon_name    TEXT,
  iconName     TEXT,
  assignees    JSONB,
  owner_id     UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_by   UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── 3. Create public.tasks table ──────────────────────────────
CREATE TABLE IF NOT EXISTS public.tasks (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title        TEXT NOT NULL,
  priority     TEXT NOT NULL DEFAULT 'Medium' CHECK (priority IN ('Critical', 'High', 'Medium', 'Low')),
  status       TEXT NOT NULL DEFAULT 'Not Started' CHECK (status IN ('Not Started', 'In Progress', 'Review', 'Completed')),
  due_date     TIMESTAMPTZ,
  assigned_to  JSONB,
  project_id   UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  project      TEXT,
  assigned_by  UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── 4. Create public.audit_log table ──────────────────────────
CREATE TABLE IF NOT EXISTS public.audit_log (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id        UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  action         TEXT NOT NULL,
  module         TEXT,
  entity_type    TEXT,
  entity_id      UUID,
  new_value      JSONB,
  performed_by   UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  target_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  metadata       JSONB,
  ip_address     TEXT,
  user_agent     TEXT,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── 5. Enable Row Level Security ──────────────────────────────
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;

-- ── 6. RLS Policies ───────────────────────────────────────────

-- users table policies
CREATE POLICY "users_read_all" ON public.users FOR SELECT TO authenticated USING (true);
CREATE POLICY "users_write_self" ON public.users FOR ALL TO authenticated USING (auth.uid() = id);
CREATE POLICY "users_admin_all" ON public.users FOR ALL TO service_role USING (true);

-- projects table policies
CREATE POLICY "projects_read_all" ON public.projects FOR SELECT TO authenticated USING (true);
CREATE POLICY "projects_write_all" ON public.projects FOR ALL TO authenticated USING (true);

-- tasks table policies
CREATE POLICY "tasks_read_all" ON public.tasks FOR SELECT TO authenticated USING (true);
CREATE POLICY "tasks_write_all" ON public.tasks FOR ALL TO authenticated USING (true);

-- audit_log table policies
CREATE POLICY "audit_log_read_all" ON public.audit_log FOR SELECT TO authenticated USING (true);
CREATE POLICY "audit_log_write_all" ON public.audit_log FOR ALL TO authenticated USING (true);
