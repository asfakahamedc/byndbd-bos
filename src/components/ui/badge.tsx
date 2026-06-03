import React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'success' | 'warning' | 'critical' | 'primary' | 'secondary' | 'neutral' | 'info';
  children: React.ReactNode;
}

export function Badge({ variant = 'neutral', children, className, ...props }: BadgeProps) {
  const variantStyles = {
    primary: 'bg-sunrise text-white',
    secondary: 'bg-golden-hour text-white',
    success: 'bg-[#E8F5E9] text-[#2E7D32]',
    warning: 'bg-[#FFF8E1] text-[#F59E0B]',
    critical: 'bg-[#FFF3F0] text-[#C24B0A]',
    neutral: 'bg-[#F5F5F5] text-[#555555]',
    info: 'bg-[#E3F2FD] text-[#1565C0]',
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-[10px] py-[3px] text-[11px] font-poppins font-semibold rounded-full tracking-[0.02em] uppercase leading-none",
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
