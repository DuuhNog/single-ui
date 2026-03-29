import { forwardRef } from 'react';
import { clsx } from 'clsx';
import './Pagination.css';

export interface PaginationProps {
  totalPages: number;
  currentPage: number;
  onChange: (page: number) => void;
  siblingCount?: number;
  showFirstLast?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const ELLIPSIS = 'ellipsis' as const;
type PageItem = number | typeof ELLIPSIS;

function usePagination(
  totalPages: number,
  currentPage: number,
  siblingCount: number
): PageItem[] {
  if (totalPages <= 1) return [1];

  const leftSibling = Math.max(currentPage - siblingCount, 1);
  const rightSibling = Math.min(currentPage + siblingCount, totalPages);

  const showLeftEllipsis = leftSibling > 2;
  const showRightEllipsis = rightSibling < totalPages - 1;

  const items: PageItem[] = [];

  // Always show first page
  items.push(1);

  if (showLeftEllipsis) {
    items.push(ELLIPSIS);
  } else {
    // Fill in pages between 1 and leftSibling
    for (let i = 2; i < leftSibling; i++) {
      items.push(i);
    }
  }

  // Sibling range (excluding first and last which are always shown)
  for (let i = leftSibling; i <= rightSibling; i++) {
    if (i !== 1 && i !== totalPages) {
      items.push(i);
    }
  }

  if (showRightEllipsis) {
    items.push(ELLIPSIS);
  } else {
    // Fill in pages between rightSibling and last
    for (let i = rightSibling + 1; i < totalPages; i++) {
      items.push(i);
    }
  }

  // Always show last page (if more than 1)
  if (totalPages > 1) {
    items.push(totalPages);
  }

  return items;
}

export const Pagination = forwardRef<HTMLElement, PaginationProps>(
  (
    {
      totalPages,
      currentPage,
      onChange,
      siblingCount = 1,
      showFirstLast = true,
      size = 'md',
      className,
    },
    ref
  ) => {
    const pages = usePagination(totalPages, currentPage, siblingCount);

    const isFirst = currentPage <= 1;
    const isLast = currentPage >= totalPages;

    const handlePage = (page: number) => {
      if (page < 1 || page > totalPages || page === currentPage) return;
      onChange(page);
    };

    const navClasses = clsx(
      'single-pagination',
      `single-pagination--${size}`,
      className
    );

    return (
      <nav
        ref={ref}
        className={navClasses}
        aria-label="Pagination"
      >
        {/* First button */}
        {showFirstLast && (
          <button
            className={clsx('single-pagination__btn', {
              'single-pagination__btn--disabled': isFirst,
            })}
            onClick={() => handlePage(1)}
            disabled={isFirst}
            aria-label="First page"
          >
            &#171;
          </button>
        )}

        {/* Previous button */}
        <button
          className={clsx('single-pagination__btn', {
            'single-pagination__btn--disabled': isFirst,
          })}
          onClick={() => handlePage(currentPage - 1)}
          disabled={isFirst}
          aria-label="Previous page"
        >
          &#8249;
        </button>

        {/* Page numbers */}
        {pages.map((item, index) => {
          if (item === ELLIPSIS) {
            return (
              <span
                key={`ellipsis-${index}`}
                className="single-pagination__ellipsis"
                aria-hidden="true"
              >
                &hellip;
              </span>
            );
          }

          const isActive = item === currentPage;
          return (
            <button
              key={item}
              className={clsx('single-pagination__btn', 'single-pagination__btn--page', {
                'single-pagination__btn--active': isActive,
              })}
              onClick={() => handlePage(item)}
              aria-label={`Page ${item}`}
              aria-current={isActive ? 'page' : undefined}
            >
              {item}
            </button>
          );
        })}

        {/* Next button */}
        <button
          className={clsx('single-pagination__btn', {
            'single-pagination__btn--disabled': isLast,
          })}
          onClick={() => handlePage(currentPage + 1)}
          disabled={isLast}
          aria-label="Next page"
        >
          &#8250;
        </button>

        {/* Last button */}
        {showFirstLast && (
          <button
            className={clsx('single-pagination__btn', {
              'single-pagination__btn--disabled': isLast,
            })}
            onClick={() => handlePage(totalPages)}
            disabled={isLast}
            aria-label="Last page"
          >
            &#187;
          </button>
        )}
      </nav>
    );
  }
);

Pagination.displayName = 'Pagination';
