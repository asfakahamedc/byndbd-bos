import React from 'react';
import { Metadata } from 'next';
import { ChevronRight, Plane, Users, CalendarCheck, TrendingUp } from 'lucide-react';
import { getTrips } from '@/actions/trips';
import { TripsTable } from '@/components/trips/trips-table';
import { TripsControls } from '@/components/trips/trips-controls';

export const metadata: Metadata = {
  title: 'Trips Management | Bynd BD BOS',
  description:
    'Manage and monitor all travel operations, group trips, and logistics across the Bynd BD Business Operating System.',
};

/**
 * Trips Management Page.
 *
 * Async Server Component — fetches all trips from the database, computes
 * summary stats from the live dataset, and renders the TripsTable with
 * the TripsControls header action.
 */
export default async function TripsManagementPage() {
  const trips = await getTrips();

  // ── Compute summary stats from live data ────────────────────────────────────
  const activeCount    = trips.filter((t) => t.status === 'active').length;
  const planningCount  = trips.filter((t) => t.status === 'planning' || t.status === 'ready').length;
  const totalTravelers = trips.reduce((sum, t) => sum + (t.group_size || 0), 0);
  const completedCount = trips.filter((t) => t.status === 'completed').length;

  return (
    <div className="space-y-xl">

      {/* ── Page Header ──────────────────────────────────────────────────────── */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-md mb-xl">
        <div>
          {/* Breadcrumbs */}
          <nav className="flex items-center text-label text-outline mb-xs">
            <span>Operations</span>
            <ChevronRight className="w-3.5 h-3.5 mx-xs" />
            <span className="text-on-surface-variant font-medium">Trips Management</span>
          </nav>
          <h2 className="text-h1 text-on-background">Trips Management</h2>
          <p className="text-body text-on-surface-variant mt-xs">
            Manage and monitor global travel operations and logistics.
          </p>
        </div>

        {/* Create Trip CTA */}
        <TripsControls />
      </section>

      {/* ── Summary Stats Bento Grid ─────────────────────────────────────────── */}
      <section className="grid grid-cols-2 sm:grid-cols-4 gap-md mb-xl">

        {/* Active Trips */}
        <div className="bg-white border border-outline-variant p-md rounded-none flex flex-col justify-between hover:shadow-sm transition-shadow">
          <div className="flex justify-between items-start mb-md">
            <p className="text-label text-on-surface-variant uppercase tracking-wider">Active Trips</p>
            <Plane className="w-5 h-5 text-primary shrink-0" />
          </div>
          <p className="text-h1 font-bold text-primary">{activeCount}</p>
          <p className="text-label text-on-surface-variant mt-xs flex items-center gap-xs">
            <TrendingUp className="w-3.5 h-3.5" />
            Currently running
          </p>
        </div>

        {/* Planning / Ready */}
        <div className="bg-white border border-outline-variant p-md rounded-none flex flex-col justify-between hover:shadow-sm transition-shadow">
          <div className="flex justify-between items-start mb-md">
            <p className="text-label text-on-surface-variant uppercase tracking-wider">In Pipeline</p>
            <CalendarCheck className="w-5 h-5 text-amber-500 shrink-0" />
          </div>
          <p className="text-h1 font-bold text-amber-600">{planningCount}</p>
          <p className="text-label text-on-surface-variant mt-xs">Planning &amp; Ready</p>
        </div>

        {/* Total Travelers */}
        <div className="bg-white border border-outline-variant p-md rounded-none flex flex-col justify-between hover:shadow-sm transition-shadow">
          <div className="flex justify-between items-start mb-md">
            <p className="text-label text-on-surface-variant uppercase tracking-wider">Total Travelers</p>
            <Users className="w-5 h-5 text-teal-600 shrink-0" />
          </div>
          <p className="text-h1 font-bold text-teal-700">{totalTravelers.toLocaleString()}</p>
          <p className="text-label text-on-surface-variant mt-xs">Across all trips</p>
        </div>

        {/* Completed */}
        <div className="bg-white border border-outline-variant p-md rounded-none flex flex-col justify-between hover:shadow-sm transition-shadow">
          <div className="flex justify-between items-start mb-md">
            <p className="text-label text-on-surface-variant uppercase tracking-wider">Completed</p>
            <CalendarCheck className="w-5 h-5 text-[#10B981] shrink-0" />
          </div>
          <p className="text-h1 font-bold text-[#10B981]">{completedCount}</p>
          <p className="text-label text-on-surface-variant mt-xs">Successfully closed</p>
        </div>
      </section>

      {/* ── Trips Data Table ─────────────────────────────────────────────────── */}
      <section>
        <div className="flex items-center gap-sm mb-md">
          <Plane className="w-5 h-5 text-primary" />
          <h3 className="text-h3 font-bold text-on-background">All Trips</h3>
        </div>

        <TripsTable trips={trips} />
      </section>
    </div>
  );
}

export const dynamic = 'force-dynamic';
