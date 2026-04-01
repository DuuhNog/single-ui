import { useState, useRef, useEffect, useCallback } from 'react';
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

function applyDateMask(raw: string): string {
  const digits = raw.replace(/\D/g, '').substring(0, 8);
  if (digits.length <= 2) return digits;
  if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
}

function parseDate(str: string, fmt: DateInputFormat): Date | null {
  const parts = str.trim().split('/');
  if (parts.length !== 3) return null;
  let day: number, month: number, year: number;
  if (fmt === 'DD/MM/YYYY') {
    [day, month, year] = parts.map(Number);
  } else {
    [month, day, year] = parts.map(Number);
  }
  if (!day || !month || !year || year < 1000 || year > 9999) return null;
  const d = new Date(year, month - 1, day);
  if (d.getFullYear() !== year || d.getMonth() !== month - 1 || d.getDate() !== day) return null;
  return d;
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

  const [inputText, setInputText] = useState(() =>
    value instanceof Date && !isNaN(value.getTime()) ? formatter(value) : ''
  );
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Sync external value → input text (when controlled externally)
  useEffect(() => {
    if (value === null || value === undefined) {
      setInputText('');
    } else if (value instanceof Date && !isNaN(value.getTime())) {
      setInputText(formatter(value));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleBlur = useCallback(() => {
    if (!inputText.trim()) {
      onChange?.(null);
      return;
    }
    const parsed = parseDate(inputText, format);
    if (!parsed) {
      // Invalid → clear
      setInputText('');
      onChange?.(null);
    } else {
      setInputText(formatter(parsed));
      onChange?.(parsed);
    }
  }, [inputText, format, formatter, onChange]);

  const handleDaySelect = (date: Date) => {
    setInputText(formatter(date));
    onChange?.(date);
    setIsOpen(false);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setInputText('');
    onChange?.(null);
  };

  const hasValue = inputText.trim().length > 0;
  const isFocused = isOpen;

  return (
    <div
      ref={wrapperRef}
      className={clsx('single-dpi-wrapper', {
        'single-dpi-wrapper--full-width': fullWidth,
        'single-dpi-wrapper--disabled': disabled,
      }, className)}
    >
      {label && <label className="single-dpi__label">{label}</label>}

      <div className={clsx('single-dpi__field', {
        'single-dpi__field--open': isFocused,
        'single-dpi__field--error': !!error,
        'single-dpi__field--disabled': disabled,
      })}>
        <input
          type="text"
          className="single-dpi__input"
          value={inputText}
          placeholder={resolvedPlaceholder}
          disabled={disabled}
          onChange={(e) => setInputText(applyDateMask(e.target.value))}
          onBlur={handleBlur}
          aria-invalid={!!error}
        />

        <div className="single-dpi__actions">
          {clearable && !disabled && (
            <button
              type="button"
              className="single-dpi__clear"
              onClick={handleClear}
              tabIndex={-1}
              aria-label="Limpar data"
              style={hasValue ? undefined : { visibility: 'hidden', pointerEvents: 'none' }}
            >
              <XIcon />
            </button>
          )}
          <button
            type="button"
            className="single-dpi__calendar-btn"
            disabled={disabled}
            onClick={() => !disabled && setIsOpen((o) => !o)}
            tabIndex={-1}
            aria-label="Abrir calendário"
            aria-expanded={isOpen}
          >
            <CalendarIcon />
          </button>
        </div>

        {isOpen && (
          <div className="single-dpi__popup">
            <DatePicker
              value={parseDate(inputText, format) ?? value ?? null}
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
