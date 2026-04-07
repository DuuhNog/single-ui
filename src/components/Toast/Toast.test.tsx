import { afterEach, describe, it, expect, vi } from 'vitest';
import { render, screen, act, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ToastProvider, useToast } from './Toast';
import React from 'react';

// ─── Helper: component that triggers toasts ───────────────────────────────────

function ToastTrigger({
  message = 'Mensagem',
  variant,
  title,
  duration,
}: {
  message?: string;
  variant?: 'success' | 'error' | 'warning' | 'info';
  title?: string;
  duration?: number;
}) {
  const { toast } = useToast();
  return (
    <button
      onClick={() =>
        variant
          ? toast[variant](message, { title, duration })
          : toast(message, { title, duration })
      }
    >
      trigger
    </button>
  );
}

function renderWithProvider(ui: React.ReactElement) {
  return render(<ToastProvider>{ui}</ToastProvider>);
}

// ─── ToastProvider ────────────────────────────────────────────────────────────

describe('ToastProvider', () => {
  it('renders children', () => {
    renderWithProvider(<span>child</span>);
    expect(screen.getByText('child')).toBeTruthy();
  });

  it('does not render toast container when no toasts', () => {
    renderWithProvider(<span />);
    expect(document.querySelector('.single-toast-container')).toBeNull();
  });
});

// ─── useToast — guard ─────────────────────────────────────────────────────────

describe('useToast — outside provider', () => {
  it('throws when used outside ToastProvider', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<ToastTrigger />)).toThrow(
      'useToast must be used within a ToastProvider'
    );
    spy.mockRestore();
  });
});

// ─── Rendering toasts ─────────────────────────────────────────────────────────

describe('Toast — rendering', () => {
  it('shows toast after toast() call', async () => {
    renderWithProvider(<ToastTrigger message="Olá" />);
    await userEvent.click(screen.getByRole('button', { name: 'trigger' }));
    expect(await screen.findByText('Olá')).toBeTruthy();
  });

  it.each(['success', 'error', 'warning', 'info'] as const)(
    'renders variant=%s with correct class',
    async (variant) => {
      renderWithProvider(<ToastTrigger message="Msg" variant={variant} />);
      await userEvent.click(screen.getByRole('button', { name: 'trigger' }));
      await screen.findByText('Msg');
      const toast = document.querySelector(`.single-toast--${variant}`);
      expect(toast).toBeTruthy();
    }
  );

  it('renders title when provided', async () => {
    renderWithProvider(<ToastTrigger message="Msg" title="Cabeçalho" variant="success" />);
    await userEvent.click(screen.getByRole('button', { name: 'trigger' }));
    expect(await screen.findByText('Cabeçalho')).toBeTruthy();
  });

  it('renders multiple toasts when called multiple times', async () => {
    renderWithProvider(<ToastTrigger message="Repetido" />);
    await userEvent.click(screen.getByRole('button', { name: 'trigger' }));
    await userEvent.click(screen.getByRole('button', { name: 'trigger' }));
    const toasts = await screen.findAllByText('Repetido');
    expect(toasts.length).toBeGreaterThanOrEqual(2);
  });

  it('renders toast with role=alert and aria-live=assertive', async () => {
    renderWithProvider(<ToastTrigger message="Alerta" />);
    await userEvent.click(screen.getByRole('button', { name: 'trigger' }));
    const alert = await screen.findByRole('alert');
    expect(alert.getAttribute('aria-live')).toBe('assertive');
    expect(alert.getAttribute('aria-atomic')).toBe('true');
  });
});

// ─── Dismiss ──────────────────────────────────────────────────────────────────
// NOTE: These tests use vi.useFakeTimers() to control auto-dismiss timers.
// We use fireEvent (synchronous) instead of userEvent (async, uses timers)
// to avoid userEvent hanging while fake timers are active.

describe('Toast — dismiss', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('removes toast when close button is clicked', async () => {
    vi.useFakeTimers({ shouldAdvanceTime: false });
    renderWithProvider(<ToastTrigger message="Fechar" />);
    // Use real userEvent only for the initial trigger button (before fake timers affect the toast)
    // then switch to fireEvent for toast-internal buttons
    act(() => { fireEvent.click(screen.getByRole('button', { name: 'trigger' })); });
    expect(screen.getByText('Fechar')).toBeTruthy();
    act(() => { fireEvent.click(screen.getByRole('button', { name: 'Fechar notificação' })); });
    // Advance time past the dismiss animation (300ms)
    act(() => { vi.advanceTimersByTime(400); });
    expect(screen.queryByText('Fechar')).toBeNull();
  });

  it('adds dismissing class before removal', () => {
    vi.useFakeTimers({ shouldAdvanceTime: false });
    renderWithProvider(<ToastTrigger message="Dismiss class" />);
    act(() => { fireEvent.click(screen.getByRole('button', { name: 'trigger' })); });
    act(() => { fireEvent.click(screen.getByRole('button', { name: 'Fechar notificação' })); });
    // Before the 300ms timeout the element should have the dismissing class
    expect(document.querySelector('.single-toast--dismissing')).toBeTruthy();
  });

  it('auto-dismisses after duration', () => {
    vi.useFakeTimers({ shouldAdvanceTime: false });
    renderWithProvider(<ToastTrigger message="Auto dismiss" duration={1000} />);
    act(() => { fireEvent.click(screen.getByRole('button', { name: 'trigger' })); });
    expect(screen.getByText('Auto dismiss')).toBeTruthy();
    act(() => { vi.advanceTimersByTime(1000 + 400); });
    expect(screen.queryByText('Auto dismiss')).toBeNull();
  });
});

// ─── Accessibility ────────────────────────────────────────────────────────────

describe('Toast — accessibility', () => {
  it('container has accessible label', async () => {
    renderWithProvider(<ToastTrigger message="A11y" />);
    await userEvent.click(screen.getByRole('button', { name: 'trigger' }));
    await screen.findByText('A11y');
    expect(
      document.querySelector('[aria-label="Notificações"]')
    ).toBeTruthy();
  });

  it('close button has aria-label', async () => {
    renderWithProvider(<ToastTrigger message="Label" />);
    await userEvent.click(screen.getByRole('button', { name: 'trigger' }));
    await screen.findByText('Label');
    expect(screen.getByRole('button', { name: 'Fechar notificação' })).toBeTruthy();
  });

  it('icons have aria-hidden=true', async () => {
    renderWithProvider(<ToastTrigger message="Icon" variant="success" />);
    await userEvent.click(screen.getByRole('button', { name: 'trigger' }));
    await screen.findByText('Icon');
    const icons = document.querySelectorAll('[aria-hidden="true"]');
    expect(icons.length).toBeGreaterThan(0);
  });
});

// ─── Security — XSS via message / title ───────────────────────────────────────
// VULNERABILITY NOTE: message and title are rendered as React text nodes
// ({item.message}, {item.title}), so they are escaped by React. No XSS risk.

describe('Toast — XSS safety', () => {
  it('renders XSS payload in message as plain text', async () => {
    const payload = '<script>window.__toastXss=1</script>';
    renderWithProvider(<ToastTrigger message={payload} />);
    await userEvent.click(screen.getByRole('button', { name: 'trigger' }));
    const alert = await screen.findByRole('alert');
    expect(alert.querySelector('script')).toBeNull();
    expect((window as unknown as Record<string, unknown>).__toastXss).toBeUndefined();
  });

  it('renders img onerror payload in message as plain text', async () => {
    const payload = '<img src=x onerror=alert(1)>';
    renderWithProvider(<ToastTrigger message={payload} />);
    await userEvent.click(screen.getByRole('button', { name: 'trigger' }));
    const alert = await screen.findByRole('alert');
    expect(alert.querySelector('img')).toBeNull();
  });

  it('renders XSS payload in title as plain text', async () => {
    const payload = '<script>window.__toastTitleXss=1</script>';
    renderWithProvider(<ToastTrigger message="Msg" title={payload} variant="info" />);
    await userEvent.click(screen.getByRole('button', { name: 'trigger' }));
    const alert = await screen.findByRole('alert');
    expect(alert.querySelector('script')).toBeNull();
    expect((window as unknown as Record<string, unknown>).__toastTitleXss).toBeUndefined();
  });

  it('renders excessively long message without crashing', async () => {
    const longMsg = 'X'.repeat(50_000);
    renderWithProvider(<ToastTrigger message={longMsg} />);
    await userEvent.click(screen.getByRole('button', { name: 'trigger' }));
    expect(await screen.findByRole('alert')).toBeTruthy();
  });
});
