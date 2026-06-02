import React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'success' | 'warning' | 'critical' | 'primary' | 'secondary' | 'neutral';
  children: React.ReactNode;
}

/**
 * Badge component for displaying pills, status indicators, and alerts.
 */
export function Badge({ variant = 'neutral', children, className, ...props }: BadgeProps) {
  const variantStyles = {
    primary: 'bg-primary text-on-primary',
    secondary: 'bg-secondary text-white',
    success: 'bg-success/10 text-success border border-success/20',
    warning: 'bg-secondary-container/10 text-secondary border border-secondary-container/20', // warning mapped to secondary/alert colors
    critical: 'bg-error/5 text-error border border-error/10',
    neutral: 'bg-surface-container-high text-on-surface-variant border border-outline-variant',
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 text-xs font-bold rounded-full uppercase tracking-wider",
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
