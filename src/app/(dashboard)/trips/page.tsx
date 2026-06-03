import React from 'react';
import { Metadata } from 'next';
import { Icon } from '@/components/ui/icon';
import { getTrips } from '@/actions/trips';
import { TripsTable } from '@/components/trips/trips-table';
import { TripsControls } from '@/components/trips/trips-controls';

export const metadata: Metadata = {
  title: 'Trips Management | Bynd BD BOS',
  description:
    'Manage and monitor all travel operations, group trips, and logistics across the Bynd BD Business Operating System.',
};

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
          <nav className="flex items-center text-xs font-poppins text-[#9E9E9E] mb-xs">
            <span>Operations</span>
            <Icon name="chevron_right" size={14} color="#9E9E9E" className="mx-xs" />
            <span className="text-dusk font-medium">Trips Management</span>
          </nav>
          <h2 className="text-3xl font-poppins font-bold text-dusk">Trips Management</h2>
          <p className="text-sm font-ubuntu text-[#555555] mt-xs">
            Manage and monitor global travel operations and logistics.
          </p>
        </div>

        {/* Create Trip CTA */}
        <TripsControls />
      </section>

      {/* ── Summary Stats Bento Grid ─────────────────────────────────────────── */}
      <section className="grid grid-cols-2 sm:grid-cols-4 gap-md mb-xl">

        {/* Active Trips */}
        <div className="bg-white border border-[#E0E0E0] p-md rounded-lg shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-md">
            <p className="text-[11px] font-poppins font-semibold text-[#555555] uppercase tracking-wider">Active Trips</p>
            <Icon name="flight_takeoff" size={20} color="#FF5F0F" />
          </div>
          <p className="text-3xl font-poppins font-bold text-sunrise">{activeCount}</p>
          <p className="text-xs font-ubuntu text-[#555555] mt-xs flex items-center gap-xs">
            <Icon name="trending_up" size={14} color="#FF5F0F" />
            Currently running
          </p>
        </div>

        {/* Planning / Ready */}
        <div className="bg-white border border-[#E0E0E0] p-md rounded-lg shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-md">
            <p className="text-[11px] font-poppins font-semibold text-[#555555] uppercase tracking-wider">In Pipeline</p>
            <Icon name="calendar_today" size={20} color="#E8A830" />
          </div>
          <p className="text-3xl font-poppins font-bold text-amber-600">{planningCount}</p>
          <p className="text-xs font-ubuntu text-[#555555] mt-xs">Planning &amp; Ready</p>
        </div>

        {/* Total Travelers */}
        <div className="bg-white border border-[#E0E0E0] p-md rounded-lg shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-md">
            <p className="text-[11px] font-poppins font-semibold text-[#555555] uppercase tracking-wider">Total Travelers</p>
            <Icon name="groups" size={20} color="#1565C0" />
          </div>
          <p className="text-3xl font-poppins font-bold text-teal-700">{totalTravelers.toLocaleString()}</p>
          <p className="text-xs font-ubuntu text-[#555555] mt-xs">Across all trips</p>
        </div>

        {/* Completed */}
        <div className="bg-white border border-[#E0E0E0] p-md rounded-lg shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-md">
            <p className="text-[11px] font-poppins font-semibold text-[#555555] uppercase tracking-wider">Completed</p>
            <Icon name="check_circle" size={20} color="#2E7D32" />
          </div>
          <p className="text-3xl font-poppins font-bold text-[#2E7D32]">{completedCount}</p>
          <p className="text-xs font-ubuntu text-[#555555] mt-xs">Successfully closed</p>
        </div>
      </section>

      {/* ── Trips Data Table ─────────────────────────────────────────────────── */}
      <section>
        <div className="flex items-center gap-sm mb-md">
          <Icon name="luggage" size={20} color="#FF5F0F" />
          <h3 className="text-lg font-poppins font-semibold text-dusk">All Trips</h3>
        </div>

        <TripsTable trips={trips} />
      </section>
    </div>
  );
}

export const dynamic = 'force-dynamic';
