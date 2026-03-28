import { useState, useRef, useEffect } from 'react';
import { clsx } from 'clsx';
import { DateRangePicker } from '../DateRangePicker/DateRangePicker';
import type { DateRange } from '../DateRangePicker/DateRangePicker';
import './DateRangePickerInput.css';

export type DateInputFormat = 'DD/MM/YYYY' | 'MM/DD/YYYY';

export interface DateRangePickerInputProps {
  startDate?: Date | null;
  endDate?: Date | null;
  onChange?: (range: DateRange) => void;
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
      className="single-drpi__calendar-icon"
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

function ArrowIcon() {
  return (
    <svg
      className="single-drpi__arrow-icon"
      width="14" height="14" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round"
    >
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
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

export function DateRangePickerInput({
  startDate,
  endDate,
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
}: DateRangePickerInputProps) {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const formatter = dateFormat ?? buildFormatter(format);
  const resolvedPlaceholder = placeholder ?? `${format} → ${format}`;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleRangeChange = (range: DateRange) => {
    onChange?.(range);
    if (range.startDate && range.endDate) {
      setIsOpen(false);
    }
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange?.({ startDate: null, endDate: null });
  };

  const hasStart = startDate != null;
  const hasEnd = endDate != null;
  const hasValue = hasStart || hasEnd;

  return (
    <div
      ref={wrapperRef}
      className={clsx('single-drpi-wrapper', {
        'single-drpi-wrapper--full-width': fullWidth,
        'single-drpi-wrapper--disabled': disabled,
      }, className)}
    >
      {label && <label className="single-drpi__label">{label}</label>}

      <div className="single-drpi">
        <div
          className={clsx('single-drpi__trigger', {
            'single-drpi__trigger--open': isOpen,
            'single-drpi__trigger--error': error,
            'single-drpi__trigger--placeholder': !hasValue,
          })}
          onClick={() => !disabled && setIsOpen(o => !o)}
          role="button"
          tabIndex={disabled ? -1 : 0}
          onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); !disabled && setIsOpen(o => !o); } }}
        >
          <CalendarIcon />
          {hasStart && hasEnd ? (
            <div className="single-drpi__range-display">
              <span className="single-drpi__date">{formatter(startDate!)}</span>
              <ArrowIcon />
              <span className="single-drpi__date">{formatter(endDate!)}</span>
            </div>
          ) : hasStart ? (
            <span className="single-drpi__value">{formatter(startDate!)} → ...</span>
          ) : (
            <span className="single-drpi__value">{resolvedPlaceholder}</span>
          )}
          <div className="single-drpi__icons">
            {clearable && hasValue && !disabled && (
              <button
                type="button"
                className="single-drpi__clear"
                onClick={handleClear}
                aria-label="Clear dates"
              >
                <XIcon />
              </button>
            )}
          </div>
        </div>

        {isOpen && (
          <div className="single-drpi__popup">
            <DateRangePicker
              startDate={startDate}
              endDate={endDate}
              onChange={handleRangeChange}
              minDate={minDate}
              maxDate={maxDate}
            />
          </div>
        )}
      </div>

      {error && <div className="single-drpi__error">{error}</div>}
      {!error && helperText && <div className="single-drpi__helper">{helperText}</div>}
    </div>
  );
}

DateRangePickerInput.displayName = 'DateRangePickerInput';
