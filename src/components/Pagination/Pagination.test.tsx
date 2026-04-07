import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Pagination } from './Pagination';

// ─── Rendering ────────────────────────────────────────────────────────────────

describe('Pagination — rendering', () => {
  it('renders a nav element', () => {
    render(<Pagination totalPages={5} currentPage={1} onChange={vi.fn()} />);
    expect(screen.getByRole('navigation')).toBeTruthy();
  });

  it('nav has aria-label="Pagination"', () => {
    render(<Pagination totalPages={5} currentPage={1} onChange={vi.fn()} />);
    expect(screen.getByRole('navigation').getAttribute('aria-label')).toBe('Pagination');
  });

  it('renders page buttons for each page in small range', () => {
    render(<Pagination totalPages={5} currentPage={3} onChange={vi.fn()} />);
    expect(screen.getByRole('button', { name: 'Page 1' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Page 5' })).toBeTruthy();
  });

  it('renders first/last buttons when showFirstLast=true (default)', () => {
    render(<Pagination totalPages={5} currentPage={3} onChange={vi.fn()} />);
    expect(screen.getByRole('button', { name: 'First page' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Last page' })).toBeTruthy();
  });

  it('does not render first/last buttons when showFirstLast=false', () => {
    render(<Pagination totalPages={5} currentPage={3} onChange={vi.fn()} showFirstLast={false} />);
    expect(screen.queryByRole('button', { name: 'First page' })).toBeNull();
    expect(screen.queryByRole('button', { name: 'Last page' })).toBeNull();
  });

  it('renders prev and next buttons', () => {
    render(<Pagination totalPages={5} currentPage={3} onChange={vi.fn()} />);
    expect(screen.getByRole('button', { name: 'Previous page' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Next page' })).toBeTruthy();
  });

  it.each(['sm', 'md', 'lg'] as const)('applies size class: %s', (size) => {
    render(<Pagination totalPages={5} currentPage={1} onChange={vi.fn()} size={size} />);
    expect(
      screen.getByRole('navigation').className
    ).toContain(`single-pagination--${size}`);
  });

  it('merges custom className', () => {
    render(
      <Pagination totalPages={5} currentPage={1} onChange={vi.fn()} className="my-pager" />
    );
    expect(screen.getByRole('navigation').className).toContain('my-pager');
  });

  it('forwards ref to nav element', () => {
    const ref = { current: null as HTMLElement | null };
    render(<Pagination totalPages={5} currentPage={1} onChange={vi.fn()} ref={ref} />);
    expect(ref.current?.tagName).toBe('NAV');
  });
});

// ─── Active page ──────────────────────────────────────────────────────────────

describe('Pagination — active page', () => {
  it('current page button has active class', () => {
    render(<Pagination totalPages={5} currentPage={3} onChange={vi.fn()} />);
    const btn = screen.getByRole('button', { name: 'Page 3' });
    expect(btn.className).toContain('single-pagination__btn--active');
  });

  it('current page button has aria-current="page"', () => {
    render(<Pagination totalPages={5} currentPage={3} onChange={vi.fn()} />);
    expect(
      screen.getByRole('button', { name: 'Page 3' }).getAttribute('aria-current')
    ).toBe('page');
  });

  it('other page buttons do not have aria-current', () => {
    render(<Pagination totalPages={5} currentPage={3} onChange={vi.fn()} />);
    expect(
      screen.getByRole('button', { name: 'Page 1' }).getAttribute('aria-current')
    ).toBeNull();
  });
});

// ─── Navigation clicks ────────────────────────────────────────────────────────

describe('Pagination — navigation', () => {
  it('calls onChange with next page on Next click', async () => {
    const onChange = vi.fn();
    render(<Pagination totalPages={5} currentPage={2} onChange={onChange} />);
    await userEvent.click(screen.getByRole('button', { name: 'Next page' }));
    expect(onChange).toHaveBeenCalledWith(3);
  });

  it('calls onChange with previous page on Previous click', async () => {
    const onChange = vi.fn();
    render(<Pagination totalPages={5} currentPage={3} onChange={onChange} />);
    await userEvent.click(screen.getByRole('button', { name: 'Previous page' }));
    expect(onChange).toHaveBeenCalledWith(2);
  });

  it('calls onChange with 1 on First click', async () => {
    const onChange = vi.fn();
    render(<Pagination totalPages={5} currentPage={4} onChange={onChange} />);
    await userEvent.click(screen.getByRole('button', { name: 'First page' }));
    expect(onChange).toHaveBeenCalledWith(1);
  });

  it('calls onChange with totalPages on Last click', async () => {
    const onChange = vi.fn();
    render(<Pagination totalPages={5} currentPage={2} onChange={onChange} />);
    await userEvent.click(screen.getByRole('button', { name: 'Last page' }));
    expect(onChange).toHaveBeenCalledWith(5);
  });

  it('calls onChange with the correct page number when page button clicked', async () => {
    const onChange = vi.fn();
    // currentPage=3 ensures pages 2-4 are all visible (no ellipsis in a 5-page range)
    render(<Pagination totalPages={5} currentPage={3} onChange={onChange} />);
    await userEvent.click(screen.getByRole('button', { name: 'Page 4' }));
    expect(onChange).toHaveBeenCalledWith(4);
  });

  it('does NOT call onChange when clicking current active page', async () => {
    const onChange = vi.fn();
    render(<Pagination totalPages={5} currentPage={3} onChange={onChange} />);
    await userEvent.click(screen.getByRole('button', { name: 'Page 3' }));
    expect(onChange).not.toHaveBeenCalled();
  });
});

// ─── Boundary states ──────────────────────────────────────────────────────────

describe('Pagination — boundary states', () => {
  it('First and Previous buttons are disabled on page 1', () => {
    render(<Pagination totalPages={5} currentPage={1} onChange={vi.fn()} />);
    expect(screen.getByRole('button', { name: 'First page' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Previous page' })).toBeDisabled();
  });

  it('Last and Next buttons are disabled on last page', () => {
    render(<Pagination totalPages={5} currentPage={5} onChange={vi.fn()} />);
    expect(screen.getByRole('button', { name: 'Last page' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Next page' })).toBeDisabled();
  });

  it('does NOT call onChange when clicking disabled Previous', async () => {
    const onChange = vi.fn();
    render(<Pagination totalPages={5} currentPage={1} onChange={onChange} />);
    await userEvent.click(screen.getByRole('button', { name: 'Previous page' }));
    expect(onChange).not.toHaveBeenCalled();
  });

  it('does NOT call onChange when clicking disabled Next', async () => {
    const onChange = vi.fn();
    render(<Pagination totalPages={5} currentPage={5} onChange={onChange} />);
    await userEvent.click(screen.getByRole('button', { name: 'Next page' }));
    expect(onChange).not.toHaveBeenCalled();
  });

  it('handles totalPages=1 (only page 1 rendered, no navigation needed)', () => {
    render(<Pagination totalPages={1} currentPage={1} onChange={vi.fn()} />);
    expect(screen.getByRole('button', { name: 'Page 1' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'First page' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Last page' })).toBeDisabled();
  });
});

// ─── Ellipsis ─────────────────────────────────────────────────────────────────

describe('Pagination — ellipsis', () => {
  it('renders ellipsis for large page ranges', () => {
    render(<Pagination totalPages={20} currentPage={10} onChange={vi.fn()} />);
    const ellipses = document.querySelectorAll('.single-pagination__ellipsis');
    expect(ellipses.length).toBeGreaterThanOrEqual(1);
  });

  it('ellipsis elements have aria-hidden=true', () => {
    render(<Pagination totalPages={20} currentPage={10} onChange={vi.fn()} />);
    const ellipses = document.querySelectorAll('.single-pagination__ellipsis[aria-hidden="true"]');
    expect(ellipses.length).toBeGreaterThanOrEqual(1);
  });

  it('does NOT render ellipsis when range is small', () => {
    render(<Pagination totalPages={5} currentPage={3} onChange={vi.fn()} />);
    expect(document.querySelector('.single-pagination__ellipsis')).toBeNull();
  });

  it('renders sibling pages around current', () => {
    render(<Pagination totalPages={20} currentPage={10} onChange={vi.fn()} siblingCount={1} />);
    expect(screen.getByRole('button', { name: 'Page 9' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Page 10' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Page 11' })).toBeTruthy();
  });

  it('always shows first page button', () => {
    render(<Pagination totalPages={20} currentPage={15} onChange={vi.fn()} />);
    expect(screen.getByRole('button', { name: 'Page 1' })).toBeTruthy();
  });

  it('always shows last page button', () => {
    render(<Pagination totalPages={20} currentPage={5} onChange={vi.fn()} />);
    expect(screen.getByRole('button', { name: 'Page 20' })).toBeTruthy();
  });
});

// ─── Edge cases (security / robustness) ───────────────────────────────────────
// Pagination receives numeric props, so XSS is not applicable.
// These tests verify the component doesn't crash on unexpected numeric values.

describe('Pagination — robustness', () => {
  it('handles very large totalPages without crashing', () => {
    render(<Pagination totalPages={10_000} currentPage={5_000} onChange={vi.fn()} />);
    expect(screen.getByRole('navigation')).toBeTruthy();
  });

  it('renders correctly when currentPage exceeds totalPages (guard)', () => {
    // The handlePage guard prevents emitting invalid values; component should still render
    const onChange = vi.fn();
    render(<Pagination totalPages={5} currentPage={10} onChange={onChange} />);
    expect(screen.getByRole('navigation')).toBeTruthy();
  });
});
