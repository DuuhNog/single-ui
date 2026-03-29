import React, { useState, useMemo } from 'react';
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
  className?: string;
}

type SortDirection = 'asc' | 'desc' | null;

export function Table<T = any>({
  columns,
  data,
  rowKey = 'id',
  loading = false,
  emptyMessage = 'Nenhum registro encontrado',
  onRowClick,
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

  const tableClasses = clsx('single-table-wrapper', className);

  return (
    <div className={tableClasses}>
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
                        sortDirection === 'asc' ? '↑' : '↓'
                      ) : (
                        '↕'
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
              <td
                colSpan={columns.length}
                className="single-table__empty"
              >
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
