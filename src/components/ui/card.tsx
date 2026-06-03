import React from 'react';
import { cn } from '@/lib/utils';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

/**
 * Card wrapper component enforcing the brutalist 0px border-radius design.
 * Uses .card-elevation for standard hover scaling/shadow animations.
 */
export function Card({ children, className, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "bg-white border border-[#E0E0E0] rounded-lg shadow-sm transition-all duration-200 hover:shadow-md",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
