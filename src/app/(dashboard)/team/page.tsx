import React from 'react';
import { Metadata } from 'next';
import { Icon } from '@/components/ui/icon';
import { getTeamMembers } from '@/actions/iam';
import { getCurrentUser } from '@/actions/auth';
import { TeamList } from '@/components/team/team-list';
import { TeamControls } from '@/components/team/team-controls';

export const metadata: Metadata = {
  title: 'Team Directory | Bynd BD BOS',
  description:
    'Manage and view all team members across the Bynd BD Business Operating System.',
};

export default async function TeamDirectoryPage() {
  const [currentUser, members] = await Promise.all([
    getCurrentUser(),
    getTeamMembers(),
  ]);

  const canInvite = currentUser !== null && currentUser.layer <= 2;

  const activeCount = members.filter((m) => m.status === 'active').length;
  const layerGroups = members.reduce<Record<number, number>>((acc, m) => {
    acc[m.layer] = (acc[m.layer] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="space-y-xl">
      {/* ── Page Header ────────────────────────────────────────────────────── */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-md mb-xxl">
        <div>
          {/* Breadcrumbs */}
          <nav className="flex items-center text-xs font-poppins text-[#9E9E9E] mb-xs">
            <span>People</span>
            <Icon name="chevron_right" size={14} color="#9E9E9E" className="mx-xs" />
            <span className="text-dusk font-medium">Team Directory</span>
          </nav>
          <h2 className="text-3xl font-poppins font-bold text-dusk">Team Directory</h2>
          <p className="text-sm font-ubuntu text-[#555555] mt-xs">
            All active team members across Bynd BD operations.
          </p>
        </div>

        <TeamControls canInvite={canInvite} />
      </section>

      {/* ── Summary Stats Bar ───────────────────────────────────────────────── */}
      <section className="grid grid-cols-2 sm:grid-cols-4 gap-md mb-xl">
        {/* Total Members */}
        <div className="bg-white border border-[#E0E0E0] p-md rounded-lg shadow-sm">
          <p className="text-[11px] font-poppins font-semibold text-[#555555] uppercase tracking-wider">Total Members</p>
          <p className="text-3xl font-poppins font-bold text-dusk mt-xs">{members.length}</p>
        </div>

        {/* Active Members */}
        <div className="bg-white border border-[#E0E0E0] p-md rounded-lg shadow-sm">
          <p className="text-[11px] font-poppins font-semibold text-[#555555] uppercase tracking-wider">Active</p>
          <p className="text-3xl font-poppins font-bold text-[#2E7D32] mt-xs">{activeCount}</p>
        </div>

        {/* Unique Layers */}
        <div className="bg-white border border-[#E0E0E0] p-md rounded-lg shadow-sm">
          <p className="text-[11px] font-poppins font-semibold text-[#555555] uppercase tracking-wider">Unique Layers</p>
          <p className="text-3xl font-poppins font-bold text-sunrise mt-xs">
            {Object.keys(layerGroups).length}
          </p>
        </div>

        {/* Field Staff (Layer 5 Hosts) */}
        <div className="bg-white border border-[#E0E0E0] p-md rounded-lg shadow-sm">
          <p className="text-[11px] font-poppins font-semibold text-[#555555] uppercase tracking-wider">Field Staff</p>
          <p className="text-3xl font-poppins font-bold text-teal-700 mt-xs">
            {layerGroups[5] || 0}
          </p>
        </div>
      </section>

      {/* ── Team Directory Table ─────────────────────────────────────────────── */}
      <section>
        <div className="flex items-center gap-sm mb-md">
          <Icon name="groups" size={20} color="#FF5F0F" />
          <h3 className="text-lg font-poppins font-semibold text-dusk">All Members</h3>
        </div>

        <TeamList members={members} />
      </section>
    </div>
  );
}

export const dynamic = 'force-dynamic';
