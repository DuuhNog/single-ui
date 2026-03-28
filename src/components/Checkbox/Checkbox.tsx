import { forwardRef, InputHTMLAttributes } from 'react';
import { clsx } from 'clsx';
import './Checkbox.css';

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  error?: string;
  helperText?: string;
  indeterminate?: boolean;
}

function CheckIcon() {
  return (
    <svg
      className="single-checkbox__check-icon"
      width="10" height="10" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="3"
      strokeLinecap="round" strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function IndeterminateIcon() {
  return (
    <svg
      className="single-checkbox__check-icon"
      width="10" height="10" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="3"
      strokeLinecap="round" strokeLinejoin="round"
    >
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(({
  label,
  error,
  helperText,
  indeterminate = false,
  disabled,
  className,
  id,
  checked,
  ...props
}, ref) => {
  const inputId = id ?? (label ? `checkbox-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined);

  const isChecked = checked || indeterminate;

  return (
    <div className={clsx('single-checkbox-wrapper', className)}>
      <label
        className={clsx('single-checkbox-label', {
          'single-checkbox-label--disabled': disabled,
        })}
        htmlFor={inputId}
      >
        <span className={clsx('single-checkbox', {
          'single-checkbox--checked': isChecked,
          'single-checkbox--indeterminate': indeterminate,
        })}>
          <input
            ref={ref}
            id={inputId}
            type="checkbox"
            className="single-checkbox__input"
            disabled={disabled}
            checked={checked}
            aria-checked={indeterminate ? 'mixed' : checked}
            {...props}
          />
          <span className="single-checkbox__box">
            {indeterminate ? <IndeterminateIcon /> : checked ? <CheckIcon /> : null}
          </span>
        </span>
        {label && <span className="single-checkbox-text">{label}</span>}
      </label>
      {error && <div className="single-checkbox-error">{error}</div>}
      {!error && helperText && <div className="single-checkbox-helper">{helperText}</div>}
    </div>
  );
});

Checkbox.displayName = 'Checkbox';
