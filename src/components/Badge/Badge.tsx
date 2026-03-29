import React from 'react';
import { clsx } from 'clsx';
import './Badge.css';

export type BadgeVariant = 'default' | 'primary' | 'success' | 'warning' | 'error' | 'info';
export type BadgeSize = 'sm' | 'md';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  dot?: boolean;
  className?: string;
}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(({
  children,
  variant = 'default',
  size = 'sm',
  dot = false,
  className,
}, ref) => {
  return (
    <span
      ref={ref}
      className={clsx(
        'single-badge',
        `single-badge--${variant}`,
        `single-badge--${size}`,
        className
      )}
    >
      {dot && <span className="single-badge__dot" aria-hidden="true" />}
      {children}
    </span>
  );
});

Badge.displayName = 'Badge';
