import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Input } from './Input';
import {
  maskCurrencyBRL,
  maskCurrencyUSD,
  maskCPF,
  maskCNPJ,
  maskPhone,
  maskCEP,
  maskDate,
} from '../../hooks/useMask';

// ─── maskCurrencyBRL ──────────────────────────────────────────────────────────
describe('maskCurrencyBRL', () => {
  it('returns R$ 0,00 for empty string', () => {
    expect(maskCurrencyBRL('')).toBe('R$\u00a00,00');
  });

  it('returns R$ 0,00 for non-numeric input', () => {
    expect(maskCurrencyBRL('abc')).toBe('R$\u00a00,00');
  });

  it('formats digits as cents (100 → R$ 1,00)', () => {
    expect(maskCurrencyBRL('100')).toBe('R$\u00a01,00');
  });

  it('formats 12345 → R$ 123,45', () => {
    expect(maskCurrencyBRL('12345')).toBe('R$\u00a0123,45');
  });
});

// ─── maskCurrencyUSD ──────────────────────────────────────────────────────────
describe('maskCurrencyUSD', () => {
  it('returns $0.00 for empty string', () => {
    expect(maskCurrencyUSD('')).toBe('$0.00');
  });

  it('returns $0.00 for non-numeric input', () => {
    expect(maskCurrencyUSD('abc')).toBe('$0.00');
  });

  it('formats 100 → $1.00', () => {
    expect(maskCurrencyUSD('100')).toBe('$1.00');
  });

  it('formats 12345 → $123.45', () => {
    expect(maskCurrencyUSD('12345')).toBe('$123.45');
  });
});

// ─── Input component with currency mask ──────────────────────────────────────
describe('Input currency-brl mask', () => {
  it('renders R$ 0,00 on initial render with no value', () => {
    render(<Input mask="currency-brl" />);
    const input = screen.getByRole('textbox') as HTMLInputElement;
    expect(input.value).toBe('R$\u00a00,00');
    expect(input.value).not.toContain('NaN');
  });

  it('renders R$ 0,00 on initial render with empty defaultValue', () => {
    render(<Input mask="currency-brl" defaultValue="" />);
    const input = screen.getByRole('textbox') as HTMLInputElement;
    expect(input.value).not.toContain('NaN');
  });

  it('formats typed digits as currency', async () => {
    const user = userEvent.setup();
    render(<Input mask="currency-brl" />);
    const input = screen.getByRole('textbox');
    await user.type(input, '1');
    expect((input as HTMLInputElement).value).not.toContain('NaN');
  });
});

describe('Input currency-usd mask', () => {
  it('renders $0.00 on initial render with no value', () => {
    render(<Input mask="currency-usd" />);
    const input = screen.getByRole('textbox') as HTMLInputElement;
    expect(input.value).toBe('$0.00');
    expect(input.value).not.toContain('NaN');
  });
});

// ─── maskCPF ──────────────────────────────────────────────────────────────────

describe('maskCPF', () => {
  it('formats 11 digits: 12345678901 → 123.456.789-01', () => {
    expect(maskCPF('12345678901')).toBe('123.456.789-01');
  });

  it('strips non-digits before formatting', () => {
    expect(maskCPF('123.456.789-01')).toBe('123.456.789-01');
  });

  it('truncates to 14 chars (formatted)', () => {
    const result = maskCPF('123456789012345');
    expect(result.length).toBeLessThanOrEqual(14);
  });

  it('returns partial mask for partial input (7 digits)', () => {
    expect(maskCPF('1234567')).toBe('123.456.7');
  });

  it('returns empty string for empty input', () => {
    expect(maskCPF('')).toBe('');
  });
});

// ─── maskCNPJ ─────────────────────────────────────────────────────────────────

describe('maskCNPJ', () => {
  it('formats 14 digits: 12345678000190 → 12.345.678/0001-90', () => {
    expect(maskCNPJ('12345678000190')).toBe('12.345.678/0001-90');
  });

  it('strips non-digits before formatting', () => {
    expect(maskCNPJ('12.345.678/0001-90')).toBe('12.345.678/0001-90');
  });

  it('truncates to 18 chars (formatted)', () => {
    const result = maskCNPJ('1'.repeat(20));
    expect(result.length).toBeLessThanOrEqual(18);
  });

  it('returns empty string for empty input', () => {
    expect(maskCNPJ('')).toBe('');
  });
});

// ─── maskPhone ────────────────────────────────────────────────────────────────

describe('maskPhone', () => {
  it('formats 10-digit landline: 1134567890 → (11) 3456-7890', () => {
    expect(maskPhone('1134567890')).toBe('(11) 3456-7890');
  });

  it('formats 11-digit mobile: 11987654321 → (11) 98765-4321', () => {
    expect(maskPhone('11987654321')).toBe('(11) 98765-4321');
  });

  it('strips non-digits before formatting', () => {
    expect(maskPhone('(11) 98765-4321')).toBe('(11) 98765-4321');
  });

  it('truncates to 15 chars (formatted mobile)', () => {
    const result = maskPhone('1'.repeat(20));
    expect(result.length).toBeLessThanOrEqual(15);
  });

  it('returns empty string for empty input', () => {
    expect(maskPhone('')).toBe('');
  });
});

// ─── maskCEP ──────────────────────────────────────────────────────────────────

describe('maskCEP', () => {
  it('formats 8 digits: 01310100 → 01310-100', () => {
    expect(maskCEP('01310100')).toBe('01310-100');
  });

  it('strips non-digits before formatting', () => {
    expect(maskCEP('01310-100')).toBe('01310-100');
  });

  it('truncates to 9 chars (formatted)', () => {
    const result = maskCEP('1'.repeat(20));
    expect(result.length).toBeLessThanOrEqual(9);
  });

  it('returns empty string for empty input', () => {
    expect(maskCEP('')).toBe('');
  });
});

// ─── maskDate ─────────────────────────────────────────────────────────────────

describe('maskDate', () => {
  it('formats 8 digits: 25122024 → 25/12/2024', () => {
    expect(maskDate('25122024')).toBe('25/12/2024');
  });

  it('strips non-digits before formatting', () => {
    expect(maskDate('25/12/2024')).toBe('25/12/2024');
  });

  it('truncates to 10 chars (formatted)', () => {
    const result = maskDate('1'.repeat(20));
    expect(result.length).toBeLessThanOrEqual(10);
  });

  it('returns empty string for empty input', () => {
    expect(maskDate('')).toBe('');
  });
});

// ─── Input component — rendering ──────────────────────────────────────────────

describe('Input — rendering', () => {
  it('renders a text input by default', () => {
    render(<Input />);
    expect(screen.getByRole('textbox')).toBeTruthy();
  });

  it('renders label when provided', () => {
    render(<Input label="Nome" />);
    expect(screen.getByText('Nome')).toBeTruthy();
  });

  it('renders required asterisk when required=true', () => {
    render(<Input label="Nome" required />);
    expect(document.querySelector('.single-input-label__required')).toBeTruthy();
  });

  it('renders error message', () => {
    render(<Input error="Campo inválido" />);
    expect(screen.getByText('Campo inválido')).toBeTruthy();
  });

  it('renders helperText when no error', () => {
    render(<Input helperText="Digite seu nome" />);
    expect(screen.getByText('Digite seu nome')).toBeTruthy();
  });

  it('does not render helperText when error is present', () => {
    render(<Input error="Erro" helperText="Ajuda" />);
    expect(screen.queryByText('Ajuda')).toBeNull();
  });

  it('is disabled when disabled=true', () => {
    render(<Input disabled />);
    expect(screen.getByRole('textbox')).toBeDisabled();
  });

  it('applies fullWidth class when fullWidth=true', () => {
    render(<Input fullWidth />);
    expect(document.querySelector('.single-input-wrapper--full-width')).toBeTruthy();
  });

  it('applies error class when error provided', () => {
    render(<Input error="Erro" />);
    expect(document.querySelector('.single-input--error')).toBeTruthy();
  });

  it('applies disabled wrapper class when disabled', () => {
    render(<Input disabled />);
    expect(document.querySelector('.single-input-wrapper--disabled')).toBeTruthy();
  });

  it('forwards ref to input element', () => {
    const ref = { current: null as HTMLInputElement | null };
    render(<Input ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });
});

// ─── Input component — password type ─────────────────────────────────────────

describe('Input — password type', () => {
  it('renders input type=password by default for type="password"', () => {
    render(<Input type="password" />);
    const input = document.querySelector('input') as HTMLInputElement;
    expect(input.type).toBe('password');
  });

  it('renders toggle button with aria-label "Mostrar senha"', () => {
    render(<Input type="password" />);
    expect(screen.getByRole('button', { name: 'Mostrar senha' })).toBeTruthy();
  });

  it('toggles to text type after clicking show button', async () => {
    render(<Input type="password" />);
    await userEvent.click(screen.getByRole('button', { name: 'Mostrar senha' }));
    const input = document.querySelector('input') as HTMLInputElement;
    expect(input.type).toBe('text');
  });

  it('toggle button label becomes "Ocultar senha" after reveal', async () => {
    render(<Input type="password" />);
    await userEvent.click(screen.getByRole('button', { name: 'Mostrar senha' }));
    expect(screen.getByRole('button', { name: 'Ocultar senha' })).toBeTruthy();
  });

  it('toggle button is disabled when input is disabled', () => {
    render(<Input type="password" disabled />);
    expect(screen.getByRole('button', { name: 'Mostrar senha' })).toBeDisabled();
  });
});

// ─── Input component — onChange callback ─────────────────────────────────────

describe('Input — onChange callback', () => {
  it('calls onChange with raw (unmasked) numeric value for CPF mask', async () => {
    const onChange = vi.fn();
    render(<Input mask="cpf" onChange={onChange} />);
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: '12345678901' } });
    // The cleaned value passed to onChange should be numeric digits only
    expect(onChange).toHaveBeenCalledWith('12345678901', expect.any(Object));
  });

  it('calls onChange with numeric digits for phone mask', async () => {
    const onChange = vi.fn();
    render(<Input mask="phone" onChange={onChange} />);
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: '11987654321' } });
    expect(onChange).toHaveBeenCalledWith('11987654321', expect.any(Object));
  });

  it('calls onChange with plain value when no mask', () => {
    const onChange = vi.fn();
    render(<Input onChange={onChange} />);
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'hello' } });
    expect(onChange).toHaveBeenCalledWith('hello', expect.any(Object));
  });
});

// ─── Input component — mask display ──────────────────────────────────────────

describe('Input — mask display value', () => {
  it('displays CPF-formatted value', () => {
    render(<Input mask="cpf" value="12345678901" onChange={vi.fn()} />);
    expect((screen.getByRole('textbox') as HTMLInputElement).value).toBe('123.456.789-01');
  });

  it('displays CNPJ-formatted value', () => {
    render(<Input mask="cnpj" value="12345678000190" onChange={vi.fn()} />);
    expect((screen.getByRole('textbox') as HTMLInputElement).value).toBe('12.345.678/0001-90');
  });

  it('displays phone-formatted value (mobile)', () => {
    render(<Input mask="phone" value="11987654321" onChange={vi.fn()} />);
    expect((screen.getByRole('textbox') as HTMLInputElement).value).toBe('(11) 98765-4321');
  });

  it('displays CEP-formatted value', () => {
    render(<Input mask="cep" value="01310100" onChange={vi.fn()} />);
    expect((screen.getByRole('textbox') as HTMLInputElement).value).toBe('01310-100');
  });

  it('displays date-formatted value', () => {
    render(<Input mask="date" value="25122024" onChange={vi.fn()} />);
    expect((screen.getByRole('textbox') as HTMLInputElement).value).toBe('25/12/2024');
  });
});

// ─── Input — mask blocks invalid chars (business rule) ───────────────────────
// The onChange handler strips non-digit characters from masked inputs before
// reporting the value to the caller — acting as a real-time filter.

describe('Input — mask filters non-numeric input', () => {
  it('CPF mask strips letters from onChange value', () => {
    const onChange = vi.fn();
    render(<Input mask="cpf" onChange={onChange} />);
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'abc123' } });
    expect(onChange).toHaveBeenCalledWith('123', expect.any(Object));
  });

  it('CEP mask strips special chars from onChange value', () => {
    const onChange = vi.fn();
    render(<Input mask="cep" onChange={onChange} />);
    fireEvent.change(screen.getByRole('textbox'), { target: { value: '!@#01310' } });
    expect(onChange).toHaveBeenCalledWith('01310', expect.any(Object));
  });

  it('CPF mask limits to 11 digits', () => {
    const onChange = vi.fn();
    render(<Input mask="cpf" onChange={onChange} />);
    fireEvent.change(screen.getByRole('textbox'), { target: { value: '123456789012' } });
    const called = onChange.mock.calls[0][0] as string;
    expect(called.length).toBeLessThanOrEqual(11);
  });

  it('CNPJ mask limits to 14 digits', () => {
    const onChange = vi.fn();
    render(<Input mask="cnpj" onChange={onChange} />);
    fireEvent.change(screen.getByRole('textbox'), { target: { value: '123456789012345' } });
    const called = onChange.mock.calls[0][0] as string;
    expect(called.length).toBeLessThanOrEqual(14);
  });

  it('Phone mask limits to 11 digits', () => {
    const onChange = vi.fn();
    render(<Input mask="phone" onChange={onChange} />);
    fireEvent.change(screen.getByRole('textbox'), { target: { value: '119876543210' } });
    const called = onChange.mock.calls[0][0] as string;
    expect(called.length).toBeLessThanOrEqual(11);
  });

  it('CEP mask limits to 8 digits', () => {
    const onChange = vi.fn();
    render(<Input mask="cep" onChange={onChange} />);
    fireEvent.change(screen.getByRole('textbox'), { target: { value: '123456789' } });
    const called = onChange.mock.calls[0][0] as string;
    expect(called.length).toBeLessThanOrEqual(8);
  });

  it('Date mask limits to 8 digits', () => {
    const onChange = vi.fn();
    render(<Input mask="date" onChange={onChange} />);
    fireEvent.change(screen.getByRole('textbox'), { target: { value: '251220241' } });
    const called = onChange.mock.calls[0][0] as string;
    expect(called.length).toBeLessThanOrEqual(8);
  });
});

// ─── Security — XSS via Input ─────────────────────────────────────────────────
// VULNERABILITY NOTE: Input renders `label`, `error`, `helperText` as React text
// nodes and passes `displayValue` as the `value` attribute of <input>, which React
// always escapes. No XSS vector exists in the Input component itself.
// ⚠️  The `onChange` callback emits the raw string to the parent. If the parent
// inserts this value into `dangerouslySetInnerHTML` without sanitisation, XSS is
// possible at the application level — but that is outside the component's scope.

describe('Input — XSS safety', () => {
  it('renders XSS payload in label as plain text', () => {
    const payload = '<script>window.__inputLabelXss=1</script>';
    render(<Input label={payload} />);
    const labelEl = document.querySelector('.single-input-label');
    expect(labelEl?.querySelector('script')).toBeNull();
    expect((window as unknown as Record<string, unknown>).__inputLabelXss).toBeUndefined();
  });

  it('renders XSS payload in error as plain text', () => {
    const payload = '<img src=x onerror=alert(1)>';
    render(<Input error={payload} />);
    const errorEl = document.querySelector('.single-input-error');
    expect(errorEl?.querySelector('img')).toBeNull();
    expect(errorEl?.textContent).toBe(payload);
  });

  it('renders XSS payload in helperText as plain text', () => {
    const payload = '<script>window.__helperXss=1</script>';
    render(<Input helperText={payload} />);
    const helperEl = document.querySelector('.single-input-helper');
    expect(helperEl?.querySelector('script')).toBeNull();
    expect((window as unknown as Record<string, unknown>).__helperXss).toBeUndefined();
  });

  it('input value attribute is never treated as HTML', () => {
    const payload = '<script>window.__inputValXss=1</script>';
    render(<Input value={payload} onChange={vi.fn()} />);
    const input = screen.getByRole('textbox') as HTMLInputElement;
    // value must be the raw string, not executed as HTML
    expect(input.value).toBe(payload);
    expect((window as unknown as Record<string, unknown>).__inputValXss).toBeUndefined();
  });
});

// ─── Security — SQL Injection patterns in Input ───────────────────────────────
// SQL injection is a backend concern; the frontend should NOT alter or reject
// SQL-like strings (that would break legitimate inputs like passwords).
// These tests verify the component remains stable and passes values through
// unchanged — sanitisation must happen server-side.

describe('Input — SQL injection resilience', () => {
  it("passes through ' OR '1'='1 unchanged (no mask)", () => {
    const onChange = vi.fn();
    render(<Input onChange={onChange} />);
    fireEvent.change(screen.getByRole('textbox'), { target: { value: "' OR '1'='1" } });
    expect(onChange).toHaveBeenCalledWith("' OR '1'='1", expect.any(Object));
  });

  it('passes through 1; DROP TABLE users; -- unchanged', () => {
    const onChange = vi.fn();
    render(<Input onChange={onChange} />);
    fireEvent.change(screen.getByRole('textbox'), { target: { value: '1; DROP TABLE users; --' } });
    expect(onChange).toHaveBeenCalledWith('1; DROP TABLE users; --', expect.any(Object));
  });

  it('strips SQL-like chars to digits when CPF mask applied', () => {
    // A CPF mask strips all non-digits — SQL injection is blocked as a side-effect
    const onChange = vi.fn();
    render(<Input mask="cpf" onChange={onChange} />);
    fireEvent.change(screen.getByRole('textbox'), { target: { value: "' OR 1=1 --" } });
    // All non-digits stripped; result should be empty or only digits
    const value = onChange.mock.calls[0][0] as string;
    expect(/^\d*$/.test(value)).toBe(true);
  });
});

// ─── Security — Malicious payload / boundary tests ───────────────────────────

describe('Input — malicious payload / boundary tests', () => {
  it('handles null-byte character without crashing', () => {
    render(<Input value={'\u0000'} onChange={vi.fn()} />);
    expect(screen.getByRole('textbox')).toBeTruthy();
  });

  it('handles excessively long string without crashing (10k chars)', () => {
    const longValue = 'A'.repeat(10_000);
    render(<Input value={longValue} onChange={vi.fn()} />);
    expect(screen.getByRole('textbox')).toBeTruthy();
  });

  it('handles only emoji input without crashing', () => {
    render(<Input value={'😀'.repeat(500)} onChange={vi.fn()} />);
    expect(screen.getByRole('textbox')).toBeTruthy();
  });

  it('CPF mask handles non-ASCII input gracefully (strips to empty)', () => {
    const onChange = vi.fn();
    render(<Input mask="cpf" onChange={onChange} />);
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'áéíóú' } });
    // Non-ASCII are stripped by \D regex
    expect(onChange).toHaveBeenCalledWith('', expect.any(Object));
  });

  it('handles unicode directional override characters without crashing', () => {
    // U+202E RIGHT-TO-LEFT OVERRIDE — used in some spoofing attacks
    render(<Input value={'\u202Etest'} onChange={vi.fn()} />);
    expect(screen.getByRole('textbox')).toBeTruthy();
  });

  it('handles zero-width characters without crashing', () => {
    render(<Input value={'\u200B\u200C\u200D\uFEFF'} onChange={vi.fn()} />);
    expect(screen.getByRole('textbox')).toBeTruthy();
  });
});
