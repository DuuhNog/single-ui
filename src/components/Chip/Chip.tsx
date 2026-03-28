import { forwardRef } from 'react';
import { clsx } from 'clsx';
import './Chip.css';

export type ChipVariant = 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
export type ChipSize = 'sm' | 'md';

export interface ChipProps {
  label: string;
  variant?: ChipVariant;
  size?: ChipSize;
  onRemove?: (e: React.MouseEvent) => void;
  className?: string;
}

function XSmallIcon() {
  return (
    <svg
      width="10" height="10" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2.5"
      strokeLinecap="round" strokeLinejoin="round"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

export const Chip = forwardRef<HTMLSpanElement, ChipProps>(({
  label,
  variant = 'default',
  size = 'md',
  onRemove,
  className,
}, ref) => {
  return (
    <span
      ref={ref}
      className={clsx(
        'single-chip',
        `single-chip--${variant}`,
        `single-chip--${size}`,
        className,
      )}
    >
      <span className="single-chip__label">{label}</span>
      {onRemove && (
        <button
          type="button"
          className="single-chip__remove"
          onClick={(e) => { e.stopPropagation(); onRemove(e); }}
          aria-label={`Remove ${label}`}
        >
          <XSmallIcon />
        </button>
      )}
    </span>
  );
});

Chip.displayName = 'Chip';
