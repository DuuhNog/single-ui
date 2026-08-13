import { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import { clsx } from 'clsx';
import './TimePicker.css';

export type TimeFormat = '24h' | '12h';
export type TimePeriod = 'AM' | 'PM';

export interface TimePickerProps {
  value?: string | null;
  onChange?: (time: string) => void;
  minTime?: string;
  maxTime?: string;
  step?: number;
  format?: TimeFormat;
  className?: string;
}

const ITEM_HEIGHT = 36;
const VISIBLE_ROWS = 5;
const PAD_ROWS = Math.floor(VISIBLE_ROWS / 2);
const SETTLE_DELAY = 120;

function parseTime(time?: string | null): { hour: number; minute: number } | null {
  if (!time) return null;
  const match = /^(\d{1,2}):(\d{1,2})/.exec(time);
  if (!match) return null;
  const hour = Number(match[1]);
  const minute = Number(match[2]);
  if (hour < 0 || hour > 23 || minute < 0 || minute > 59) return null;
  return { hour, minute };
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

function isTimeDisabled(hour: number, minute: number, minTime?: string, maxTime?: string): boolean {
  const totalMinutes = hour * 60 + minute;
  const min = parseTime(minTime);
  const max = parseTime(maxTime);
  if (min && totalMinutes < min.hour * 60 + min.minute) return true;
  if (max && totalMinutes > max.hour * 60 + max.minute) return true;
  return false;
}

interface WheelColumnProps {
  items: { value: number | string; label: string; disabled?: boolean }[];
  selectedIndex: number;
  onSelect: (index: number) => void;
}

function WheelColumn({ items, selectedIndex, onSelect }: WheelColumnProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const settleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [liveIndex, setLiveIndex] = useState(selectedIndex);
  const isProgrammaticScroll = useRef(false);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartY = useRef(0);
  const dragStartScrollTop = useRef(0);
  const dragMoved = useRef(false);

  useEffect(() => {
    setLiveIndex(selectedIndex);
    const el = scrollRef.current;
    if (!el) return;
    const target = selectedIndex * ITEM_HEIGHT;
    if (Math.abs(el.scrollTop - target) > 1) {
      isProgrammaticScroll.current = true;
      el.scrollTop = target;
      requestAnimationFrame(() => { isProgrammaticScroll.current = false; });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedIndex, items.length]);

  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el || isProgrammaticScroll.current) return;
    const idx = Math.min(items.length - 1, Math.max(0, Math.round(el.scrollTop / ITEM_HEIGHT)));
    setLiveIndex(idx);

    if (settleTimer.current) clearTimeout(settleTimer.current);
    settleTimer.current = setTimeout(() => {
      onSelect(idx);
    }, SETTLE_DELAY);
  }, [items.length, onSelect]);

  useEffect(() => () => {
    if (settleTimer.current) clearTimeout(settleTimer.current);
  }, []);

  const handleItemClick = (index: number, disabled?: boolean) => {
    if (disabled || dragMoved.current) return;
    setLiveIndex(index);
    onSelect(index);
    const el = scrollRef.current;
    if (el) el.scrollTo({ top: index * ITEM_HEIGHT, behavior: 'smooth' });
  };

  // Native overflow-y:scroll already handles mouse wheel and touch-swipe
  // scrolling. Click-and-drag with the mouse is not a native browser
  // behavior for scrollable divs, so it's implemented manually via
  // Pointer Events (covers mouse; touch/pen keep using native scrolling
  // since it already works and this handler ignores non-mouse pointers).
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== 'mouse') return;
    const el = scrollRef.current;
    if (!el) return;
    setIsDragging(true);
    dragMoved.current = false;
    dragStartY.current = e.clientY;
    dragStartScrollTop.current = el.scrollTop;
    el.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    const el = scrollRef.current;
    if (!el) return;
    const delta = e.clientY - dragStartY.current;
    if (Math.abs(delta) > 3) dragMoved.current = true;
    el.scrollTop = dragStartScrollTop.current - delta;
  };

  const endDrag = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    setIsDragging(false);
    const el = scrollRef.current;
    if (el?.hasPointerCapture(e.pointerId)) el.releasePointerCapture(e.pointerId);
    // Snap to the nearest cell after a drag release (scroll-snap is disabled
    // while dragging so the drag itself feels continuous, not stepped).
    const idx = Math.min(items.length - 1, Math.max(0, Math.round(el!.scrollTop / ITEM_HEIGHT)));
    el!.scrollTo({ top: idx * ITEM_HEIGHT, behavior: 'smooth' });
  };

  return (
    <div
      ref={scrollRef}
      className={clsx('single-tp-column', { 'single-tp-column--dragging': isDragging })}
      onScroll={handleScroll}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
    >
      <div className="single-tp-spacer" style={{ height: ITEM_HEIGHT * PAD_ROWS }} />
      {items.map((item, i) => (
        <button
          key={item.value}
          type="button"
          className={clsx('single-tp-cell', {
            'single-tp-cell--selected': i === liveIndex,
            'single-tp-cell--disabled': item.disabled,
          })}
          style={{ height: ITEM_HEIGHT }}
          onClick={() => handleItemClick(i, item.disabled)}
          disabled={item.disabled}
        >
          {item.label}
        </button>
      ))}
      <div className="single-tp-spacer" style={{ height: ITEM_HEIGHT * PAD_ROWS }} />
    </div>
  );
}

export function TimePicker({ value, onChange, minTime, maxTime, step = 5, format = '24h', className }: TimePickerProps) {
  const selected = parseTime(value) ?? { hour: 0, minute: 0 };

  const hourItems = useMemo(() => {
    if (format === '12h') {
      return Array.from({ length: 12 }, (_, i) => i + 1).map((h12) => ({ value: h12, label: pad(h12) }));
    }
    return Array.from({ length: 24 }, (_, h) => ({ value: h, label: pad(h) }));
  }, [format]);

  const minuteItems = useMemo(() => {
    const list: { value: number; label: string }[] = [];
    for (let m = 0; m < 60; m += step) list.push({ value: m, label: pad(m) });
    return list;
  }, [step]);

  const periodItems = useMemo(
    () => ([{ value: 'AM', label: 'AM' }, { value: 'PM', label: 'PM' }] as { value: TimePeriod; label: string }[]),
    [],
  );

  const display12 = to12(selected.hour);

  const hourIndex = format === '12h'
    ? hourItems.findIndex((it) => it.value === display12.hour12)
    : selected.hour;
  const minuteIndex = Math.round(selected.minute / step) % minuteItems.length;
  const periodIndex = display12.period === 'AM' ? 0 : 1;

  const commitHour = (index: number) => {
    if (format === '12h') {
      const hour12 = hourItems[index].value as number;
      const hour24 = to24(hour12, display12.period);
      if (isTimeDisabled(hour24, selected.minute, minTime, maxTime)) return;
      onChange?.(`${pad(hour24)}:${pad(selected.minute)}`);
    } else {
      const hour24 = hourItems[index].value as number;
      if (isTimeDisabled(hour24, selected.minute, minTime, maxTime)) return;
      onChange?.(`${pad(hour24)}:${pad(selected.minute)}`);
    }
  };

  const commitMinute = (index: number) => {
    const minute = minuteItems[index].value;
    if (isTimeDisabled(selected.hour, minute, minTime, maxTime)) return;
    onChange?.(`${pad(selected.hour)}:${pad(minute)}`);
  };

  const commitPeriod = (index: number) => {
    const period = periodItems[index].value;
    const hour24 = to24(display12.hour12, period);
    if (isTimeDisabled(hour24, selected.minute, minTime, maxTime)) return;
    onChange?.(`${pad(hour24)}:${pad(selected.minute)}`);
  };

  return (
    <div className={clsx('single-tp', className)} style={{ height: ITEM_HEIGHT * VISIBLE_ROWS }}>
      <div className="single-tp-highlight" style={{ height: ITEM_HEIGHT, top: ITEM_HEIGHT * PAD_ROWS }} />
      <div className="single-tp-columns">
        <WheelColumn items={hourItems} selectedIndex={hourIndex} onSelect={commitHour} />
        <WheelColumn items={minuteItems} selectedIndex={minuteIndex} onSelect={commitMinute} />
        {format === '12h' && (
          <WheelColumn items={periodItems} selectedIndex={periodIndex} onSelect={commitPeriod} />
        )}
      </div>
    </div>
  );
}

TimePicker.displayName = 'TimePicker';
