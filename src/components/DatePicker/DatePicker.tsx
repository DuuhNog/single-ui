import { useState, useCallback, useMemo } from 'react';
import { clsx } from 'clsx';
import './DatePicker.css';

export interface DatePickerProps {
  value?: Date | null;
  onChange?: (date: Date) => void;
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

interface DayCell {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
  isDisabled: boolean;
}

function buildDaysGrid(
  year: number,
  month: number,
  selected: Date | null | undefined,
  today: Date,
  minDate?: Date,
  maxDate?: Date,
): DayCell[] {
  const firstWeekDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const prevMonthDays = new Date(year, month, 0).getDate();
  const cells: DayCell[] = [];

  for (let i = firstWeekDay - 1; i >= 0; i--) {
    const date = midnight(new Date(year, month - 1, prevMonthDays - i));
    cells.push({ date, isCurrentMonth: false, isToday: isSameDay(date, today), isSelected: !!selected && isSameDay(date, selected), isDisabled: isDateDisabled(date, minDate, maxDate) });
  }

  for (let d = 1; d <= daysInMonth; d++) {
    const date = midnight(new Date(year, month, d));
    cells.push({ date, isCurrentMonth: true, isToday: isSameDay(date, today), isSelected: !!selected && isSameDay(date, selected), isDisabled: isDateDisabled(date, minDate, maxDate) });
  }

  const remaining = 42 - cells.length;
  for (let d = 1; d <= remaining; d++) {
    const date = midnight(new Date(year, month + 1, d));
    cells.push({ date, isCurrentMonth: false, isToday: isSameDay(date, today), isSelected: !!selected && isSameDay(date, selected), isDisabled: isDateDisabled(date, minDate, maxDate) });
  }

  return cells;
}

function isDateDisabled(date: Date, minDate?: Date, maxDate?: Date): boolean {
  if (minDate && date < midnight(minDate)) return true;
  if (maxDate && date > midnight(maxDate)) return true;
  return false;
}

// ─── Component ────────────────────────────────────────────────────────────────
export function DatePicker({ value, onChange, minDate, maxDate, className }: DatePickerProps) {
  const today = useMemo(() => midnight(new Date()), []);

  const [viewDate, setViewDate] = useState(() => {
    const d = value ? new Date(value) : new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });

  const [viewMode, setViewMode] = useState<ViewMode>('days');

  const [yearRangeStart, setYearRangeStart] = useState(() => {
    const y = value?.getFullYear() ?? new Date().getFullYear();
    return Math.floor((y - MIN_YEAR) / YEARS_PER_PAGE) * YEARS_PER_PAGE + MIN_YEAR;
  });

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  const daysGrid = useMemo(
    () => buildDaysGrid(year, month, value, today, minDate, maxDate),
    [year, month, value, today, minDate, maxDate],
  );

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

  // ─── Click handlers ──────────────────────────────────────────────────────────
  const handleDayClick = useCallback((cell: DayCell) => {
    if (!cell.isDisabled) onChange?.(cell.date);
  }, [onChange]);

  const handleMonthClick = useCallback((m: number) => {
    setViewDate(new Date(year, m, 1));
    setViewMode('days');
  }, [year]);

  const handleYearClick = useCallback((y: number) => {
    setViewDate(new Date(y, month, 1));
    setViewMode('months');
  }, [month]);

  const handleMonthHeaderClick = useCallback(() => {
    setViewMode(m => m === 'months' ? 'days' : 'months');
  }, []);

  const handleYearHeaderClick = useCallback(() => {
    setYearRangeStart(Math.floor((year - MIN_YEAR) / YEARS_PER_PAGE) * YEARS_PER_PAGE + MIN_YEAR);
    setViewMode('years');
  }, [year]);

  // ─── Render ──────────────────────────────────────────────────────────────────
  const rangeEnd = Math.min(yearRangeStart + YEARS_PER_PAGE - 1, MAX_YEAR);

  const headerTitle = viewMode === 'years'
    ? `${yearRangeStart} – ${rangeEnd}`
    : viewMode === 'months'
      ? String(year)
      : null;

  return (
    <div className={clsx('single-dp', className)}>
      {/* Header */}
      <div className="single-dp-header">
        <button
          className="single-dp-nav"
          onClick={prevPeriod}
          disabled={viewMode === 'years' && yearRangeStart <= MIN_YEAR}
          aria-label="Anterior"
        >
          ‹
        </button>

        {viewMode === 'days' ? (
          <div className="single-dp-header-labels">
            <button className="single-dp-header-btn" onClick={handleMonthHeaderClick}>
              {MONTHS_FULL[month]}
            </button>
            <button className="single-dp-header-btn" onClick={handleYearHeaderClick}>
              {year}
            </button>
          </div>
        ) : (
          <button className="single-dp-header-btn single-dp-header-btn--solo" onClick={() => setViewMode('days')}>
            {headerTitle}
          </button>
        )}

        <button
          className="single-dp-nav"
          onClick={nextPeriod}
          disabled={viewMode === 'years' && yearRangeStart + YEARS_PER_PAGE > MAX_YEAR}
          aria-label="Próximo"
        >
          ›
        </button>
      </div>

      {/* Years grid */}
      {viewMode === 'years' && (
        <div className="single-dp-grid single-dp-grid--years">
          {Array.from({ length: YEARS_PER_PAGE }, (_, i) => yearRangeStart + i)
            .filter(y => y <= MAX_YEAR)
            .map(y => (
              <button
                key={y}
                className={clsx('single-dp-cell single-dp-cell--year', {
                  'single-dp-cell--current': y === today.getFullYear(),
                  'single-dp-cell--selected': y === year,
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
        <div className="single-dp-grid single-dp-grid--months">
          {MONTHS_SHORT.map((m, i) => (
            <button
              key={m}
              className={clsx('single-dp-cell single-dp-cell--month', {
                'single-dp-cell--current': i === today.getMonth() && year === today.getFullYear(),
                'single-dp-cell--selected': i === month,
              })}
              onClick={() => handleMonthClick(i)}
            >
              {m}
            </button>
          ))}
        </div>
      )}

      {/* Days view */}
      {viewMode === 'days' && (
        <>
          <div className="single-dp-weekdays">
            {WEEK_DAYS.map((d, i) => (
              <div key={i} className="single-dp-weekday">{d}</div>
            ))}
          </div>
          <div className="single-dp-grid single-dp-grid--days">
            {daysGrid.map((cell, i) => (
              <button
                key={i}
                className={clsx('single-dp-cell single-dp-cell--day', {
                  'single-dp-cell--other-month': !cell.isCurrentMonth,
                  'single-dp-cell--today': cell.isToday,
                  'single-dp-cell--selected': cell.isSelected,
                  'single-dp-cell--disabled': cell.isDisabled,
                })}
                onClick={() => handleDayClick(cell)}
                disabled={cell.isDisabled}
                aria-label={cell.date.toLocaleDateString('pt-BR')}
                aria-pressed={cell.isSelected}
              >
                <span className="single-dp-cell-inner">{cell.date.getDate()}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

DatePicker.displayName = 'DatePicker';
