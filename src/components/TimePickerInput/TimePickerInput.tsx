import { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { clsx } from 'clsx';
import { TimePicker } from '../TimePicker/TimePicker';
import type { TimeFormat, TimePeriod } from '../TimePicker/TimePicker';
import { useAnchoredPosition } from '../../hooks/useAnchoredPosition';
import './TimePickerInput.css';

export interface TimePickerInputProps {
  value?: string | null;
  onChange?: (time: string | null) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  helperText?: string;
  disabled?: boolean;
  clearable?: boolean;
  fullWidth?: boolean;
  minTime?: string;
  maxTime?: string;
  step?: number;
  format?: TimeFormat;
  className?: string;
}

function pad(n: number): string {
  return String(n).padStart(2, '0');
}

function to12(hour24: number): { hour12: number; period: TimePeriod } {
  const period: TimePeriod = hour24 < 12 ? 'AM' : 'PM';
  const hour12 = hour24 % 12 === 0 ? 12 : hour24 % 12;
  return { hour12, period };
}

function to24(hour12: number, period: TimePeriod): number {
  if (period === 'AM') return hour12 === 12 ? 0 : hour12;
  return hour12 === 12 ? 12 : hour12 + 12;
}

function formatForDisplay(time24: string | null | undefined, format: TimeFormat): string {
  const parsed = parseTime24(time24);
  if (!parsed) return '';
  if (format === '24h') return `${pad(parsed.hour)}:${pad(parsed.minute)}`;
  const { hour12 } = to12(parsed.hour);
  return `${pad(hour12)}:${pad(parsed.minute)}`;
}

function parseTime24(str?: string | null): { hour: number; minute: number } | null {
  if (!str) return null;
  const match = /^(\d{1,2}):(\d{1,2})/.exec(str.trim());
  if (!match) return null;
  const hour = Number(match[1]);
  const minute = Number(match[2]);
  if (hour < 0 || hour > 23 || minute > 59) return null;
  return { hour, minute };
}

function periodOf(time24?: string | null): TimePeriod {
  const parsed = parseTime24(time24);
  return parsed ? to12(parsed.hour).period : 'AM';
}

function applyDigitsMask(raw: string): string {
  const digits = raw.replace(/\D/g, '').substring(0, 4);
  if (digits.length <= 2) return digits;
  return `${digits.slice(0, 2)}:${digits.slice(2)}`;
}

function parseDigits(text: string, format: TimeFormat, period: TimePeriod): string | null {
  const match = /^(\d{1,2}):(\d{1,2})$/.exec(text.trim());
  if (!match) return null;
  const first = Number(match[1]);
  const minute = Number(match[2]);
  if (minute > 59) return null;

  if (format === '24h') {
    if (first > 23) return null;
    return `${pad(first)}:${pad(minute)}`;
  }
  if (first < 1 || first > 12) return null;
  const hour24 = to24(first, period);
  return `${pad(hour24)}:${pad(minute)}`;
}

function ClockIcon() {
  return (
    <svg
      className="single-tpi__clock-icon"
      width="16" height="16" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="9" />
      <polyline points="12 7 12 12 16 14" />
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

export function TimePickerInput({
  value,
  onChange,
  placeholder,
  label,
  error,
  helperText,
  disabled = false,
  clearable = false,
  fullWidth = false,
  minTime,
  maxTime,
  step = 5,
  format = '24h',
  className,
}: TimePickerInputProps) {
  const [inputText, setInputText] = useState(() => formatForDisplay(value, format));
  const [period, setPeriod] = useState<TimePeriod>(() => periodOf(value));
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const fieldRef = useRef<HTMLDivElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);

  const popupStyle = useAnchoredPosition(fieldRef, popupRef, isOpen, {
    placement: 'bottom-start',
  });

  const resolvedPlaceholder = placeholder ?? (format === '12h' ? 'hh:mm' : 'HH:mm');

  useEffect(() => {
    setInputText(formatForDisplay(value, format));
    setPeriod(periodOf(value));
  }, [value, format]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      const isOutside = !wrapperRef.current?.contains(target) && !popupRef.current?.contains(target);
      if (isOutside) setIsOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleBlur = useCallback(() => {
    if (!inputText.trim()) {
      onChange?.(null);
      return;
    }
    const parsed = parseDigits(inputText, format, period);
    if (!parsed) {
      setInputText(formatForDisplay(value, format));
    } else {
      setInputText(formatForDisplay(parsed, format));
      onChange?.(parsed);
    }
  }, [inputText, format, period, value, onChange]);

  const handlePickerChange = (time: string) => {
    setInputText(formatForDisplay(time, format));
    setPeriod(periodOf(time));
    onChange?.(time);
  };

  const handleTogglePeriod = (e: React.MouseEvent) => {
    e.stopPropagation();
    const next: TimePeriod = period === 'AM' ? 'PM' : 'AM';
    setPeriod(next);
    const parsed = parseDigits(inputText, format, next);
    if (parsed) onChange?.(parsed);
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
      className={clsx('single-tpi-wrapper', {
        'single-tpi-wrapper--full-width': fullWidth,
        'single-tpi-wrapper--disabled': disabled,
      }, className)}
    >
      {label && <label className="single-tpi__label">{label}</label>}

      <div ref={fieldRef} className={clsx('single-tpi__field', {
        'single-tpi__field--open': isFocused,
        'single-tpi__field--error': !!error,
        'single-tpi__field--disabled': disabled,
      })}>
        <input
          type="text"
          className="single-tpi__input"
          value={inputText}
          placeholder={resolvedPlaceholder}
          disabled={disabled}
          onChange={(e) => setInputText(applyDigitsMask(e.target.value))}
          onFocus={() => !disabled && setIsOpen(true)}
          onBlur={handleBlur}
          aria-invalid={!!error}
        />

        <div className="single-tpi__actions">
          {format === '12h' && (
            <button
              type="button"
              className="single-tpi__period"
              onClick={handleTogglePeriod}
              disabled={disabled}
              tabIndex={-1}
              aria-label="Alternar AM/PM"
            >
              {period}
            </button>
          )}
          {clearable && !disabled && (
            <button
              type="button"
              className="single-tpi__clear"
              onClick={handleClear}
              tabIndex={-1}
              aria-label="Limpar horário"
              style={hasValue ? undefined : { visibility: 'hidden', pointerEvents: 'none' }}
            >
              <XIcon />
            </button>
          )}
          <button
            type="button"
            className="single-tpi__clock-btn"
            disabled={disabled}
            onClick={() => !disabled && setIsOpen((o) => !o)}
            tabIndex={-1}
            aria-label="Abrir seletor de horário"
            aria-expanded={isOpen}
          >
            <ClockIcon />
          </button>
        </div>

        {isOpen && createPortal(
          <div ref={popupRef} className="single-tpi__popup" style={popupStyle}>
            <TimePicker
              value={parseDigits(inputText, format, period) ?? value ?? null}
              onChange={handlePickerChange}
              minTime={minTime}
              maxTime={maxTime}
              step={step}
              format={format}
            />
          </div>,
          document.body
        )}
      </div>

      {error && <div className="single-tpi__error">{error}</div>}
      {!error && helperText && <div className="single-tpi__helper">{helperText}</div>}
    </div>
  );
}

TimePickerInput.displayName = 'TimePickerInput';
