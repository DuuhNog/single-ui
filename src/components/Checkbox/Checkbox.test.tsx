import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Checkbox } from './Checkbox';

// ─── Rendering ────────────────────────────────────────────────────────────────

describe('Checkbox — rendering', () => {
  it('renders an input of type checkbox', () => {
    render(<Checkbox />);
    expect(screen.getByRole('checkbox')).toBeTruthy();
  });

  it('renders label text when label provided', () => {
    render(<Checkbox label="Aceito os termos" />);
    expect(screen.getByText('Aceito os termos')).toBeTruthy();
  });

  it('renders no label span when label not provided', () => {
    render(<Checkbox />);
    expect(document.querySelector('.single-checkbox-text')).toBeNull();
  });

  it('renders error message', () => {
    render(<Checkbox error="Campo obrigatório" />);
    expect(screen.getByText('Campo obrigatório')).toBeTruthy();
  });

  it('renders helperText when no error', () => {
    render(<Checkbox helperText="Marque para confirmar" />);
    expect(screen.getByText('Marque para confirmar')).toBeTruthy();
  });

  it('does not render helperText when error is present', () => {
    render(<Checkbox error="Erro" helperText="Ajuda" />);
    expect(screen.queryByText('Ajuda')).toBeNull();
  });

  it('associates label with input via htmlFor / id', () => {
    render(<Checkbox label="Opção" />);
    const input = screen.getByRole('checkbox') as HTMLInputElement;
    const label = document.querySelector('label');
    expect(label?.getAttribute('for')).toBe(input.id);
  });

  it('forwards ref to the input element', () => {
    const ref = { current: null as HTMLInputElement | null };
    render(<Checkbox ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  it('passes through arbitrary props to input', () => {
    render(<Checkbox name="agree" value="yes" />);
    const input = screen.getByRole('checkbox') as HTMLInputElement;
    expect(input.name).toBe('agree');
    expect(input.value).toBe('yes');
  });
});

// ─── Checked state ────────────────────────────────────────────────────────────

describe('Checkbox — checked state', () => {
  it('is unchecked by default', () => {
    render(<Checkbox onChange={vi.fn()} />);
    expect(screen.getByRole('checkbox')).not.toBeChecked();
  });

  it('is checked when checked=true', () => {
    render(<Checkbox checked onChange={vi.fn()} />);
    expect(screen.getByRole('checkbox')).toBeChecked();
  });

  it('applies checked class when checked', () => {
    render(<Checkbox checked onChange={vi.fn()} />);
    expect(document.querySelector('.single-checkbox--checked')).toBeTruthy();
  });

  it('renders CheckIcon when checked', () => {
    render(<Checkbox checked onChange={vi.fn()} />);
    expect(document.querySelector('.single-checkbox__check-icon')).toBeTruthy();
  });

  it('calls onChange when clicked', async () => {
    const onChange = vi.fn();
    render(<Checkbox onChange={onChange} />);
    await userEvent.click(screen.getByRole('checkbox'));
    expect(onChange).toHaveBeenCalled();
  });
});

// ─── Indeterminate state ──────────────────────────────────────────────────────

describe('Checkbox — indeterminate', () => {
  it('applies indeterminate class', () => {
    render(<Checkbox indeterminate onChange={vi.fn()} />);
    expect(document.querySelector('.single-checkbox--indeterminate')).toBeTruthy();
  });

  it('has aria-checked="mixed" when indeterminate', () => {
    render(<Checkbox indeterminate onChange={vi.fn()} />);
    expect(
      screen.getByRole('checkbox').getAttribute('aria-checked')
    ).toBe('mixed');
  });

  it('renders IndeterminateIcon instead of CheckIcon', () => {
    render(<Checkbox indeterminate onChange={vi.fn()} />);
    // IndeterminateIcon renders a <line> element; CheckIcon renders a <polyline>
    const icon = document.querySelector('.single-checkbox__check-icon');
    expect(icon?.querySelector('line')).toBeTruthy();
    expect(icon?.querySelector('polyline')).toBeNull();
  });

  it('isChecked is true when indeterminate (wrapper class is applied)', () => {
    render(<Checkbox indeterminate onChange={vi.fn()} />);
    expect(document.querySelector('.single-checkbox--checked')).toBeTruthy();
  });
});

// ─── Disabled state ───────────────────────────────────────────────────────────

describe('Checkbox — disabled', () => {
  it('input is disabled when disabled=true', () => {
    render(<Checkbox disabled />);
    expect(screen.getByRole('checkbox')).toBeDisabled();
  });

  it('applies disabled class to label', () => {
    render(<Checkbox disabled label="Bloqueado" />);
    expect(
      document.querySelector('.single-checkbox-label--disabled')
    ).toBeTruthy();
  });

  it('does not call onChange when disabled and clicked', async () => {
    const onChange = vi.fn();
    render(<Checkbox disabled onChange={onChange} />);
    await userEvent.click(screen.getByRole('checkbox'));
    expect(onChange).not.toHaveBeenCalled();
  });
});

// ─── Accessibility ────────────────────────────────────────────────────────────

describe('Checkbox — accessibility', () => {
  it('has role=checkbox', () => {
    render(<Checkbox />);
    expect(screen.getByRole('checkbox')).toBeTruthy();
  });

  it('is keyboard-accessible (Space toggles)', async () => {
    const onChange = vi.fn();
    render(<Checkbox onChange={onChange} />);
    screen.getByRole('checkbox').focus();
    await userEvent.keyboard(' ');
    expect(onChange).toHaveBeenCalled();
  });

  it('aria-checked=true when checked', () => {
    render(<Checkbox checked onChange={vi.fn()} />);
    expect(screen.getByRole('checkbox').getAttribute('aria-checked')).toBe('true');
  });

  it('aria-checked=false when unchecked', () => {
    render(<Checkbox checked={false} onChange={vi.fn()} />);
    expect(screen.getByRole('checkbox').getAttribute('aria-checked')).toBe('false');
  });
});

// ─── Security — XSS via label ─────────────────────────────────────────────────
// VULNERABILITY NOTE: label is rendered as a React text node, not innerHTML.
// React escapes strings, so no XSS is possible through the label prop.

describe('Checkbox — XSS safety', () => {
  it('renders XSS payload in label as plain text', () => {
    const payload = '<script>window.__checkboxXss=1</script>';
    render(<Checkbox label={payload} />);
    const labelEl = document.querySelector('.single-checkbox-text');
    expect(labelEl?.querySelector('script')).toBeNull();
    expect(labelEl?.textContent).toBe(payload);
    expect((window as unknown as Record<string, unknown>).__checkboxXss).toBeUndefined();
  });

  it('renders img onerror payload in label as plain text', () => {
    const payload = '<img src=x onerror=alert(1)>';
    render(<Checkbox label={payload} />);
    const labelEl = document.querySelector('.single-checkbox-text');
    expect(labelEl?.querySelector('img')).toBeNull();
  });

  it('renders excessively long label without crashing', () => {
    render(<Checkbox label={'A'.repeat(10_000)} />);
    expect(screen.getByRole('checkbox')).toBeTruthy();
  });

  it('renders null-byte in label without crashing', () => {
    render(<Checkbox label={'\u0000\u0000'} />);
    expect(screen.getByRole('checkbox')).toBeTruthy();
  });
});
