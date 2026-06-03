import React from 'react';
import { cn } from '@/lib/utils';

export interface IconProps extends React.HTMLAttributes<HTMLSpanElement> {
  name: string;              // Material Icon name (e.g. 'dashboard')
  size?: number;             // Standard sizes: 14, 16, 20, 24, 40, 48
  color?: string;            // Text color for the icon
  variant?: 'outlined' | 'filled' | 'round';
  className?: string;
  label?: string;            // aria-label for accessibility
}

export function Icon({
  name,
  size = 24,
  color,
  variant = 'outlined',
  className = '',
  label,
  style,
  ...props
}: IconProps) {
  const fontClass =
    variant === 'filled'  ? 'material-icons' :
    variant === 'round'   ? 'material-icons-round' :
                            'material-symbols-outlined';

  return (
    <span
      className={cn(fontClass, "select-none leading-none shrink-0", className)}
      style={{
        fontSize: size,
        color,
        ...(variant === 'outlined' && {
          fontVariationSettings: `'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' ${size}`,
        }),
        ...style,
      }}
      aria-label={label}
      aria-hidden={!label}
      role={label ? 'img' : 'presentation'}
      {...props}
    >
      {name}
    </span>
  );
}

export default Icon;
