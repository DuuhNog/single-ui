import { useState, useCallback, useMemo } from 'react';
import { clsx } from 'clsx';
import './DateRangePicker.css';

export interface DateRange {
  startDate: Date | null;
  endDate: Date | null;
}

export interface DateRangePickerProps {
  startDate?: Date | null;
  endDate?: Date | null;
  onChange?: (range: DateRange) => void;
  minDate?: Date;
  maxDate?: Date;
  className?: string;
}

type ViewMode = 'days' | 'months' | 'years';

const WEEK_DAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
const MONTHS_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const MONTHS_FULL = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const TODAY_YEAR = new Date().getFullYear();
const MIN_YEAR = TODAY_YEAR - 100;
const MAX_YEAR = TODAY_YEAR + 100;
const YEARS_PER_PAGE = 16;

// ─── Helpers ──────────────────────────────────────────────────────────────────
function midnight(d: Date): Date {
  const c = new Date(d);
  c.setHours(0, 0, 0, 0);
  return c;
}

function isSameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();
}

function isDateDisabled(date: Date, minDate?: Date, maxDate?: Date): boolean {
  if (minDate && date < midnight(minDate)) return true;
  if (maxDate && date > midnight(maxDate)) return true;
  return false;
}

interface RangeDayCell {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  isRangeStart: boolean;
  isRangeEnd: boolean;
  isInRange: boolean;
  isDisabled: boolean;
}

function buildRangeDaysGrid(
  year: number,
  month: number,
  start: Date | null | undefined,
  end: Date | null | undefined,
  today: Date,
  minDate?: Date,
  maxDate?: Date,
): RangeDayCell[] {
  const firstWeekDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const prevMonthDays = new Date(year, month, 0).getDate();
  const cells: RangeDayCell[] = [];

  const effectiveStart = start ? midnight(start) : null;
  const effectiveEnd = end ? midnight(end) : null;

  const makeCell = (date: Date, isCurrentMonth: boolean): RangeDayCell => {
    const d = midnight(date);
    const isRangeStart = !!effectiveStart && isSameDay(d, effectiveStart);
    const isRangeEnd = !!effectiveEnd && isSameDay(d, effectiveEnd);
    const isInRange = !!(effectiveStart && effectiveEnd && d > effectiveStart && d < effectiveEnd);
    return {
      date: d,
      isCurrentMonth,
      isToday: isSameDay(d, today),
      isRangeStart,
      isRangeEnd,
      isInRange,
      isDisabled: isDateDisabled(d, minDate, maxDate),
    };
  };

  for (let i = firstWeekDay - 1; i >= 0; i--) {
    cells.push(makeCell(new Date(year, month - 1, prevMonthDays - i), false));
  }
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push(makeCell(new Date(year, month, d), true));
  }
  const remaining = 42 - cells.length;
  for (let d = 1; d <= remaining; d++) {
    cells.push(makeCell(new Date(year, month + 1, d), false));
  }

  return cells;
}

// ─── Calendar panel (internal) ────────────────────────────────────────────────
interface CalendarPanelProps {
  year: number;
  month: number;
  start: Date | null | undefined;
  end: Date | null | undefined;
  hoverDate: Date | null;
  today: Date;
  minDate?: Date;
  maxDate?: Date;
  onDayClick: (date: Date) => void;
  onDayHover: (date: Date) => void;
  onMonthHeaderClick: () => void;
  onYearHeaderClick: () => void;
}

function CalendarPanel({
  year, month, start, end, hoverDate, today, minDate, maxDate,
  onDayClick, onDayHover, onMonthHeaderClick, onYearHeaderClick,
}: CalendarPanelProps) {
  // Use hoverDate as provisional end when only start is selected
  const effectiveEnd = end ?? (start && hoverDate && hoverDate > start ? hoverDate : null);

  const cells = useMemo(
    () => buildRangeDaysGrid(year, month, start, effectiveEnd, today, minDate, maxDate),
    [year, month, start, effectiveEnd, today, minDate, maxDate],
  );

  return (
    <div className="single-drp-calendar">
      <div className="single-drp-cal-header">
        <button className="single-drp-header-btn" onClick={onMonthHeaderClick}>
          {MONTHS_FULL[month]}
        </button>
        <button className="single-drp-header-btn" onClick={onYearHeaderClick}>
          {year}
        </button>
      </div>

      <div className="single-drp-weekdays">
        {WEEK_DAYS.map((d, i) => (
          <div key={i} className="single-drp-weekday">{d}</div>
        ))}
      </div>

      <div className="single-drp-days-grid">
        {cells.map((cell, i) => (
          <button
            key={i}
            className={clsx('single-drp-day', {
              'single-drp-day--other-month': !cell.isCurrentMonth,
              'single-drp-day--today': cell.isToday,
              'single-drp-day--range-start': cell.isRangeStart,
              'single-drp-day--range-end': cell.isRangeEnd,
              'single-drp-day--in-range': cell.isInRange,
              'single-drp-day--disabled': cell.isDisabled,
            })}
            onClick={() => !cell.isDisabled && onDayClick(cell.date)}
            onMouseEnter={() => onDayHover(cell.date)}
            disabled={cell.isDisabled}
            aria-label={cell.date.toLocaleDateString('pt-BR')}
          >
            <span className="single-drp-day-inner">{cell.date.getDate()}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── DateRangePicker ──────────────────────────────────────────────────────────
export function DateRangePicker({
  startDate,
  endDate,
  onChange,
  minDate,
  maxDate,
  className,
}: DateRangePickerProps) {
  const today = useMemo(() => midnight(new Date()), []);

  // Left calendar month
  const [viewDate, setViewDate] = useState(() => {
    const d = startDate ? new Date(startDate) : new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });

  const [viewMode, setViewMode] = useState<ViewMode>('days');
  const [hoverDate, setHoverDate] = useState<Date | null>(null);
  const [yearRangeStart, setYearRangeStart] = useState(() => {
    const y = startDate?.getFullYear() ?? new Date().getFullYear();
    return Math.floor((y - MIN_YEAR) / YEARS_PER_PAGE) * YEARS_PER_PAGE + MIN_YEAR;
  });

  const leftYear = viewDate.getFullYear();
  const leftMonth = viewDate.getMonth();
  const rightDate = new Date(leftYear, leftMonth + 1, 1);
  const rightYear = rightDate.getFullYear();
  const rightMonth = rightDate.getMonth();

  // ─── Navigation ─────────────────────────────────────────────────────────────
  const prevPeriod = useCallback(() => {
    if (viewMode === 'days') setViewDate(d => new Date(d.getFullYear(), d.getMonth() - 1, 1));
    else if (viewMode === 'months') setViewDate(d => new Date(d.getFullYear() - 1, d.getMonth(), 1));
    else setYearRangeStart(s => Math.max(MIN_YEAR, s - YEARS_PER_PAGE));
  }, [viewMode]);

  const nextPeriod = useCallback(() => {
    if (viewMode === 'days') setViewDate(d => new Date(d.getFullYear(), d.getMonth() + 1, 1));
    else if (viewMode === 'months') setViewDate(d => new Date(d.getFullYear() + 1, d.getMonth(), 1));
    else setYearRangeStart(s => Math.min(MAX_YEAR - YEARS_PER_PAGE + 1, s + YEARS_PER_PAGE));
  }, [viewMode]);

  // ─── Day selection ───────────────────────────────────────────────────────────
  const handleDayClick = useCallback((date: Date) => {
    // Both selected or nothing selected → start new selection
    if ((!startDate && !endDate) || (startDate && endDate)) {
      onChange?.({ startDate: date, endDate: null });
      return;
    }
    // Only start selected
    if (startDate && !endDate) {
      if (date < startDate) {
        onChange?.({ startDate: date, endDate: null });
      } else if (isSameDay(date, startDate)) {
        onChange?.({ startDate: null, endDate: null });
      } else {
        onChange?.({ startDate, endDate: date });
        setHoverDate(null);
      }
    }
  }, [startDate, endDate, onChange]);

  const handleDayHover = useCallback((date: Date) => {
    if (startDate && !endDate) setHoverDate(date);
  }, [startDate, endDate]);

  // ─── Month/Year handlers ─────────────────────────────────────────────────────
  const handleMonthHeaderClick = useCallback(() => {
    setViewMode(m => m === 'months' ? 'days' : 'months');
  }, []);

  const handleYearHeaderClick = useCallback(() => {
    setYearRangeStart(Math.floor((leftYear - MIN_YEAR) / YEARS_PER_PAGE) * YEARS_PER_PAGE + MIN_YEAR);
    setViewMode('years');
  }, [leftYear]);

  const handleMonthClick = useCallback((m: number) => {
    setViewDate(new Date(leftYear, m, 1));
    setViewMode('days');
  }, [leftYear]);

  const handleYearClick = useCallback((y: number) => {
    setViewDate(new Date(y, leftMonth, 1));
    setViewMode('months');
  }, [leftMonth]);

  const rangeEnd = Math.min(yearRangeStart + YEARS_PER_PAGE - 1, MAX_YEAR);

  return (
    <div
      className={clsx('single-drp', className)}
      onMouseLeave={() => setHoverDate(null)}
    >
      {/* Global nav arrows + period label */}
      <div className="single-drp-header">
        <button
          className="single-drp-nav"
          onClick={prevPeriod}
          disabled={viewMode === 'years' && yearRangeStart <= MIN_YEAR}
          aria-label="Anterior"
        >
          ‹
        </button>

        {viewMode !== 'days' && (
          <button className="single-drp-period-btn" onClick={() => setViewMode('days')}>
            {viewMode === 'years' ? `${yearRangeStart} – ${rangeEnd}` : String(leftYear)}
          </button>
        )}

        <button
          className="single-drp-nav"
          onClick={nextPeriod}
          disabled={viewMode === 'years' && yearRangeStart + YEARS_PER_PAGE > MAX_YEAR}
          aria-label="Próximo"
        >
          ›
        </button>
      </div>

      {/* Years grid */}
      {viewMode === 'years' && (
        <div className="single-drp-picker-grid single-drp-picker-grid--years">
          {Array.from({ length: YEARS_PER_PAGE }, (_, i) => yearRangeStart + i)
            .filter(y => y <= MAX_YEAR)
            .map(y => (
              <button
                key={y}
                className={clsx('single-drp-picker-cell', {
                  'single-drp-picker-cell--current': y === today.getFullYear(),
                  'single-drp-picker-cell--selected': y === leftYear,
                })}
                onClick={() => handleYearClick(y)}
              >
                {y}
              </button>
            ))}
        </div>
      )}

      {/* Months grid */}
      {viewMode === 'months' && (
        <div className="single-drp-picker-grid single-drp-picker-grid--months">
          {MONTHS_SHORT.map((m, i) => (
            <button
              key={m}
              className={clsx('single-drp-picker-cell', {
                'single-drp-picker-cell--current': i === today.getMonth() && leftYear === today.getFullYear(),
                'single-drp-picker-cell--selected': i === leftMonth,
              })}
              onClick={() => handleMonthClick(i)}
            >
              {m}
            </button>
          ))}
        </div>
      )}

      {/* Two-calendar days view */}
      {viewMode === 'days' && (
        <div className="single-drp-calendars">
          <CalendarPanel
            year={leftYear}
            month={leftMonth}
            start={startDate}
            end={endDate}
            hoverDate={hoverDate}
            today={today}
            minDate={minDate}
            maxDate={maxDate}
            onDayClick={handleDayClick}
            onDayHover={handleDayHover}
            onMonthHeaderClick={handleMonthHeaderClick}
            onYearHeaderClick={handleYearHeaderClick}
          />
          <div className="single-drp-divider" />
          <CalendarPanel
            year={rightYear}
            month={rightMonth}
            start={startDate}
            end={endDate}
            hoverDate={hoverDate}
            today={today}
            minDate={minDate}
            maxDate={maxDate}
            onDayClick={handleDayClick}
            onDayHover={handleDayHover}
            onMonthHeaderClick={handleMonthHeaderClick}
            onYearHeaderClick={handleYearHeaderClick}
          />
        </div>
      )}
    </div>
  );
}

DateRangePicker.displayName = 'DateRangePicker';
