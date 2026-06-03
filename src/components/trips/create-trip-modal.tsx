'use client';

import React, { useState, useTransition } from 'react';
import { createTrip } from '@/actions/trips';
import { Icon } from '@/components/ui/icon';

interface CreateTripModalProps {
  onClose: () => void;
}

export function CreateTripModal({ onClose }: CreateTripModalProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const formData = new FormData(e.currentTarget);

    // Client-side guard: ensure required fields are present before firing the action
    const booking_ref      = (formData.get('booking_ref') as string)?.trim();
    const trip_name        = (formData.get('trip_name') as string)?.trim();
    const destination_name = (formData.get('destination_name') as string)?.trim();
    const travel_start     = formData.get('travel_start') as string;
    const travel_end       = formData.get('travel_end') as string;
    const group_size       = formData.get('group_size') as string;

    if (!booking_ref)      { setError('Booking reference is required.');     return; }
    if (!trip_name)        { setError('Group / trip name is required.');     return; }
    if (!destination_name) { setError('Destination is required.');           return; }
    if (!travel_start)     { setError('Start date is required.');            return; }
    if (!travel_end)       { setError('End date is required.');              return; }
    if (!group_size)       { setError('Group size is required.');            return; }
    if (travel_end < travel_start) {
      setError('End date must be on or after the start date.');
      return;
    }

    startTransition(async () => {
      try {
        const result = await createTrip(formData);
        if (result.success) {
          onClose();
        } else {
          setError(result.error || 'Failed to create trip. Please try again.');
        }
      } catch (err: unknown) {
        console.error('Trip creation failed unexpectedly:', err);
        setError(err instanceof Error ? err.message : 'An unexpected error occurred.');
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-md font-sans text-on-surface">
      <div className="bg-white border-2 border-outline w-full max-w-lg rounded-[6px] shadow-2xl relative flex flex-col">

        {/* ── Modal Header ─────────────────────────────────────────────────── */}
        <div className="px-xl py-md border-b border-[#E0E0E0] flex items-center justify-between bg-surface-container-low">
          <div className="flex items-center gap-sm">
            <Icon name="flight_takeoff" className="w-5 h-5 text-sunrise" />
            <h3 className="text-h3 font-bold text-on-background">Create New Trip</h3>
          </div>
          <button
            onClick={onClose}
            disabled={isPending}
            aria-label="Close modal"
            className="text-outline hover:text-on-surface transition-colors focus:outline-none disabled:opacity-50"
          >
            <Icon name="close" className="w-5 h-5" />
          </button>
        </div>

        {/* ── Modal Form ───────────────────────────────────────────────────── */}
        <form onSubmit={handleSubmit} className="p-xl space-y-lg flex-1 overflow-y-auto max-h-[80vh]">

          {/* Error Banner */}
          {error && (
            <div className="flex items-start gap-sm p-md bg-ember/10 border border-error text-error text-body rounded-[6px]">
              <Icon name="warning" className="w-4 h-4 mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Booking Reference */}
          <div className="space-y-xs">
            <label className="text-label text-on-surface-variant block" htmlFor="booking_ref">
              Booking Reference <span className="text-error">*</span>
            </label>
            <input
              id="booking_ref"
              name="booking_ref"
              type="text"
              placeholder="e.g. TR-1099"
              required
              disabled={isPending}
              className="w-full h-[40px] px-md border border-[#E0E0E0] bg-surface focus:ring-2 focus:ring-primary/20 focus:border-sunrise transition-all text-body outline-none rounded-[6px] disabled:opacity-60 font-mono"
            />
          </div>

          {/* Trip / Group Name */}
          <div className="space-y-xs">
            <label className="text-label text-on-surface-variant block" htmlFor="trip_name">
              Group / Trip Name <span className="text-error">*</span>
            </label>
            <input
              id="trip_name"
              name="trip_name"
              type="text"
              placeholder="e.g. Sajek Valley Corporate Retreat"
              required
              disabled={isPending}
              className="w-full h-[40px] px-md border border-[#E0E0E0] bg-surface focus:ring-2 focus:ring-primary/20 focus:border-sunrise transition-all text-body outline-none rounded-[6px] disabled:opacity-60"
            />
          </div>

          {/* Destination */}
          <div className="space-y-xs">
            <label className="text-label text-on-surface-variant block" htmlFor="destination_name">
              Destination <span className="text-error">*</span>
            </label>
            <input
              id="destination_name"
              name="destination_name"
              type="text"
              placeholder="e.g. Sajek, Rangamati, Bangladesh"
              required
              disabled={isPending}
              className="w-full h-[40px] px-md border border-[#E0E0E0] bg-surface focus:ring-2 focus:ring-primary/20 focus:border-sunrise transition-all text-body outline-none rounded-[6px] disabled:opacity-60"
            />
          </div>

          {/* Travel Dates: Start & End side-by-side */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-md">
            <div className="space-y-xs">
              <label className="text-label text-on-surface-variant block" htmlFor="travel_start">
                Departure Date <span className="text-error">*</span>
              </label>
              <input
                id="travel_start"
                name="travel_start"
                type="date"
                required
                disabled={isPending}
                className="w-full h-[40px] px-md border border-[#E0E0E0] bg-surface focus:ring-2 focus:ring-primary/20 focus:border-sunrise transition-all text-body outline-none rounded-[6px] disabled:opacity-60"
              />
            </div>

            <div className="space-y-xs">
              <label className="text-label text-on-surface-variant block" htmlFor="travel_end">
                Return Date <span className="text-error">*</span>
              </label>
              <input
                id="travel_end"
                name="travel_end"
                type="date"
                required
                disabled={isPending}
                className="w-full h-[40px] px-md border border-[#E0E0E0] bg-surface focus:ring-2 focus:ring-primary/20 focus:border-sunrise transition-all text-body outline-none rounded-[6px] disabled:opacity-60"
              />
            </div>
          </div>

          {/* Group Size */}
          <div className="space-y-xs">
            <label className="text-label text-on-surface-variant block" htmlFor="group_size">
              Group Size (Travelers) <span className="text-error">*</span>
            </label>
            <input
              id="group_size"
              name="group_size"
              type="number"
              min={1}
              max={10000}
              placeholder="e.g. 24"
              required
              disabled={isPending}
              className="w-full h-[40px] px-md border border-[#E0E0E0] bg-surface focus:ring-2 focus:ring-primary/20 focus:border-sunrise transition-all text-body outline-none rounded-[6px] disabled:opacity-60"
            />
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-md pt-md border-t border-[#E0E0E0]">
            <button
              type="button"
              onClick={onClose}
              disabled={isPending}
              className="px-lg h-[40px] border border-outline bg-white hover:bg-surface-container-low text-on-surface font-bold text-body active:scale-[0.98] transition-all rounded-[6px] disabled:opacity-60"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="px-lg h-[40px] bg-sunrise hover:bg-sunrise/90 text-white font-bold text-body active:scale-[0.98] transition-all rounded-[6px] shadow-md flex items-center justify-center gap-sm disabled:opacity-70 disabled:pointer-events-none"
            >
              {isPending ? (
                <>
                  <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full inline-block" />
                  <span>Creating Trip...</span>
                </>
              ) : (
                <>
                  <Icon name="flight_takeoff" className="w-4 h-4" />
                  <span>Create Trip</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
