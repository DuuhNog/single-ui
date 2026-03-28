import React, { InputHTMLAttributes, forwardRef, useState } from 'react';
import { clsx } from 'clsx';
import { MaskType } from '../../hooks/useMask';
import './Input.css';

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'size'> {
  label?: string;
  error?: string;
  helperText?: string;
  mask?: MaskType;
  fullWidth?: boolean;
  onChange?: (value: string, event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      mask,
      fullWidth = false,
      className,
      required,
      disabled,
      onChange,
      value: controlledValue,
      defaultValue,
      ...props
    },
    ref
  ) => {
    const [internalValue, setInternalValue] = useState(defaultValue?.toString() || '');
    const isControlled = controlledValue !== undefined;
    const value = isControlled ? controlledValue : internalValue;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      let newValue = e.target.value;

      // Aplicar máscara
      if (mask) {
        switch (mask) {
          case 'currency-brl':
          case 'currency-usd':
            newValue = e.target.value.replace(/\D/g, '');
            break;
          case 'cpf':
            newValue = e.target.value.replace(/\D/g, '').substring(0, 11);
            break;
          case 'cnpj':
            newValue = e.target.value.replace(/\D/g, '').substring(0, 14);
            break;
          case 'phone':
            newValue = e.target.value.replace(/\D/g, '').substring(0, 11);
            break;
          case 'cep':
            newValue = e.target.value.replace(/\D/g, '').substring(0, 8);
            break;
          case 'date':
            newValue = e.target.value.replace(/\D/g, '').substring(0, 8);
            break;
        }
      }

      if (!isControlled) {
        setInternalValue(newValue);
      }

      onChange?.(newValue, e);
    };

    const displayValue = React.useMemo(() => {
      if (!mask) return value;

      const stringValue = value?.toString() || '';

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

    const inputClasses = clsx('single-input', {
      'single-input--error': error,
    });

    return (
      <div className={wrapperClasses}>
        {label && (
          <label className="single-input-label">
            {label}
            {required && <span className="single-input-label__required"> *</span>}
          </label>
        )}
        
        <input
          ref={ref}
          className={inputClasses}
          value={displayValue}
          onChange={handleChange}
          disabled={disabled}
          required={required}
          {...props}
        />

        {error && <div className="single-input-error">{error}</div>}
        {!error && helperText && <div className="single-input-helper">{helperText}</div>}
      </div>
    );
  }
);

Input.displayName = 'Input';
