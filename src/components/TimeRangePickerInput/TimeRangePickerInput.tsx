import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { clsx } from 'clsx';
import { TimePicker } from '../TimePicker/TimePicker';
import type { TimeFormat } from '../TimePicker/TimePicker';
import { useAnchoredPosition } from '../../hooks/useAnchoredPosition';
import './TimeRangePickerInput.css';

export interface TimeRange {
  startTime: string | null;
  endTime: string | null;
}

export interface TimeRangePickerInputProps {
  startTime?: string | null;
  endTime?: string | null;
  onChange?: (range: TimeRange) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  helperText?: string;
  disabled?: boolean;
  clearable?: boolean;
  fullWidth?: boolean;
  step?: number;
  format?: TimeFormat;
  className?: string;
}

function pad(n: number): string {
  return String(n).padStart(2, '0');
}

function formatForDisplay(time24: string | null | undefined, format: TimeFormat): string {
  if (!time24) return '--:--';
  const match = /^(\d{1,2}):(\d{1,2})/.exec(time24.trim());
  if (!match) return '--:--';
  const hour = Number(match[1]);
  const minute = Number(match[2]);
  if (format === '24h') return `${pad(hour)}:${pad(minute)}`;
  const period = hour < 12 ? 'AM' : 'PM';
  const hour12 = hour % 12 === 0 ? 12 : hour % 12;
  return `${pad(hour12)}:${pad(minute)} ${period}`;
}

function ClockIcon() {
  return (
    <svg
      className="single-trpi__clock-icon"
      width="16" height="16" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="9" />
      <polyline points="12 7 12 12 16 14" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg
      className="single-trpi__arrow-icon"
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

export function TimeRangePickerInput({
  startTime,
  endTime,
  onChange,
  placeholder,
  label,
  error,
  helperText,
  disabled = false,
  clearable = false,
  fullWidth = false,
  step = 5,
  format = '24h',
  className,
}: TimeRangePickerInputProps) {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);

  const popupStyle = useAnchoredPosition(triggerRef, popupRef, isOpen, {
    placement: 'bottom-start',
  });

  const resolvedPlaceholder = placeholder ?? 'HH:mm → HH:mm';

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      const isOutside = !wrapperRef.current?.contains(target) && !popupRef.current?.contains(target);
      if (isOutside) setIsOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleStartChange = (time: string) => {
    onChange?.({ startTime: time, endTime: endTime ?? null });
  };

  const handleEndChange = (time: string) => {
    onChange?.({ startTime: startTime ?? null, endTime: time });
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange?.({ startTime: null, endTime: null });
  };

  const hasStart = !!startTime;
  const hasEnd = !!endTime;
  const hasValue = hasStart || hasEnd;

  return (
    <div
      ref={wrapperRef}
      className={clsx('single-trpi-wrapper', {
        'single-trpi-wrapper--full-width': fullWidth,
        'single-trpi-wrapper--disabled': disabled,
      }, className)}
    >
      {label && <label className="single-trpi__label">{label}</label>}

      <div
        ref={triggerRef}
        className={clsx('single-trpi__trigger', {
          'single-trpi__trigger--open': isOpen,
          'single-trpi__trigger--error': !!error,
          'single-trpi__trigger--placeholder': !hasValue,
        })}
        onClick={() => !disabled && setIsOpen((o) => !o)}
        role="button"
        tabIndex={disabled ? -1 : 0}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); !disabled && setIsOpen((o) => !o); } }}
      >
        <ClockIcon />
        {hasStart || hasEnd ? (
          <div className="single-trpi__range-display">
            <span className="single-trpi__time">{formatForDisplay(startTime, format)}</span>
            <ArrowIcon />
            <span className="single-trpi__time">{formatForDisplay(endTime, format)}</span>
          </div>
        ) : (
          <span className="single-trpi__value">{resolvedPlaceholder}</span>
        )}
        <div className="single-trpi__icons">
          {clearable && hasValue && !disabled && (
            <button
              type="button"
              className="single-trpi__clear"
              onClick={handleClear}
              aria-label="Limpar horários"
            >
              <XIcon />
            </button>
          )}
        </div>

        {isOpen && createPortal(
          <div ref={popupRef} className="single-trpi__popup" style={popupStyle} onClick={(e) => e.stopPropagation()}>
            <div className="single-trpi__panel">
              <span className="single-trpi__panel-label">Início</span>
              <TimePicker value={startTime} onChange={handleStartChange} maxTime={endTime ?? undefined} step={step} format={format} />
            </div>
            <div className="single-trpi__panel-divider" />
            <div className="single-trpi__panel">
              <span className="single-trpi__panel-label">Fim</span>
              <TimePicker value={endTime} onChange={handleEndChange} minTime={startTime ?? undefined} step={step} format={format} />
            </div>
          </div>,
          document.body
        )}
      </div>

      {error && <div className="single-trpi__error">{error}</div>}
      {!error && helperText && <div className="single-trpi__helper">{helperText}</div>}
    </div>
  );
}

TimeRangePickerInput.displayName = 'TimeRangePickerInput';
