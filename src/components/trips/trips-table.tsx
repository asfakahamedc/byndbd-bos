import React from 'react';
import { Trip } from '@/actions/trips';
import { Icon } from '../ui/icon';

interface TripsTableProps {
  trips: Trip[];
}

// ── Status badge config ────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<
  string,
  { label: string; className: string }
> = {
  draft: {
    label: 'Draft',
    className: 'bg-[#F5F5F5] text-[#555555]',
  },
  planning: {
    label: 'Planning',
    className: 'bg-[#FFF8E1] text-[#F59E0B]',
  },
  ready: {
    label: 'Ready',
    className: 'bg-[#E3F2FD] text-[#1565C0]',
  },
  active: {
    label: 'Active',
    className: 'bg-[#E8F5E9] text-[#2E7D32]',
  },
  completed: {
    label: 'Completed',
    className: 'bg-[#F5F5F5] text-[#555555]',
  },
  cancelled: {
    label: 'Cancelled',
    className: 'bg-[#FFF3F0] text-[#C24B0A]',
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
    <tr className="hover:bg-[#FFF3E0]/30 transition-colors group h-[52px] border-b border-[#E0E0E0] cursor-pointer">
      {/* Trip Ref */}
      <td className="px-lg py-md">
        <span className="text-sm font-poppins font-semibold text-sunrise hover:underline">
          {trip.booking_ref}
        </span>
      </td>

      {/* Destination */}
      <td className="px-lg py-md">
        <div className="flex items-center gap-sm">
          <div className="w-8 h-8 bg-[#F5F5F5] flex items-center justify-center shrink-0 rounded-[4px] border border-[#E0E0E0]">
            <Icon name="location_on" size={16} color="#555555" />
          </div>
          <span className="text-sm font-ubuntu text-dusk font-normal">{trip.destination_name}</span>
        </div>
      </td>

      {/* Trip Name / Group Name */}
      <td className="px-lg py-md">
        <span className="text-sm font-ubuntu text-dusk font-normal">{trip.trip_name}</span>
      </td>

      {/* Dates */}
      <td className="px-lg py-md">
        <div className="flex items-center gap-xs text-xs font-ubuntu text-[#555555]">
          <Icon name="calendar_today" size={14} color="#555555" className="shrink-0" />
          <span>{startFmt} — {endFmt}</span>
        </div>
      </td>

      {/* Group Size */}
      <td className="px-lg py-md">
        <div className="flex items-center gap-xs text-xs font-ubuntu text-[#555555]">
          <Icon name="groups" size={14} color="#555555" className="shrink-0" />
          <span>{trip.group_size.toLocaleString()}</span>
        </div>
      </td>

      {/* Status Badge */}
      <td className="px-lg py-md">
        <span
          className={`inline-flex items-center px-[10px] py-[3px] text-[11px] font-poppins font-semibold rounded-full tracking-[0.02em] uppercase leading-none ${statusCfg.className}`}
        >
          {statusCfg.label}
        </span>
      </td>

      {/* Row Actions (revealed on hover) */}
      <td className="px-lg py-md text-right">
        <button
          className="opacity-0 group-hover:opacity-100 transition-opacity text-[#555555] hover:text-sunrise p-1"
          aria-label={`More options for trip ${trip.booking_ref}`}
        >
          <Icon name="more_vert" size={20} color="#555555" />
        </button>
      </td>
    </tr>
  );
}

// ── TripsTable (main export) ───────────────────────────────────────────────────

export function TripsTable({ trips }: TripsTableProps) {
  if (trips.length === 0) {
    return (
      <div className="p-8 border border-[#E0E0E0] bg-white rounded-lg shadow-sm text-center text-[#555555] font-poppins font-semibold uppercase text-xs">
        No trips found. Create your first trip to get started.
      </div>
    );
  }

  return (
    <div className="border border-[#E0E0E0] rounded-lg overflow-hidden shadow-sm bg-white">
      <div className="overflow-x-auto">
        <table className="w-full text-left min-w-[800px]" aria-label="Trips Management Table">

          {/* Column Headers */}
          <thead className="bg-[#F5F5F5] border-b border-[#E0E0E0]">
            <tr>
              <th className="px-lg py-md text-[13px] font-poppins font-semibold text-dusk uppercase tracking-wider">
                Trip Ref
              </th>
              <th className="px-lg py-md text-[13px] font-poppins font-semibold text-dusk uppercase tracking-wider">
                Destination
              </th>
              <th className="px-lg py-md text-[13px] font-poppins font-semibold text-dusk uppercase tracking-wider">
                Group Name
              </th>
              <th className="px-lg py-md text-[13px] font-poppins font-semibold text-dusk uppercase tracking-wider">
                Travel Dates
              </th>
              <th className="px-lg py-md text-[13px] font-poppins font-semibold text-dusk uppercase tracking-wider">
                Group Size
              </th>
              <th className="px-lg py-md text-[13px] font-poppins font-semibold text-dusk uppercase tracking-wider">
                Status
              </th>
              <th className="px-lg py-md text-[13px] font-poppins font-semibold text-dusk uppercase tracking-wider text-right">
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
          <tfoot className="bg-[#F5F5F5] border-t border-[#E0E0E0]">
            <tr>
              <td colSpan={7} className="px-lg py-sm text-xs font-ubuntu text-[#555555]">
                Showing{' '}
                <span className="font-semibold text-dusk">{trips.length}</span>{' '}
                trip{trips.length !== 1 ? 's' : ''}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
