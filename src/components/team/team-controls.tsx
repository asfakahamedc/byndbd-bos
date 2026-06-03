'use client';

import React, { useState } from 'react';
import { Icon } from '@/components/ui/icon';
import { InviteMemberModal } from './invite-member-modal';

interface TeamControlsProps {
  /** Whether the current user has permission to invite members (layer <= 2). */
  canInvite: boolean;
}

export function TeamControls({ canInvite }: TeamControlsProps) {
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  if (!canInvite) return null;

  return (
    <div className="flex items-center gap-md">
      {/* Invite Member CTA */}
      <button
        id="invite-member-btn"
        onClick={() => setIsInviteModalOpen(true)}
        className="flex items-center gap-xs bg-sunrise hover:bg-sunrise/90 text-white px-xl py-sm rounded-[6px] border border-sunrise/20 hover:shadow-md transition-all text-h4 font-bold tracking-wide active:scale-95 h-[40px]"
      >
        <Icon name="person_add" className="w-5 h-5" />
        <span>Invite Member</span>
      </button>

      {/* Conditionally rendered Invite Modal */}
      {isInviteModalOpen && (
        <InviteMemberModal onClose={() => setIsInviteModalOpen(false)} />
      )}
    </div>
  );
}
