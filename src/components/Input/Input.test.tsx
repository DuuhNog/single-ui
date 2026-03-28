import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Input } from './Input';
import { maskCurrencyBRL, maskCurrencyUSD } from '../../hooks/useMask';

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
