'use client';

import React, { useState, useTransition } from 'react';
import { inviteTeamMember } from '@/actions/iam';
import { X, UserPlus, AlertCircle } from 'lucide-react';

interface InviteMemberModalProps {
  onClose: () => void;
}

const LAYER_OPTIONS = [
  { value: '1', label: 'Layer 1 — CEO / Founder' },
  { value: '2', label: 'Layer 2 — Operations Lead' },
  { value: '3', label: 'Layer 3 — Department Lead' },
  { value: '4', label: 'Layer 4 — Executive Specialist' },
  { value: '5', label: 'Layer 5 — Host / Field Coordinator' },
  { value: '6', label: 'Layer 6 — Contractor / Vendor' },
];

const DEPARTMENT_OPTIONS = [
  'Operations',
  'Finance',
  'Technology',
  'Marketing',
  'Human Resources',
  'Sales',
  'Logistics',
  'Customer Experience',
];

export function InviteMemberModal({ onClose }: InviteMemberModalProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const formData = new FormData(e.currentTarget);
    const full_name = (formData.get('full_name') as string)?.trim();
    const email = (formData.get('email') as string)?.trim();
    const layer = formData.get('layer') as string;

    if (!full_name || !email || !layer) {
      setError('Full name, email address, and layer are required fields.');
      return;
    }

    // Basic email format validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    startTransition(async () => {
      try {
        const result = await inviteTeamMember(formData);
        if (result.success) {
          setSuccess(true);
          // Auto-close after 1.5s so user sees the success state
          setTimeout(onClose, 1500);
        } else {
          setError(result.error || 'Failed to send invitation. Please try again.');
        }
      } catch (err: unknown) {
        console.error('Invite failed unexpectedly:', err);
        setError(err instanceof Error ? err.message : 'An unexpected error occurred.');
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-md font-sans text-on-surface">
      <div className="bg-white border-2 border-outline w-full max-w-lg rounded-none shadow-2xl relative flex flex-col">
        
        {/* Modal Header */}
        <div className="px-xl py-md border-b border-outline-variant flex items-center justify-between bg-surface-container-low">
          <div className="flex items-center gap-sm">
            <UserPlus className="w-5 h-5 text-primary" />
            <h3 className="text-h3 font-bold text-on-background">Invite Team Member</h3>
          </div>
          <button
            onClick={onClose}
            className="text-outline hover:text-on-surface transition-colors focus:outline-none disabled:opacity-50"
            disabled={isPending}
            aria-label="Close invite modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success State */}
        {success ? (
          <div className="p-xl flex flex-col items-center justify-center gap-md text-center min-h-[200px]">
            <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center">
              <svg className="w-7 h-7 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <p className="text-h3 font-bold text-on-background">Invitation Sent</p>
              <p className="text-body text-on-surface-variant mt-1">
                The team member will receive an email to set up their account.
              </p>
            </div>
          </div>
        ) : (
          /* Invite Form */
          <form onSubmit={handleSubmit} className="p-xl space-y-lg flex-1">
            
            {/* Error Banner */}
            {error && (
              <div className="flex items-start gap-sm p-md bg-error/10 border border-error text-error text-body rounded-none">
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Full Name */}
            <div className="space-y-xs">
              <label className="text-label text-on-surface-variant block" htmlFor="invite-full-name">
                Full Name <span className="text-error">*</span>
              </label>
              <input
                id="invite-full-name"
                name="full_name"
                type="text"
                placeholder="e.g. Maruf Hossain"
                required
                disabled={isPending}
                className="w-full h-[40px] px-md border border-outline-variant bg-surface focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-body outline-none rounded-none disabled:opacity-60"
              />
            </div>

            {/* Email Address */}
            <div className="space-y-xs">
              <label className="text-label text-on-surface-variant block" htmlFor="invite-email">
                Work Email Address <span className="text-error">*</span>
              </label>
              <input
                id="invite-email"
                name="email"
                type="email"
                placeholder="member@byndbd.com"
                required
                disabled={isPending}
                className="w-full h-[40px] px-md border border-outline-variant bg-surface focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-body outline-none rounded-none disabled:opacity-60"
              />
            </div>

            {/* Layer & Department Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-md">
              {/* Layer Assignment */}
              <div className="space-y-xs">
                <label className="text-label text-on-surface-variant block" htmlFor="invite-layer">
                  Layer Assignment <span className="text-error">*</span>
                </label>
                <select
                  id="invite-layer"
                  name="layer"
                  required
                  disabled={isPending}
                  defaultValue=""
                  className="w-full h-[40px] px-md border border-outline-variant bg-surface focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-body outline-none rounded-none disabled:opacity-60"
                >
                  <option value="" disabled>Select layer...</option>
                  {LAYER_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Department */}
              <div className="space-y-xs">
                <label className="text-label text-on-surface-variant block" htmlFor="invite-department">
                  Department
                </label>
                <select
                  id="invite-department"
                  name="department"
                  disabled={isPending}
                  className="w-full h-[40px] px-md border border-outline-variant bg-surface focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-body outline-none rounded-none disabled:opacity-60"
                >
                  <option value="">None / Cross-functional</option>
                  {DEPARTMENT_OPTIONS.map((dept) => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Invite Notice */}
            <p className="text-label text-on-surface-variant bg-surface-container-low border border-outline-variant p-md rounded-none">
              An invitation email will be sent to the address above. The invitee must set a password before they can access the BOS.
            </p>

            {/* Footer Actions */}
            <div className="flex items-center justify-end gap-md pt-md border-t border-outline-variant">
              <button
                type="button"
                onClick={onClose}
                disabled={isPending}
                className="px-lg h-[40px] border border-outline bg-white hover:bg-surface-container-low text-on-surface font-bold text-body active:scale-[0.98] transition-all rounded-none disabled:opacity-60"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isPending}
                className="px-lg h-[40px] bg-primary hover:bg-primary/90 text-white font-bold text-body active:scale-[0.98] transition-all rounded-none shadow-md flex items-center justify-center gap-sm disabled:opacity-70 disabled:pointer-events-none"
              >
                {isPending ? (
                  <>
                    <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full inline-block" />
                    <span>Sending Invite...</span>
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4" />
                    <span>Send Invitation</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
