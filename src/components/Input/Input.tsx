import React, { InputHTMLAttributes, forwardRef, useState } from 'react';
import { clsx } from 'clsx';
import { MaskType } from '../../hooks/useMask';
import './Input.css';

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'size'> {
  label?: string;
  error?: string;
  helperText?: string;
  mask?: MaskType;
  saveMask?: boolean;
  isEdit?: boolean;
  fullWidth?: boolean;
  onChange?: (value: string, event: React.ChangeEvent<HTMLInputElement>) => void;
  /** Content rendered inside the input's border, before the field (e.g. a DDI/country code selector) */
  leftAddon?: React.ReactNode;
  /** Content rendered inside the input's border, after the field */
  rightAddon?: React.ReactNode;
}

const MASK_DIGIT_LIMITS: Partial<Record<MaskType, number>> = {
  cpf: 11,
  cnpj: 14,
  phone: 11,
  cep: 8,
  date: 8,
};

// Accepts either raw digits or an already-masked string (e.g. a masked value fed back
// through a controlled `value` prop) and always returns the underlying digits only.
function extractMaskDigits(mask: MaskType, value: string): string {
  const digits = value.replace(/\D/g, '');
  const limit = MASK_DIGIT_LIMITS[mask];
  return limit ? digits.substring(0, limit) : digits;
}

function formatMaskedValue(mask: MaskType, rawValue: string): string {
  const stringValue = extractMaskDigits(mask, rawValue);

  switch (mask) {
    case 'currency-brl': {
      const num = (parseFloat(stringValue) || 0) / 100;
      return num.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    }
    case 'currency-usd': {
      const num = (parseFloat(stringValue) || 0) / 100;
      return num.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    }
    case 'cpf':
      return stringValue
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    case 'cnpj':
      return stringValue
        .replace(/(\d{2})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1/$2')
        .replace(/(\d{4})(\d{1,2})$/, '$1-$2');
    case 'phone':
      if (stringValue.length <= 10) {
        return stringValue
          .replace(/(\d{2})(\d)/, '($1) $2')
          .replace(/(\d{4})(\d)/, '$1-$2');
      }
      return stringValue
        .replace(/(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{5})(\d)/, '$1-$2');
    case 'cep':
      return stringValue.replace(/(\d{5})(\d)/, '$1-$2');
    case 'date':
      return stringValue
        .replace(/(\d{2})(\d)/, '$1/$2')
        .replace(/(\d{2})(\d)/, '$1/$2');
    default:
      return stringValue;
  }
}

function EyeIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      mask,
      saveMask = true,
      isEdit = true,
      fullWidth = false,
      className,
      required,
      disabled,
      onChange,
      leftAddon,
      rightAddon,
      value: controlledValue,
      defaultValue,
      type,
      ...props
    },
    ref
  ) => {
    const [internalValue, setInternalValue] = useState(defaultValue?.toString() || '');
    const [passwordVisible, setPasswordVisible] = useState(false);
    const isControlled = controlledValue !== undefined;
    const value = isControlled ? controlledValue : internalValue;
    const isPassword = type === 'password';

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      let newValue = e.target.value;

      if (mask) {
        newValue = extractMaskDigits(mask, e.target.value);
      }

      if (!isControlled) {
        setInternalValue(newValue);
      }

      const outputValue = mask && saveMask ? formatMaskedValue(mask, newValue) : newValue;
      onChange?.(outputValue, e);
    };

    const displayValue = React.useMemo(() => {
      if (!mask) return value;
      return formatMaskedValue(mask, value?.toString() || '');
    }, [value, mask]);

    const wrapperClasses = clsx(
      'single-input-wrapper',
      {
        'single-input-wrapper--full-width': fullWidth,
        'single-input-wrapper--error': error,
        'single-input-wrapper--disabled': disabled,
      },
      className
    );

    if (!isEdit) {
      return (
        <div className={wrapperClasses}>
          {label && (
            <label className="single-input-label">
              {label}
              {required && <span className="single-input-label__required"> *</span>}
            </label>
          )}
          <div className="single-input-view-value">{displayValue || '-'}</div>
          {error && <div className="single-input-error">{error}</div>}
          {!error && helperText && <div className="single-input-helper">{helperText}</div>}
        </div>
      );
    }

    const inputClasses = clsx('single-input', {
      'single-input--error': error,
      'single-input--password': isPassword,
    });

    const inputEl = (
      <input
        ref={ref}
        className={inputClasses}
        value={displayValue}
        onChange={handleChange}
        disabled={disabled}
        required={required}
        type={isPassword ? (passwordVisible ? 'text' : 'password') : type}
        {...props}
      />
    );

    const fieldInner = isPassword ? (
      <div className={clsx('single-input-password-field', { 'single-input-password-field--error': !!error, 'single-input-password-field--disabled': disabled })}>
        {inputEl}
        <button
          type="button"
          className="single-input-password-toggle"
          onClick={() => setPasswordVisible((v) => !v)}
          disabled={disabled}
          tabIndex={-1}
          aria-label={passwordVisible ? 'Ocultar senha' : 'Mostrar senha'}
        >
          {passwordVisible ? <EyeOffIcon /> : <EyeIcon />}
        </button>
      </div>
    ) : (
      inputEl
    );

    const hasAddon = !!leftAddon || !!rightAddon;

    return (
      <div className={wrapperClasses}>
        {label && (
          <label className="single-input-label">
            {label}
            {required && <span className="single-input-label__required"> *</span>}
          </label>
        )}

        {hasAddon ? (
          <div className={clsx('single-input-addon-field', { 'single-input-addon-field--error': !!error, 'single-input-addon-field--disabled': disabled })}>
            {leftAddon && <div className="single-input-addon single-input-addon--left">{leftAddon}</div>}
            {fieldInner}
            {rightAddon && <div className="single-input-addon single-input-addon--right">{rightAddon}</div>}
          </div>
        ) : (
          fieldInner
        )}

        {error && <div className="single-input-error">{error}</div>}
        {!error && helperText && <div className="single-input-helper">{helperText}</div>}
      </div>
    );
  }
);

Input.displayName = 'Input';
