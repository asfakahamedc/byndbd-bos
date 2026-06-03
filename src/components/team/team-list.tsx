import React from 'react';
import { TeamMember } from '@/actions/iam';
import { Icon } from '@/components/ui/icon';

interface TeamListProps {
  members: TeamMember[];
}

// ── Layer metadata ─────────────────────────────────────────────────────────────

const LAYER_CONFIG: Record<number, { label: string; color: string; bg: string }> = {
  0: { label: 'Owner',               color: 'text-amber-700',   bg: 'bg-amber-100'   },
  1: { label: 'CEO',                 color: 'text-purple-700',  bg: 'bg-purple-100'  },
  2: { label: 'Operations Lead',     color: 'text-blue-700',    bg: 'bg-blue-100'    },
  3: { label: 'Department Lead',     color: 'text-indigo-700',  bg: 'bg-indigo-100'  },
  4: { label: 'Executive Specialist',color: 'text-teal-700',    bg: 'bg-teal-100'    },
  5: { label: 'Host Coordinator',    color: 'text-green-700',   bg: 'bg-green-100'   },
  6: { label: 'Contractor',          color: 'text-slate-600',   bg: 'bg-slate-100'   },
};

const STATUS_CONFIG: Record<string, { label: string; color: string; dot: string }> = {
  active:      { label: 'Active',      color: 'text-green-700',  dot: 'bg-green-500'  },
  inactive:    { label: 'Inactive',    color: 'text-yellow-700', dot: 'bg-yellow-500' },
  offboarded:  { label: 'Offboarded', color: 'text-red-700',    dot: 'bg-red-500'    },
};

// ── Helper: Generate avatar initials ──────────────────────────────────────────

function getInitials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0].toUpperCase())
    .join('');
}

// ── Helper: Avatar background color by layer ─────────────────────────────────

const AVATAR_COLORS: Record<number, string> = {
  0: 'bg-amber-500',
  1: 'bg-purple-600',
  2: 'bg-blue-600',
  3: 'bg-indigo-500',
  4: 'bg-teal-600',
  5: 'bg-green-600',
  6: 'bg-slate-500',
};

// ── Helper: Format join date ──────────────────────────────────────────────────

function formatJoinDate(dateStr: string): string {
  try {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return '—';
  }
}

// ── TeamRow ───────────────────────────────────────────────────────────────────

function TeamMemberRow({ member }: { member: TeamMember }) {
  const layerConfig = LAYER_CONFIG[member.layer] ?? {
    label: `Layer ${member.layer}`,
    color: 'text-slate-600',
    bg: 'bg-slate-100',
  };
  const statusConfig = STATUS_CONFIG[member.status] ?? STATUS_CONFIG.active;
  const avatarColor = AVATAR_COLORS[member.layer] ?? 'bg-slate-500';
  const initials = getInitials(member.full_name);

  return (
    <tr className="border-b border-[#E0E0E0] hover:bg-surface-container-low transition-colors group">
      {/* Identity Cell */}
      <td className="px-lg py-md">
        <div className="flex items-center gap-md">
          {/* Avatar */}
          <div
            className={`w-10 h-10 rounded-[6px] ${avatarColor} flex items-center justify-center text-white font-bold text-sm shrink-0 border border-white/20`}
            aria-hidden="true"
          >
            {initials || <Icon name="person" className="w-5 h-5" />}
          </div>
          {/* Name & Email */}
          <div className="min-w-0">
            <p className="text-body font-bold text-on-background truncate">{member.full_name}</p>
            <p className="text-label text-on-surface-variant truncate">{member.email}</p>
          </div>
        </div>
      </td>

      {/* Layer Cell */}
      <td className="px-lg py-md">
        <div className="flex items-center gap-xs">
          <Icon name="security" className="w-3.5 h-3.5 text-outline shrink-0" />
          <span
            className={`inline-flex items-center px-sm py-0.5 text-label font-bold rounded-[6px] ${layerConfig.bg} ${layerConfig.color} uppercase tracking-wide`}
          >
            {member.layer} — {layerConfig.label}
          </span>
        </div>
      </td>

      {/* Department Cell */}
      <td className="px-lg py-md">
        <div className="flex items-center gap-xs text-body text-on-surface-variant">
          {member.department ? (
            <>
              <Icon name="business" className="w-3.5 h-3.5 shrink-0 text-outline" />
              <span>{member.department}</span>
            </>
          ) : (
            <span className="italic text-outline">—</span>
          )}
        </div>
      </td>

      {/* Status Cell */}
      <td className="px-lg py-md">
        <span className={`inline-flex items-center gap-xs text-label font-bold ${statusConfig.color}`}>
          <span className={`w-2 h-2 rounded-full ${statusConfig.dot}`} />
          {statusConfig.label}
        </span>
      </td>

      {/* Joined Date Cell */}
      <td className="px-lg py-md">
        <div className="flex items-center gap-xs text-label text-on-surface-variant">
          <Icon name="schedule" className="w-3.5 h-3.5 shrink-0" />
          <span>{formatJoinDate(member.created_at)}</span>
        </div>
      </td>
    </tr>
  );
}

// ── TeamList (main export) ────────────────────────────────────────────────────

export function TeamList({ members }: TeamListProps) {
  if (members.length === 0) {
    return (
      <div className="p-8 border border-slate-200 bg-slate-50 text-center text-slate-500 font-semibold uppercase text-sm">
        No team members found. Use the Invite button to add your first member.
      </div>
    );
  }

  return (
    <div className="border border-[#E0E0E0] rounded-[6px] overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left min-w-[700px]" aria-label="Team Directory">
          {/* Column Headers */}
          <thead className="bg-surface-container-low border-b-2 border-[#E0E0E0]">
            <tr>
              <th className="px-lg py-sm text-label font-bold text-on-surface-variant uppercase tracking-wider">
                Member
              </th>
              <th className="px-lg py-sm text-label font-bold text-on-surface-variant uppercase tracking-wider">
                Layer / Role
              </th>
              <th className="px-lg py-sm text-label font-bold text-on-surface-variant uppercase tracking-wider">
                Department
              </th>
              <th className="px-lg py-sm text-label font-bold text-on-surface-variant uppercase tracking-wider">
                Status
              </th>
              <th className="px-lg py-sm text-label font-bold text-on-surface-variant uppercase tracking-wider">
                Joined
              </th>
            </tr>
          </thead>

          {/* Rows */}
          <tbody className="bg-white divide-y divide-outline-variant">
            {members.map((member) => (
              <TeamMemberRow key={member.id} member={member} />
            ))}
          </tbody>

          {/* Footer summary */}
          <tfoot className="bg-surface-container-low border-t border-[#E0E0E0]">
            <tr>
              <td colSpan={5} className="px-lg py-sm text-label text-on-surface-variant">
                Showing <span className="font-bold text-on-surface">{members.length}</span> team member{members.length !== 1 ? 's' : ''}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
