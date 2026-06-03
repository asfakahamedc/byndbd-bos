'use client';

import React, { useState, useEffect } from 'react';
import { Icon } from '@/components/ui/icon';
import { cn } from '@/lib/utils';

export interface ClassBTimerProps {
  actionTitle: string;
  initiatedBy: string;
  amount?: string | number;
  description?: string;
  onIntercept?: () => void;
}

/**
 * ClassBTimer is an interactive countdown interceptor for Class B Co-Founder actions.
 * Initiates a 10-minute (600 seconds) objection window countdown.
 */
export default function ClassBTimer({
  actionTitle,
  initiatedBy,
  amount,
  description,
  onIntercept
}: ClassBTimerProps) {
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds
  const [isIntercepted, setIsIntercepted] = useState(false);

  useEffect(() => {
    if (timeLeft <= 0 || isIntercepted) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, isIntercepted]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleIntercept = () => {
    setIsIntercepted(true);
    if (onIntercept) {
      onIntercept();
    }
  };

  const isLowTime = timeLeft < 60;

  return (
    <div 
      className={cn(
        "p-md border rounded-[6px] border-l-4 transition-colors duration-200",
        isIntercepted 
          ? "border-green-200 bg-green-50 border-l-green-500" 
          : "border-amber-200 bg-amber-50 border-l-amber-500"
      )}
    >
      <div className="flex justify-between items-start mb-2">
        <div>
          <span className="flex items-center gap-1.5 text-xs font-bold text-amber-800 uppercase tracking-wide">
            {isIntercepted ? (
              <>
                <Icon name="admin_panel_settings" className="w-3.5 h-3.5 text-green-600" />
                Objection Registered
              </>
            ) : (
              <>
                <Icon name="warning" className="w-3.5 h-3.5 text-amber-600 animate-bounce" />
                Class B Action Pending
              </>
            )}
          </span>
          <h4 className="font-bold text-sm text-on-surface mt-1">
            {actionTitle} {amount ? `(${amount})` : ''}
          </h4>
          <p className="text-[12px] text-on-surface-variant mt-0.5">
            Initiated by: <span className="font-semibold text-on-surface">{initiatedBy}</span>
          </p>
          {description && (
            <p className="text-[12px] text-on-surface-variant mt-1 italic">
              {description}
            </p>
          )}
        </div>
        
        {/* Timer Display */}
        <div className="text-right">
          <div 
            className={cn(
              "font-mono text-lg font-bold select-none",
              isIntercepted 
                ? "text-green-600" 
                : isLowTime 
                  ? "text-red-600 animate-pulse font-black" 
                  : "text-amber-700"
            )}
          >
            {isIntercepted ? "RESOLVED" : formatTime(timeLeft)}
          </div>
          <span className="text-[9px] uppercase tracking-wider text-on-surface-variant">
            {isIntercepted ? "Interposed" : "Objection Window"}
          </span>
        </div>
      </div>

      {/* Action Button */}
      {!isIntercepted ? (
        <button
          onClick={handleIntercept}
          className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-2 px-4 rounded-[6px] border border-amber-600 active:scale-[0.99] transition-transform text-label tracking-widest uppercase mt-2 flex items-center justify-center gap-2"
        >
          <Icon name="timer" className="w-4 h-4" />
          [ INTERCEPT / OBJECT ]
        </button>
      ) : (
        <div className="w-full bg-green-600 text-white font-bold py-2 px-4 rounded-[6px] text-center text-xs tracking-wider uppercase mt-2">
          ACTION HALTED BY CO-FOUNDER OBJECTION
        </div>
      )}
    </div>
  );
}
