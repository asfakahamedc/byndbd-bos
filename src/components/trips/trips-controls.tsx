'use client';

import React, { useState } from 'react';
import { Icon } from '@/components/ui/icon';
import { CreateTripModal } from './create-trip-modal';

export function TripsControls() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="flex items-center gap-md">
      {/* Create Trip Button */}
      <button
        id="create-trip-btn"
        onClick={() => setIsModalOpen(true)}
        className="flex items-center gap-xs bg-sunrise hover:bg-sunrise/90 text-white px-xl py-sm rounded-[6px] border border-sunrise/20 hover:shadow-md transition-all text-h4 font-bold tracking-wide active:scale-95 h-[40px]"
      >
        <Icon name="add" className="w-5 h-5" />
        <span>Create Trip</span>
      </button>

      {/* Conditionally rendered Create Trip Modal */}
      {isModalOpen && (
        <CreateTripModal onClose={() => setIsModalOpen(false)} />
      )}
    </div>
  );
}
