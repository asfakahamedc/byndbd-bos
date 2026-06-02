-- ============================================================
-- Migration: 0002_trips_schema.sql
-- Creates the public.trips table for the Bynd BD BOS Trips Module.
-- Run via: supabase db push  or  psql -f this file
-- ============================================================

-- ── Create trips table ────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.trips (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_ref      TEXT NOT NULL UNIQUE,
  trip_name        TEXT NOT NULL,
  destination_name TEXT NOT NULL,
  travel_start     DATE NOT NULL,
  travel_end       DATE NOT NULL,
  group_size       INTEGER NOT NULL DEFAULT 1 CHECK (group_size > 0),
  status           TEXT NOT NULL DEFAULT 'draft'
                     CHECK (status IN ('draft', 'planning', 'ready', 'active', 'completed', 'cancelled')),
  created_by       UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  host_id          UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── Indexes ───────────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS trips_booking_ref_idx ON public.trips (booking_ref);
CREATE INDEX IF NOT EXISTS trips_status_idx      ON public.trips (status);
CREATE INDEX IF NOT EXISTS trips_travel_start_idx ON public.trips (travel_start);
CREATE INDEX IF NOT EXISTS trips_host_id_idx     ON public.trips (host_id);

-- ── Auto-update updated_at ───────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trips_updated_at ON public.trips;
CREATE TRIGGER trips_updated_at
  BEFORE UPDATE ON public.trips
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ── Enable Row Level Security ─────────────────────────────────────────────────
ALTER TABLE public.trips ENABLE ROW LEVEL SECURITY;

-- ── RLS Policies ──────────────────────────────────────────────────────────────

-- Authenticated users may read all trips (Operations-level visibility)
CREATE POLICY "trips_read_authenticated"
  ON public.trips
  FOR SELECT
  TO authenticated
  USING (true);

-- Creators may insert their own trips
CREATE POLICY "trips_insert_own"
  ON public.trips
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = created_by);

-- Creators and the assigned host may update a trip
CREATE POLICY "trips_update_own_or_host"
  ON public.trips
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = created_by OR auth.uid() = host_id)
  WITH CHECK (auth.uid() = created_by OR auth.uid() = host_id);

-- Only the creator may delete a trip
CREATE POLICY "trips_delete_own"
  ON public.trips
  FOR DELETE
  TO authenticated
  USING (auth.uid() = created_by);
