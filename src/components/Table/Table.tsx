import React, { useState, useMemo, useRef, useEffect } from 'react';
import { clsx } from 'clsx';
import './Table.css';

export interface TableColumn<T = any> {
  key: string;
  label: string;
  width?: string | number;
  align?: 'left' | 'center' | 'right';
  sortable?: boolean;
  render?: (value: any, row: T, index: number) => React.ReactNode;
  renderHeader?: () => React.ReactNode;
}

export interface TableProps<T = any> {
  columns: TableColumn<T>[];
  data: T[];
  rowKey?: string;
  loading?: boolean;
  emptyMessage?: string;
  onRowClick?: (row: T, index: number) => void;
  /** Content rendered inside the filter popover */
  filterContent?: React.ReactNode;
  className?: string;
}

type SortDirection = 'asc' | 'desc' | null;

/* ─── Sort icons ─────────────────────────────────────────────────────────── */
function IconSortNeutral() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 4.5L6 2l3 2.5M3 7.5L6 10l3-2.5" />
    </svg>
  );
}

function IconSortAsc() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 7L6 4l3 3" />
    </svg>
  );
}

function IconSortDesc() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 5l3 3 3-3" />
    </svg>
  );
}

/* ─── Filter icon ────────────────────────────────────────────────────────── */
function IconFilter() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
    </svg>
  );
}

/* ─── Filter Popover ─────────────────────────────────────────────────────── */
function FilterPopover({ content }: { content: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  return (
    <div ref={wrapperRef} className="single-table__filter-wrap">
      <button
        type="button"
        className={clsx('single-table__filter-btn', { 'single-table__filter-btn--open': open })}
        onClick={() => setOpen((v) => !v)}
        aria-label="Filtros"
        aria-expanded={open}
      >
        <IconFilter />
        <span>Filtros</span>
      </button>
      {open && (
        <div className="single-table__filter-panel">
          {content}
        </div>
      )}
    </div>
  );
}

/* ─── Table ──────────────────────────────────────────────────────────────── */
export function Table<T = any>({
  columns,
  data,
  rowKey = 'id',
  loading = false,
  emptyMessage = 'Nenhum registro encontrado',
  onRowClick,
  filterContent,
  className,
}: TableProps<T>) {
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);

  const handleSort = (column: TableColumn<T>) => {
    if (!column.sortable) return;

    if (sortColumn === column.key) {
      if (sortDirection === 'asc') {
        setSortDirection('desc');
      } else if (sortDirection === 'desc') {
        setSortColumn(null);
        setSortDirection(null);
      }
    } else {
      setSortColumn(column.key);
      setSortDirection('asc');
    }
  };

  const sortedData = useMemo(() => {
    if (!sortColumn || !sortDirection) return data;

    return [...data].sort((a, b) => {
      const aVal = (a as any)[sortColumn];
      const bVal = (b as any)[sortColumn];

      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [data, sortColumn, sortDirection]);

  return (
    <div className={clsx('single-table-wrapper', className)}>
      {filterContent && (
        <div className="single-table__toolbar">
          <FilterPopover content={filterContent} />
        </div>
      )}

      <table className="single-table">
        <thead className="single-table__header">
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                className={clsx('single-table__header-cell', {
                  'single-table__header-cell--sortable': column.sortable,
                  'single-table__header-cell--sorted': sortColumn === column.key,
                  [`single-table__header-cell--${column.align}`]: column.align,
                })}
                style={{ width: column.width }}
                onClick={() => handleSort(column)}
              >
                <div className="single-table__header-content">
                  {column.renderHeader ? column.renderHeader() : <span>{column.label}</span>}
                  {column.sortable && (
                    <span className="single-table__sort-icon">
                      {sortColumn === column.key ? (
                        sortDirection === 'asc' ? <IconSortAsc /> : <IconSortDesc />
                      ) : (
                        <IconSortNeutral />
                      )}
                    </span>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>

        <tbody className="single-table__body">
          {loading ? (
            <tr>
              <td colSpan={columns.length} className="single-table__loading-cell">
                <div className="single-table__loading">
                  <div className="single-table__spinner" />
                  <span>Carregando...</span>
                </div>
              </td>
            </tr>
          ) : sortedData.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="single-table__empty">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            sortedData.map((row, index) => (
              <tr
                key={(row as any)[rowKey] || index}
                className={clsx('single-table__row', {
                  'single-table__row--clickable': !!onRowClick,
                })}
                onClick={() => onRowClick?.(row, index)}
              >
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className={clsx('single-table__cell', {
                      [`single-table__cell--${column.align}`]: column.align,
                    })}
                  >
                    {column.render
                      ? column.render((row as any)[column.key], row, index)
                      : (row as any)[column.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

Table.displayName = 'Table';
