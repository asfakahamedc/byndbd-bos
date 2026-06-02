import React from 'react';
import { Trip } from '@/actions/trips';
import { MapPin, Calendar, Users, MoreHorizontal } from 'lucide-react';

interface TripsTableProps {
  trips: Trip[];
}

// ── Status badge config ────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<
  string,
  { label: string; textColor: string; bgColor: string; dotColor: string }
> = {
  draft: {
    label: 'Draft',
    textColor: 'text-slate-600',
    bgColor: 'bg-slate-100',
    dotColor: 'bg-slate-400',
  },
  planning: {
    label: 'Planning',
    textColor: 'text-amber-700',
    bgColor: 'bg-amber-100',
    dotColor: 'bg-amber-500',
  },
  ready: {
    label: 'Ready',
    textColor: 'text-blue-700',
    bgColor: 'bg-blue-100',
    dotColor: 'bg-blue-500',
  },
  active: {
    label: 'Active',
    textColor: 'text-[#2563EB]',
    bgColor: 'bg-[#2563EB]/10',
    dotColor: 'bg-[#2563EB]',
  },
  completed: {
    label: 'Completed',
    textColor: 'text-[#10B981]',
    bgColor: 'bg-[#10B981]/10',
    dotColor: 'bg-[#10B981]',
  },
  cancelled: {
    label: 'Cancelled',
    textColor: 'text-red-600',
    bgColor: 'bg-red-100',
    dotColor: 'bg-red-500',
  },
};

// ── Date formatter ─────────────────────────────────────────────────────────────

function formatTripDate(dateStr: string): string {
  try {
    return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

// ── TripRow ────────────────────────────────────────────────────────────────────

function TripRow({ trip }: { trip: Trip }) {
  const statusCfg = STATUS_CONFIG[trip.status] ?? STATUS_CONFIG.draft;
  const startFmt  = formatTripDate(trip.travel_start);
  const endFmt    = formatTripDate(trip.travel_end);

  return (
    <tr className="hover:bg-surface-container-low transition-colors group h-[52px] border-b border-outline-variant/30 cursor-pointer">
      {/* Trip Ref */}
      <td className="px-lg py-md">
        <span className="text-h4 text-primary font-bold hover:underline">
          {trip.booking_ref}
        </span>
      </td>

      {/* Destination */}
      <td className="px-lg py-md">
        <div className="flex items-center gap-sm">
          <div className="w-8 h-8 bg-surface-container flex items-center justify-center shrink-0">
            <MapPin className="w-4 h-4 text-outline" />
          </div>
          <span className="text-body text-on-surface">{trip.destination_name}</span>
        </div>
      </td>

      {/* Trip Name / Group Name */}
      <td className="px-lg py-md">
        <span className="text-body text-on-surface">{trip.trip_name}</span>
      </td>

      {/* Dates */}
      <td className="px-lg py-md">
        <div className="flex items-center gap-xs text-body text-on-surface-variant">
          <Calendar className="w-3.5 h-3.5 text-outline shrink-0" />
          <span>{startFmt} — {endFmt}</span>
        </div>
      </td>

      {/* Group Size */}
      <td className="px-lg py-md">
        <div className="flex items-center gap-xs text-body text-on-surface-variant">
          <Users className="w-3.5 h-3.5 text-outline shrink-0" />
          <span>{trip.group_size.toLocaleString()}</span>
        </div>
      </td>

      {/* Status Badge */}
      <td className="px-lg py-md">
        <span
          className={`inline-flex items-center gap-xs px-sm py-1 text-label font-bold rounded-none ${statusCfg.bgColor} ${statusCfg.textColor} uppercase tracking-wide`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${statusCfg.dotColor}`} />
          {statusCfg.label}
        </span>
      </td>

      {/* Row Actions (revealed on hover) */}
      <td className="px-lg py-md text-right">
        <button
          className="opacity-0 group-hover:opacity-100 transition-opacity text-outline hover:text-primary p-1"
          aria-label={`More options for trip ${trip.booking_ref}`}
        >
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </td>
    </tr>
  );
}

// ── TripsTable (main export) ───────────────────────────────────────────────────

export function TripsTable({ trips }: TripsTableProps) {
  if (trips.length === 0) {
    return (
      <div className="p-8 border border-slate-200 bg-slate-50 text-center text-slate-500 font-semibold uppercase text-sm">
        No trips found. Create your first trip to get started.
      </div>
    );
  }

  return (
    <div className="border border-outline-variant rounded-none overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left min-w-[800px]" aria-label="Trips Management Table">

          {/* Column Headers */}
          <thead className="bg-surface-container-low border-b-2 border-outline-variant">
            <tr>
              <th className="px-lg py-md text-label font-bold text-on-surface-variant uppercase tracking-wider">
                Trip Ref
              </th>
              <th className="px-lg py-md text-label font-bold text-on-surface-variant uppercase tracking-wider">
                Destination
              </th>
              <th className="px-lg py-md text-label font-bold text-on-surface-variant uppercase tracking-wider">
                Group Name
              </th>
              <th className="px-lg py-md text-label font-bold text-on-surface-variant uppercase tracking-wider">
                Travel Dates
              </th>
              <th className="px-lg py-md text-label font-bold text-on-surface-variant uppercase tracking-wider">
                Group Size
              </th>
              <th className="px-lg py-md text-label font-bold text-on-surface-variant uppercase tracking-wider">
                Status
              </th>
              <th className="px-lg py-md text-label font-bold text-on-surface-variant uppercase tracking-wider text-right">
                Actions
              </th>
            </tr>
          </thead>

          {/* Trip Rows */}
          <tbody className="bg-white">
            {trips.map((trip) => (
              <TripRow key={trip.id} trip={trip} />
            ))}
          </tbody>

          {/* Footer Summary */}
          <tfoot className="bg-surface-container-low border-t border-outline-variant">
            <tr>
              <td colSpan={7} className="px-lg py-sm text-label text-on-surface-variant">
                Showing{' '}
                <span className="font-bold text-on-surface">{trips.length}</span>{' '}
                trip{trips.length !== 1 ? 's' : ''}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
