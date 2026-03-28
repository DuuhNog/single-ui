import { forwardRef, InputHTMLAttributes } from 'react';
import { clsx } from 'clsx';
import './Switch.css';

export type SwitchSize = 'sm' | 'md' | 'lg';

export interface SwitchProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'> {
  label?: string;
  labelPosition?: 'left' | 'right';
  size?: SwitchSize;
  error?: string;
  helperText?: string;
}

export const Switch = forwardRef<HTMLInputElement, SwitchProps>(({
  label,
  labelPosition = 'right',
  size = 'md',
  error,
  helperText,
  disabled,
  className,
  id,
  ...props
}, ref) => {
  const inputId = id ?? (label ? `switch-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined);

  return (
    <div className={clsx('single-switch-wrapper', className)}>
      <label
        className={clsx('single-switch-label', {
          'single-switch-label--disabled': disabled,
          'single-switch-label--left': labelPosition === 'left',
        })}
        htmlFor={inputId}
      >
        {labelPosition === 'left' && label && (
          <span className="single-switch-text">{label}</span>
        )}
        <span className={clsx('single-switch', `single-switch--${size}`)}>
          <input
            ref={ref}
            id={inputId}
            type="checkbox"
            role="switch"
            className="single-switch__input"
            disabled={disabled}
            {...props}
          />
          <span className="single-switch__track">
            <span className="single-switch__thumb" />
          </span>
        </span>
        {labelPosition === 'right' && label && (
          <span className="single-switch-text">{label}</span>
        )}
      </label>
      {error && <div className="single-switch-error">{error}</div>}
      {!error && helperText && <div className="single-switch-helper">{helperText}</div>}
    </div>
  );
});

Switch.displayName = 'Switch';
