'use client';

import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { CreateTripModal } from './create-trip-modal';

export function TripsControls() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="flex items-center gap-md">
      {/* Create Trip Button */}
      <button
        id="create-trip-btn"
        onClick={() => setIsModalOpen(true)}
        className="flex items-center gap-xs bg-primary hover:bg-primary/90 text-white px-xl py-sm rounded-none border border-primary/20 hover:shadow-md transition-all text-h4 font-bold tracking-wide active:scale-95 h-[40px]"
      >
        <Plus className="w-5 h-5" />
        <span>Create Trip</span>
      </button>

      {/* Conditionally rendered Create Trip Modal */}
      {isModalOpen && (
        <CreateTripModal onClose={() => setIsModalOpen(false)} />
      )}
    </div>
  );
}
