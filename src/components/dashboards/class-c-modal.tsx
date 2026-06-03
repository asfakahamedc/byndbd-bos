'use client';

import React, { useState, useEffect } from 'react';
import { Icon } from '@/components/ui/icon';
import { cn } from '@/lib/utils';

export interface ClassCModalProps {
  actionType: string;
  description: string;
  coFounderAStatus?: 'confirmed' | 'pending';
  coFounderBStatus?: 'confirmed' | 'pending';
  onExecute?: () => void;
}

/**
 * ClassCModal represents the dual-confirmation engine required for Class C actions.
 * Demands dual verification and features a 3-second hold-to-confirm mechanism.
 */
export default function ClassCModal({
  actionType,
  description,
  coFounderAStatus = 'confirmed',
  coFounderBStatus = 'pending',
  onExecute
}: ClassCModalProps) {
  const [bStatus, setBStatus] = useState(coFounderBStatus);
  const [progress, setProgress] = useState(0);
  const [isHolding, setIsHolding] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isHolding && bStatus === 'pending') {
      const startTime = Date.now();
      interval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const computedProgress = Math.min((elapsed / 3000) * 100, 100);
        setProgress(computedProgress);

        if (elapsed >= 3000) {
          setBStatus('confirmed');
          setIsHolding(false);
          setProgress(100);
          if (onExecute) {
            onExecute();
          }
        }
      }, 25); // ~40fps smooth rendering
    } else if (!isHolding && bStatus === 'pending') {
      // Smooth decay animation on release
      if (progress > 0) {
        interval = setInterval(() => {
          setProgress((prev) => Math.max(prev - 8, 0));
        }, 15);
      }
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isHolding, bStatus, progress, onExecute]);

  const handleStart = () => {
    if (bStatus === 'pending') {
      setIsHolding(true);
    }
  };

  const handleEnd = () => {
    setIsHolding(false);
  };

  const isConfirmed = coFounderAStatus === 'confirmed' && bStatus === 'confirmed';

  return (
    <div 
      className={cn(
        "p-lg border rounded-[6px] border-l-4 transition-colors duration-300",
        isConfirmed 
          ? "border-green-200 bg-green-50 border-l-green-500" 
          : "border-red-200 bg-red-50 border-l-red-500"
      )}
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        {isConfirmed ? (
          <Icon name="check_circle" className="w-5 h-5 text-green-600" />
        ) : (
          <Icon name="admin_panel_settings" className="w-5 h-5 text-red-600 animate-pulse" />
        )}
        <h4 className={cn("text-label font-bold tracking-widest uppercase", isConfirmed ? "text-green-800" : "text-red-800")}>
          {isConfirmed ? "CLASS C ACTION RELEASED" : "CLASS C ACTION LOCKED"}
        </h4>
      </div>

      {/* Description */}
      <div className="mb-4">
        <h5 className="font-bold text-sm text-on-surface">{actionType}</h5>
        <p className="text-[12px] text-on-surface-variant mt-1">{description}</p>
      </div>

      {/* Confirmation Slots */}
      <div className="space-y-sm mb-4">
        {/* Row 1 (Asfak Chowdhury) */}
        <div className="flex items-center justify-between p-sm border border-[#E0E0E0] bg-white">
          <div className="flex items-center gap-2">
            <Icon name="check_circle" className="w-4 h-4 text-green-600" />
            <span className="text-xs font-bold text-on-surface">Asfak Chowdhury</span>
          </div>
          <span className="text-[10px] font-bold text-green-700 bg-green-50 px-2 py-0.5 border border-green-200">
            CONFIRMED
          </span>
        </div>

        {/* Row 2 (Maharub Maruf) */}
        <div 
          className={cn(
            "flex items-center justify-between p-sm border transition-colors",
            bStatus === 'confirmed' 
              ? "border-[#E0E0E0] bg-white" 
              : "border-amber-200 bg-amber-50/50"
          )}
        >
          <div className="flex items-center gap-2">
            {bStatus === 'confirmed' ? (
              <Icon name="check_circle" className="w-4 h-4 text-green-600" />
            ) : (
              <Icon name="schedule" className="w-4 h-4 text-amber-500 animate-pulse" />
            )}
            <span className="text-xs font-bold text-on-surface">Maharub Maruf</span>
          </div>
          <span 
            className={cn(
              "text-[10px] font-bold px-2 py-0.5 border",
              bStatus === 'confirmed' 
                ? "text-green-700 bg-green-50 border-green-200" 
                : "text-amber-700 bg-amber-50 border-amber-200 animate-pulse"
            )}
          >
            {bStatus === 'confirmed' ? "CONFIRMED" : "PENDING CONFIRMATION"}
          </span>
        </div>
      </div>

      {/* Interaction Button */}
      {bStatus === 'pending' ? (
        <div className="relative overflow-hidden border border-red-600 rounded-[6px] bg-red-600 active:scale-[0.99] transition-transform">
          {/* Progress Overlay bar */}
          <div 
            className="absolute left-0 top-0 bottom-0 bg-red-800 transition-all duration-75"
            style={{ width: `${progress}%` }}
          />
          
          <button
            onMouseDown={handleStart}
            onMouseUp={handleEnd}
            onMouseLeave={handleEnd}
            onTouchStart={handleStart}
            onTouchEnd={handleEnd}
            className="relative z-10 w-full py-2.5 text-white font-bold text-xs tracking-widest uppercase select-none cursor-pointer flex items-center justify-center gap-2"
          >
            <Icon name="lock" className="w-4 h-4" />
            {isHolding ? `HOLDING... ${Math.round(progress)}%` : "HOLD TO EXECUTE CONFIRMATION"}
          </button>
        </div>
      ) : (
        <div className="w-full bg-green-600 text-white font-bold py-2.5 px-4 rounded-[6px] text-center text-xs tracking-wider uppercase flex items-center justify-center gap-2 border border-green-700">
          <Icon name="auto_awesome" className="w-4 h-4" />
          RELEASE COMPLETE: ACTION EXECUTED
        </div>
      )}
    </div>
  );
}
