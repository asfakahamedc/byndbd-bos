export const dynamic = "force-dynamic";
import React from 'react';
import { Metadata } from 'next';
import { ChevronRight, Users } from 'lucide-react';
import { getTeamMembers } from '@/actions/iam';
import { getCurrentUser } from '@/actions/auth';
import { TeamList } from '@/components/team/team-list';
import { TeamControls } from '@/components/team/team-controls';

export const metadata: Metadata = {
  title: 'Team Directory | Bynd BD BOS',
  description:
    'Manage and view all team members across the Bynd BD Business Operating System.',
};

/**
 * Team Directory Page.
 *
 * Server Component — fetches current user (for permissions) and the full team
 * roster concurrently, then renders the TeamList table and optionally the
 * InviteMember control based on the caller's access layer.
 */
export default async function TeamDirectoryPage() {
  // Concurrent data fetches for performance
  const [currentUser, members] = await Promise.all([
    getCurrentUser(),
    getTeamMembers(),
  ]);

  // Only Layer 0–2 (Owner, CEO, Operations Lead) may invite members
  const canInvite = currentUser !== null && currentUser.layer <= 2;

  // Breakdown stats for the summary bar
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
          <nav className="flex items-center text-label text-outline mb-xs">
            <span>People</span>
            <ChevronRight className="w-3.5 h-3.5 mx-xs" />
            <span className="text-on-surface-variant font-medium">Team Directory</span>
          </nav>
          <h2 className="text-h1 text-on-background">Team Directory</h2>
          <p className="text-body text-on-surface-variant mt-xs">
            All active team members across Bynd BD operations.
          </p>
        </div>

        {/* Invite Member button — rendered only when the current user has permission */}
        <TeamControls canInvite={canInvite} />
      </section>

      {/* ── Summary Stats Bar ───────────────────────────────────────────────── */}
      <section className="grid grid-cols-2 sm:grid-cols-4 gap-md mb-xl">
        {/* Total Members */}
        <div className="bg-white border border-outline-variant p-md rounded-none">
          <p className="text-label text-on-surface-variant uppercase tracking-wider">Total Members</p>
          <p className="text-h1 font-bold text-on-background mt-xs">{members.length}</p>
        </div>

        {/* Active Members */}
        <div className="bg-white border border-outline-variant p-md rounded-none">
          <p className="text-label text-on-surface-variant uppercase tracking-wider">Active</p>
          <p className="text-h1 font-bold text-green-700 mt-xs">{activeCount}</p>
        </div>

        {/* Unique Layers */}
        <div className="bg-white border border-outline-variant p-md rounded-none">
          <p className="text-label text-on-surface-variant uppercase tracking-wider">Unique Layers</p>
          <p className="text-h1 font-bold text-primary mt-xs">
            {Object.keys(layerGroups).length}
          </p>
        </div>

        {/* Field Staff (Layer 5 Hosts) */}
        <div className="bg-white border border-outline-variant p-md rounded-none">
          <p className="text-label text-on-surface-variant uppercase tracking-wider">Field Staff</p>
          <p className="text-h1 font-bold text-teal-700 mt-xs">
            {layerGroups[5] || 0}
          </p>
        </div>
      </section>

      {/* ── Team Directory Table ─────────────────────────────────────────────── */}
      <section>
        <div className="flex items-center gap-sm mb-md">
          <Users className="w-5 h-5 text-primary" />
          <h3 className="text-h3 font-bold text-on-background">All Members</h3>
        </div>

        <TeamList members={members} />
      </section>
    </div>
  );
}
