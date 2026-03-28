import { useState, useRef, useEffect } from 'react';
import { clsx } from 'clsx';
import { DatePicker } from '../DatePicker/DatePicker';
import './DatePickerInput.css';

export type DateInputFormat = 'DD/MM/YYYY' | 'MM/DD/YYYY';

export interface DatePickerInputProps {
  value?: Date | null;
  onChange?: (date: Date | null) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  helperText?: string;
  disabled?: boolean;
  clearable?: boolean;
  fullWidth?: boolean;
  minDate?: Date;
  maxDate?: Date;
  format?: DateInputFormat;
  dateFormat?: (date: Date) => string;
  className?: string;
}

function buildFormatter(fmt: DateInputFormat) {
  return (date: Date): string => {
    const d = String(date.getDate()).padStart(2, '0');
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const y = String(date.getFullYear());
    return fmt === 'DD/MM/YYYY' ? `${d}/${m}/${y}` : `${m}/${d}/${y}`;
  };
}

function CalendarIcon() {
  return (
    <svg
      className="single-dpi__calendar-icon"
      width="16" height="16" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round"
    >
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg
      width="12" height="12" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2.5"
      strokeLinecap="round" strokeLinejoin="round"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

export function DatePickerInput({
  value,
  onChange,
  placeholder,
  label,
  error,
  helperText,
  disabled = false,
  clearable = false,
  fullWidth = false,
  minDate,
  maxDate,
  format = 'DD/MM/YYYY',
  dateFormat,
  className,
}: DatePickerInputProps) {
  const formatter = dateFormat ?? buildFormatter(format);
  const resolvedPlaceholder = placeholder ?? format;
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleDaySelect = (date: Date) => {
    onChange?.(date);
    setIsOpen(false);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange?.(null);
  };

  const hasValue = value != null;

  return (
    <div
      ref={wrapperRef}
      className={clsx('single-dpi-wrapper', {
        'single-dpi-wrapper--full-width': fullWidth,
        'single-dpi-wrapper--disabled': disabled,
      }, className)}
    >
      {label && <label className="single-dpi__label">{label}</label>}

      <div className="single-dpi">
        <div
          className={clsx('single-dpi__trigger', {
            'single-dpi__trigger--open': isOpen,
            'single-dpi__trigger--error': error,
            'single-dpi__trigger--placeholder': !hasValue,
          })}
          onClick={() => !disabled && setIsOpen(o => !o)}
          role="button"
          tabIndex={disabled ? -1 : 0}
          onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); !disabled && setIsOpen(o => !o); } }}
        >
          <CalendarIcon />
          <span className="single-dpi__value">
            {hasValue ? formatter(value!) : resolvedPlaceholder}
          </span>
          <div className="single-dpi__icons">
            {clearable && hasValue && !disabled && (
              <button
                type="button"
                className="single-dpi__clear"
                onClick={handleClear}
                aria-label="Clear date"
              >
                <XIcon />
              </button>
            )}
          </div>
        </div>

        {isOpen && (
          <div className="single-dpi__popup">
            <DatePicker
              value={value}
              onChange={handleDaySelect}
              minDate={minDate}
              maxDate={maxDate}
            />
          </div>
        )}
      </div>

      {error && <div className="single-dpi__error">{error}</div>}
      {!error && helperText && <div className="single-dpi__helper">{helperText}</div>}
    </div>
  );
}

DatePickerInput.displayName = 'DatePickerInput';
