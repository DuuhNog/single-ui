import { clsx } from 'clsx';
import './Divider.css';

export interface DividerProps {
  orientation?: 'horizontal' | 'vertical';
  label?: string;
  labelPosition?: 'start' | 'center' | 'end';
  className?: string;
  style?: React.CSSProperties;
}

export function Divider({
  orientation = 'horizontal',
  label,
  labelPosition = 'center',
  className,
  style,
}: DividerProps) {
  if (orientation === 'vertical') {
    return (
      <span
        className={clsx('single-divider', 'single-divider--vertical', className)}
        style={style}
        role="separator"
        aria-orientation="vertical"
      />
    );
  }

  if (label) {
    return (
      <div
        className={clsx(
          'single-divider',
          'single-divider--labeled',
          `single-divider--label-${labelPosition}`,
          className
        )}
        style={style}
        role="separator"
        aria-label={label}
      >
        <span className="single-divider__label">{label}</span>
      </div>
    );
  }

  return (
    <hr
      className={clsx('single-divider', 'single-divider--horizontal', className)}
      style={style}
      role="separator"
    />
  );
}

Divider.displayName = 'Divider';
