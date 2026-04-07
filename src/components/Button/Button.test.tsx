import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from './Button';

// ─── Rendering ────────────────────────────────────────────────────────────────

describe('Button — rendering', () => {
  it('renders children text', () => {
    render(<Button>Salvar</Button>);
    expect(screen.getByRole('button', { name: 'Salvar' })).toBeTruthy();
  });

  it('defaults to variant primary', () => {
    render(<Button>Ok</Button>);
    expect(screen.getByRole('button').className).toContain('single-button--primary');
  });

  it('defaults to size md', () => {
    render(<Button>Ok</Button>);
    expect(screen.getByRole('button').className).toContain('single-button--md');
  });

  it.each(['primary', 'secondary', 'success', 'warning', 'error', 'info'] as const)(
    'applies variant class: %s',
    (variant) => {
      render(<Button variant={variant}>X</Button>);
      expect(screen.getByRole('button').className).toContain(`single-button--${variant}`);
    }
  );

  it.each(['sm', 'md', 'lg'] as const)('applies size class: %s', (size) => {
    render(<Button size={size}>X</Button>);
    expect(screen.getByRole('button').className).toContain(`single-button--${size}`);
  });

  it('applies fullWidth class when fullWidth=true', () => {
    render(<Button fullWidth>X</Button>);
    expect(screen.getByRole('button').className).toContain('single-button--full-width');
  });

  it('does not apply fullWidth class by default', () => {
    render(<Button>X</Button>);
    expect(screen.getByRole('button').className).not.toContain('full-width');
  });

  it('merges custom className', () => {
    render(<Button className="my-class">X</Button>);
    expect(screen.getByRole('button').className).toContain('my-class');
  });

  it('forwards ref to underlying button element', () => {
    const ref = { current: null as HTMLButtonElement | null };
    render(<Button ref={ref}>X</Button>);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });

  it('passes through arbitrary HTML attributes', () => {
    render(<Button data-testid="btn-custom" aria-describedby="desc">X</Button>);
    const btn = screen.getByTestId('btn-custom');
    expect(btn.getAttribute('aria-describedby')).toBe('desc');
  });
});

// ─── Loading state ────────────────────────────────────────────────────────────

describe('Button — loading state', () => {
  it('renders spinner when loading=true', () => {
    render(<Button loading>Aguarde</Button>);
    expect(document.querySelector('.single-button__spinner')).toBeTruthy();
  });

  it('spinner has aria-hidden=true', () => {
    render(<Button loading>X</Button>);
    const spinner = document.querySelector('.single-button__spinner');
    expect(spinner?.getAttribute('aria-hidden')).toBe('true');
  });

  it('is disabled when loading=true', () => {
    render(<Button loading>X</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('applies loading class when loading=true', () => {
    render(<Button loading>X</Button>);
    expect(screen.getByRole('button').className).toContain('single-button--loading');
  });

  it('hides icon while loading', () => {
    const icon = <span data-testid="icon">★</span>;
    render(<Button loading icon={icon}>X</Button>);
    expect(screen.queryByTestId('icon')).toBeNull();
  });

  it('does not render spinner when loading=false', () => {
    render(<Button>X</Button>);
    expect(document.querySelector('.single-button__spinner')).toBeNull();
  });
});

// ─── Disabled state ───────────────────────────────────────────────────────────

describe('Button — disabled state', () => {
  it('is disabled when disabled=true', () => {
    render(<Button disabled>X</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('does not fire onClick when disabled', async () => {
    const onClick = vi.fn();
    render(<Button disabled onClick={onClick}>X</Button>);
    await userEvent.click(screen.getByRole('button'));
    expect(onClick).not.toHaveBeenCalled();
  });

  it('does not fire onClick when loading', async () => {
    const onClick = vi.fn();
    render(<Button loading onClick={onClick}>X</Button>);
    await userEvent.click(screen.getByRole('button'));
    expect(onClick).not.toHaveBeenCalled();
  });
});

// ─── Icon placement ───────────────────────────────────────────────────────────

describe('Button — icon placement', () => {
  it('renders icon on the left by default', () => {
    const icon = <span data-testid="icon">★</span>;
    render(<Button icon={icon}>Label</Button>);
    const btn = screen.getByRole('button');
    const children = Array.from(btn.querySelectorAll('span'));
    const iconSpan = children.find(el => el.querySelector('[data-testid="icon"]'));
    const labelSpan = children.find(el => el.textContent === 'Label');
    expect(iconSpan).toBeTruthy();
    expect(labelSpan).toBeTruthy();
    // icon span should appear before label span in DOM order
    if (iconSpan && labelSpan) {
      expect(
        iconSpan.compareDocumentPosition(labelSpan) & Node.DOCUMENT_POSITION_FOLLOWING
      ).toBeTruthy();
    }
  });

  it('renders icon on the right when iconPosition=right', () => {
    const icon = <span data-testid="icon">★</span>;
    render(<Button icon={icon} iconPosition="right">Label</Button>);
    const btn = screen.getByRole('button');
    const iconSpan = btn.querySelector('.single-button__icon');
    const labelSpan = Array.from(btn.querySelectorAll('span')).find(
      el => el.textContent === 'Label'
    );
    expect(iconSpan).toBeTruthy();
    expect(labelSpan).toBeTruthy();
    if (iconSpan && labelSpan) {
      // label span should precede icon span
      expect(
        labelSpan.compareDocumentPosition(iconSpan) & Node.DOCUMENT_POSITION_FOLLOWING
      ).toBeTruthy();
    }
  });
});

// ─── Click behavior ───────────────────────────────────────────────────────────

describe('Button — click behavior', () => {
  it('fires onClick when clicked', async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Click me</Button>);
    await userEvent.click(screen.getByRole('button', { name: 'Click me' }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('fires onClick multiple times on multiple clicks', async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>X</Button>);
    await userEvent.click(screen.getByRole('button'));
    await userEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledTimes(2);
  });

  it('is activatable via keyboard Enter', async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>X</Button>);
    screen.getByRole('button').focus();
    await userEvent.keyboard('{Enter}');
    expect(onClick).toHaveBeenCalled();
  });

  it('is activatable via keyboard Space', async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>X</Button>);
    screen.getByRole('button').focus();
    await userEvent.keyboard(' ');
    expect(onClick).toHaveBeenCalled();
  });
});

// ─── Accessibility ────────────────────────────────────────────────────────────

describe('Button — accessibility', () => {
  it('has role=button', () => {
    render(<Button>X</Button>);
    expect(screen.getByRole('button')).toBeTruthy();
  });

  it('is focusable by default', () => {
    render(<Button>X</Button>);
    const btn = screen.getByRole('button');
    btn.focus();
    expect(document.activeElement).toBe(btn);
  });

  it('is not focusable when disabled', () => {
    render(<Button disabled>X</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('accepts aria-label for icon-only buttons', () => {
    render(<Button aria-label="Fechar janela">✕</Button>);
    expect(screen.getByRole('button', { name: 'Fechar janela' })).toBeTruthy();
  });
});

// ─── Security — XSS ───────────────────────────────────────────────────────────
// CONTEXT: Button children are rendered as React nodes (not dangerouslySetInnerHTML),
// so React escapes malicious strings. These tests verify that behaviour.

describe('Button — XSS safety', () => {
  it('renders XSS payload as escaped text, not executing script', () => {
    render(<Button>{'<script>window.__xss=1</script>'}</Button>);
    // The button text should be the literal string, no script tag in DOM
    const btn = screen.getByRole('button');
    expect(btn.innerHTML).not.toContain('<script>');
    expect((window as unknown as Record<string, unknown>).__xss).toBeUndefined();
  });

  it('renders img onerror payload as escaped text', () => {
    render(<Button>{'<img src=x onerror=alert(1)>'}</Button>);
    const btn = screen.getByRole('button');
    // No actual <img> element should be in the DOM inside button
    expect(btn.querySelector('img')).toBeNull();
  });

  it('renders javascript: URI as plain text', () => {
    render(<Button>{'javascript:alert(1)'}</Button>);
    // text is present but not evaluated
    expect(screen.getByRole('button').textContent).toContain('javascript:alert(1)');
  });
});
