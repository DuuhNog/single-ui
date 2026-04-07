import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Modal } from './Modal';

// ─── Rendering ────────────────────────────────────────────────────────────────

describe('Modal — rendering', () => {
  it('renders nothing when open=false', () => {
    render(<Modal open={false} onClose={vi.fn()}>Content</Modal>);
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('renders dialog when open=true', () => {
    render(<Modal open onClose={vi.fn()}>Content</Modal>);
    expect(screen.getByRole('dialog')).toBeTruthy();
  });

  it('renders children content', () => {
    render(<Modal open onClose={vi.fn()}>Hello Modal</Modal>);
    expect(screen.getByText('Hello Modal')).toBeTruthy();
  });

  it('renders title when provided', () => {
    render(<Modal open onClose={vi.fn()} title="Meu Título">X</Modal>);
    expect(screen.getByText('Meu Título')).toBeTruthy();
  });

  it('renders close button by default', () => {
    render(<Modal open onClose={vi.fn()}>X</Modal>);
    expect(screen.getByRole('button', { name: 'Fechar' })).toBeTruthy();
  });

  it('does not render close button when showCloseButton=false', () => {
    render(<Modal open onClose={vi.fn()} showCloseButton={false}>X</Modal>);
    expect(screen.queryByRole('button', { name: 'Fechar' })).toBeNull();
  });

  it('renders footer when provided', () => {
    render(
      <Modal open onClose={vi.fn()} footer={<button>Salvar</button>}>
        X
      </Modal>
    );
    expect(screen.getByRole('button', { name: 'Salvar' })).toBeTruthy();
  });

  it('does not render footer element when footer is not provided', () => {
    render(<Modal open onClose={vi.fn()}>X</Modal>);
    expect(document.querySelector('.single-modal__footer')).toBeNull();
  });

  it.each(['sm', 'md', 'lg', 'xl'] as const)('applies size class: %s', (size) => {
    render(<Modal open onClose={vi.fn()} size={size}>X</Modal>);
    expect(screen.getByRole('dialog').className).toContain(`single-modal--${size}`);
  });

  it('defaults to md size', () => {
    render(<Modal open onClose={vi.fn()}>X</Modal>);
    expect(screen.getByRole('dialog').className).toContain('single-modal--md');
  });

  it('dialog has aria-modal=true', () => {
    render(<Modal open onClose={vi.fn()}>X</Modal>);
    expect(screen.getByRole('dialog').getAttribute('aria-modal')).toBe('true');
  });

  it('renders into document.body via portal', () => {
    render(<Modal open onClose={vi.fn()}>X</Modal>);
    const dialog = screen.getByRole('dialog');
    expect(document.body.contains(dialog)).toBe(true);
  });
});

// ─── Close behaviour ──────────────────────────────────────────────────────────

describe('Modal — close behaviour', () => {
  it('calls onClose when close button is clicked', async () => {
    const onClose = vi.fn();
    render(<Modal open onClose={onClose}>X</Modal>);
    await userEvent.click(screen.getByRole('button', { name: 'Fechar' }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when Escape key is pressed (default)', async () => {
    const onClose = vi.fn();
    render(<Modal open onClose={onClose}>X</Modal>);
    await userEvent.keyboard('{Escape}');
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('does NOT call onClose on Escape when closeOnEscape=false', async () => {
    const onClose = vi.fn();
    render(<Modal open onClose={onClose} closeOnEscape={false}>X</Modal>);
    await userEvent.keyboard('{Escape}');
    expect(onClose).not.toHaveBeenCalled();
  });

  it('calls onClose when overlay is clicked (default)', () => {
    const onClose = vi.fn();
    render(<Modal open onClose={onClose}>X</Modal>);
    const overlay = document.querySelector('.single-modal-overlay') as HTMLElement;
    fireEvent.click(overlay);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('does NOT call onClose when overlay clicked and closeOnOverlayClick=false', () => {
    const onClose = vi.fn();
    render(<Modal open onClose={onClose} closeOnOverlayClick={false}>X</Modal>);
    const overlay = document.querySelector('.single-modal-overlay') as HTMLElement;
    fireEvent.click(overlay);
    expect(onClose).not.toHaveBeenCalled();
  });

  it('does NOT call onClose when clicking inside dialog content', async () => {
    const onClose = vi.fn();
    render(<Modal open onClose={onClose}>Inner content</Modal>);
    await userEvent.click(screen.getByText('Inner content'));
    expect(onClose).not.toHaveBeenCalled();
  });
});

// ─── Scroll lock ─────────────────────────────────────────────────────────────

describe('Modal — scroll lock', () => {
  it('sets overflow:hidden on body when open', () => {
    render(<Modal open onClose={vi.fn()}>X</Modal>);
    expect(document.body.style.overflow).toBe('hidden');
  });

  it('restores body overflow when unmounted', () => {
    const { unmount } = render(<Modal open onClose={vi.fn()}>X</Modal>);
    unmount();
    expect(document.body.style.overflow).toBe('');
  });
});

// ─── Accessibility ────────────────────────────────────────────────────────────

describe('Modal — accessibility', () => {
  it('close button has accessible label', () => {
    render(<Modal open onClose={vi.fn()}>X</Modal>);
    expect(screen.getByRole('button', { name: 'Fechar' })).toBeTruthy();
  });

  it('overlay has aria-hidden=true', () => {
    render(<Modal open onClose={vi.fn()}>X</Modal>);
    const overlay = document.querySelector('.single-modal-overlay');
    expect(overlay?.getAttribute('aria-hidden')).toBe('true');
  });

  it('title is rendered as h2', () => {
    render(<Modal open onClose={vi.fn()} title="Título">X</Modal>);
    expect(document.querySelector('h2')?.textContent).toBe('Título');
  });
});

// ─── Security — XSS via title / children ─────────────────────────────────────
// VULNERABILITY NOTE: Modal renders `title` as {title} inside <h2>, and children
// as React nodes. Both are React-escaped. No XSS vector.

describe('Modal — XSS safety', () => {
  it('renders XSS payload in title as plain text', () => {
    const payload = '<script>window.__modalXss=1</script>';
    render(<Modal open onClose={vi.fn()} title={payload}>X</Modal>);
    const h2 = document.querySelector('h2');
    expect(h2?.querySelector('script')).toBeNull();
    expect(h2?.textContent).toBe(payload);
    expect((window as unknown as Record<string, unknown>).__modalXss).toBeUndefined();
  });

  it('renders XSS payload in children as plain text', () => {
    render(
      <Modal open onClose={vi.fn()}>
        {'<img src=x onerror=alert(1)>'}
      </Modal>
    );
    const content = document.querySelector('.single-modal__content');
    expect(content?.querySelector('img')).toBeNull();
  });

  it('renders excessively long title without crashing', () => {
    const longTitle = 'T'.repeat(10_000);
    render(<Modal open onClose={vi.fn()} title={longTitle}>X</Modal>);
    expect(screen.getByRole('dialog')).toBeTruthy();
  });

  it('renders null-byte characters in children without crashing', () => {
    render(
      <Modal open onClose={vi.fn()}>
        {'\u0000\u0000\u0000'}
      </Modal>
    );
    expect(screen.getByRole('dialog')).toBeTruthy();
  });
});
