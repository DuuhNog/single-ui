import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Select } from './Select';
import type { SelectOption } from './Select';

// ─── Fixtures ─────────────────────────────────────────────────────────────────

const options: SelectOption[] = [
  { value: 'br', label: 'Brasil' },
  { value: 'us', label: 'Estados Unidos' },
  { value: 'de', label: 'Alemanha' },
  { value: 'disabled-opt', label: 'Desabilitada', disabled: true },
];

// ─── Rendering ────────────────────────────────────────────────────────────────

describe('Select — rendering', () => {
  it('renders trigger with placeholder by default', () => {
    render(<Select options={options} />);
    expect(screen.getByText('Selecione...')).toBeTruthy();
  });

  it('renders custom placeholder', () => {
    render(<Select options={options} placeholder="Escolha um país" />);
    expect(screen.getByText('Escolha um país')).toBeTruthy();
  });

  it('renders label when provided', () => {
    render(<Select options={options} label="País" />);
    expect(screen.getByText('País')).toBeTruthy();
  });

  it('renders error message', () => {
    render(<Select options={options} error="Campo obrigatório" />);
    expect(screen.getByText('Campo obrigatório')).toBeTruthy();
  });

  it('renders helperText when no error', () => {
    render(<Select options={options} helperText="Selecione seu país" />);
    expect(screen.getByText('Selecione seu país')).toBeTruthy();
  });

  it('does not render helperText when error is present', () => {
    render(<Select options={options} error="Erro" helperText="Ajuda" />);
    expect(screen.queryByText('Ajuda')).toBeNull();
  });

  it('trigger has role=combobox', () => {
    render(<Select options={options} />);
    expect(screen.getByRole('combobox')).toBeTruthy();
  });

  it('combobox is not expanded by default', () => {
    render(<Select options={options} />);
    expect(screen.getByRole('combobox').getAttribute('aria-expanded')).toBe('false');
  });

  it('applies disabled wrapper class when disabled', () => {
    render(<Select options={options} disabled />);
    expect(
      document.querySelector('.single-select-wrapper--disabled')
    ).toBeTruthy();
  });

  it('applies error wrapper class when error present', () => {
    render(<Select options={options} error="Erro" />);
    expect(
      document.querySelector('.single-select-wrapper--error')
    ).toBeTruthy();
  });
});

// ─── Open / Close ─────────────────────────────────────────────────────────────

describe('Select — open/close', () => {
  it('opens dropdown when trigger is clicked', async () => {
    render(<Select options={options} />);
    await userEvent.click(screen.getByRole('combobox'));
    expect(screen.getByRole('listbox')).toBeTruthy();
  });

  it('lists all options after open', async () => {
    render(<Select options={options} />);
    await userEvent.click(screen.getByRole('combobox'));
    expect(screen.getByRole('option', { name: 'Brasil' })).toBeTruthy();
    expect(screen.getByRole('option', { name: 'Alemanha' })).toBeTruthy();
    expect(screen.getByRole('option', { name: 'Desabilitada' })).toBeTruthy();
  });

  it('closes dropdown when clicking outside', async () => {
    render(
      <div>
        <Select options={options} />
        <button data-testid="outside">Outside</button>
      </div>
    );
    await userEvent.click(screen.getByRole('combobox'));
    expect(screen.getByRole('listbox')).toBeTruthy();
    fireEvent.mouseDown(screen.getByTestId('outside'));
    expect(screen.queryByRole('listbox')).toBeNull();
  });

  it('does not open when disabled', async () => {
    render(<Select options={options} disabled />);
    await userEvent.click(screen.getByRole('combobox'));
    expect(screen.queryByRole('listbox')).toBeNull();
  });

  it('aria-expanded becomes true when open', async () => {
    render(<Select options={options} />);
    await userEvent.click(screen.getByRole('combobox'));
    expect(screen.getByRole('combobox').getAttribute('aria-expanded')).toBe('true');
  });
});

// ─── Single selection ─────────────────────────────────────────────────────────

describe('Select — single selection', () => {
  it('shows selected option label on trigger after selection', async () => {
    render(<Select options={options} />);
    await userEvent.click(screen.getByRole('combobox'));
    await userEvent.click(screen.getByRole('option', { name: 'Brasil' }));
    expect(screen.getByText('Brasil')).toBeTruthy();
  });

  it('calls onChange with selected value', async () => {
    const onChange = vi.fn();
    render(<Select options={options} onChange={onChange} />);
    await userEvent.click(screen.getByRole('combobox'));
    await userEvent.click(screen.getByRole('option', { name: 'Brasil' }));
    expect(onChange).toHaveBeenCalledWith('br');
  });

  it('closes after single selection', async () => {
    render(<Select options={options} />);
    await userEvent.click(screen.getByRole('combobox'));
    await userEvent.click(screen.getByRole('option', { name: 'Brasil' }));
    expect(screen.queryByRole('listbox')).toBeNull();
  });

  it('does not call onChange for disabled option', async () => {
    const onChange = vi.fn();
    render(<Select options={options} onChange={onChange} />);
    await userEvent.click(screen.getByRole('combobox'));
    await userEvent.click(screen.getByRole('option', { name: 'Desabilitada' }));
    expect(onChange).not.toHaveBeenCalled();
  });

  it('reflects controlled value', () => {
    render(<Select options={options} value="de" />);
    expect(screen.getByText('Alemanha')).toBeTruthy();
  });

  it('selected option has aria-selected=true', async () => {
    render(<Select options={options} value="br" />);
    await userEvent.click(screen.getByRole('combobox'));
    expect(
      screen.getByRole('option', { name: 'Brasil' }).getAttribute('aria-selected')
    ).toBe('true');
  });

  it('non-selected option has aria-selected=false', async () => {
    render(<Select options={options} value="br" />);
    await userEvent.click(screen.getByRole('combobox'));
    expect(
      screen.getByRole('option', { name: 'Alemanha' }).getAttribute('aria-selected')
    ).toBe('false');
  });
});

// ─── Clearable ────────────────────────────────────────────────────────────────

describe('Select — clearable', () => {
  it('shows clear button when clearable and value selected', async () => {
    render(<Select options={options} clearable defaultValue="br" />);
    expect(screen.getByRole('button', { name: 'Limpar' })).toBeTruthy();
  });

  it('does not show clear button when no value', () => {
    render(<Select options={options} clearable />);
    expect(screen.queryByRole('button', { name: 'Limpar' })).toBeNull();
  });

  it('calls onChange(null) when cleared (single)', async () => {
    const onChange = vi.fn();
    render(<Select options={options} clearable value="br" onChange={onChange} />);
    await userEvent.click(screen.getByRole('button', { name: 'Limpar' }));
    expect(onChange).toHaveBeenCalledWith(null);
  });

  it('resets to placeholder after clearing', async () => {
    render(<Select options={options} clearable defaultValue="br" />);
    await userEvent.click(screen.getByRole('button', { name: 'Limpar' }));
    expect(screen.getByText('Selecione...')).toBeTruthy();
  });
});

// ─── Searchable ───────────────────────────────────────────────────────────────

describe('Select — searchable', () => {
  it('shows search input when searchable=true and open', async () => {
    render(<Select options={options} searchable />);
    await userEvent.click(screen.getByRole('combobox'));
    expect(screen.getByPlaceholderText('Buscar...')).toBeTruthy();
  });

  it('filters options by search term', async () => {
    render(<Select options={options} searchable />);
    await userEvent.click(screen.getByRole('combobox'));
    await userEvent.type(screen.getByPlaceholderText('Buscar...'), 'bras');
    expect(screen.getByRole('option', { name: 'Brasil' })).toBeTruthy();
    expect(screen.queryByRole('option', { name: 'Alemanha' })).toBeNull();
  });

  it('shows "Nenhuma opção encontrada" when no match', async () => {
    render(<Select options={options} searchable />);
    await userEvent.click(screen.getByRole('combobox'));
    await userEvent.type(screen.getByPlaceholderText('Buscar...'), 'zzzzz');
    expect(screen.getByText('Nenhuma opção encontrada')).toBeTruthy();
  });

  it('search is case-insensitive', async () => {
    render(<Select options={options} searchable />);
    await userEvent.click(screen.getByRole('combobox'));
    await userEvent.type(screen.getByPlaceholderText('Buscar...'), 'BRAS');
    expect(screen.getByRole('option', { name: 'Brasil' })).toBeTruthy();
  });
});

// ─── Multiple selection ───────────────────────────────────────────────────────

describe('Select — multiple', () => {
  it('keeps dropdown open after selection in multiple mode', async () => {
    render(<Select options={options} multiple />);
    await userEvent.click(screen.getByRole('combobox'));
    await userEvent.click(screen.getByRole('option', { name: 'Brasil' }));
    expect(screen.getByRole('listbox')).toBeTruthy();
  });

  it('shows chips for selected options', async () => {
    render(<Select options={options} multiple defaultValue={['br', 'de']} />);
    expect(screen.getByText('Brasil')).toBeTruthy();
    expect(screen.getByText('Alemanha')).toBeTruthy();
  });

  it('calls onChange with array of values', async () => {
    const onChange = vi.fn();
    render(<Select options={options} multiple onChange={onChange} />);
    await userEvent.click(screen.getByRole('combobox'));
    await userEvent.click(screen.getByRole('option', { name: 'Brasil' }));
    expect(onChange).toHaveBeenCalledWith(['br']);
    await userEvent.click(screen.getByRole('option', { name: 'Alemanha' }));
    expect(onChange).toHaveBeenCalledWith(['br', 'de']);
  });

  it('deselects option on second click', async () => {
    const onChange = vi.fn();
    render(<Select options={options} multiple onChange={onChange} />);
    await userEvent.click(screen.getByRole('combobox'));
    await userEvent.click(screen.getByRole('option', { name: 'Brasil' }));
    await userEvent.click(screen.getByRole('option', { name: 'Brasil' }));
    expect(onChange).toHaveBeenLastCalledWith([]);
  });

  it('calls onChange([]) when cleared in multiple mode', async () => {
    const onChange = vi.fn();
    render(<Select options={options} multiple clearable value={['br']} onChange={onChange} />);
    await userEvent.click(screen.getByRole('button', { name: 'Limpar' }));
    expect(onChange).toHaveBeenCalledWith([]);
  });
});

// ─── Security — XSS via option labels ────────────────────────────────────────
// VULNERABILITY NOTE: Option labels are rendered as React children ({option.label}),
// so React escapes them. No XSS risk via the label prop itself.
// However, if a consumer passes raw HTML from an untrusted source as option.label
// the component is safe because React never interprets strings as HTML.

describe('Select — XSS safety', () => {
  it('renders XSS payload in option label as escaped text', async () => {
    const xssOptions: SelectOption[] = [
      { value: 'x', label: '<script>window.__selectXss=1</script>' },
    ];
    render(<Select options={xssOptions} />);
    await userEvent.click(screen.getByRole('combobox'));
    const optEl = screen.getByRole('option');
    expect(optEl.querySelector('script')).toBeNull();
    expect((window as unknown as Record<string, unknown>).__selectXss).toBeUndefined();
  });

  it('renders img onerror payload as plain text in option', async () => {
    const xssOptions: SelectOption[] = [
      { value: 'y', label: '<img src=x onerror=alert(1)>' },
    ];
    render(<Select options={xssOptions} />);
    await userEvent.click(screen.getByRole('combobox'));
    const optEl = screen.getByRole('option');
    expect(optEl.querySelector('img')).toBeNull();
  });

  it('renders XSS payload in search input without executing', async () => {
    render(<Select options={options} searchable />);
    await userEvent.click(screen.getByRole('combobox'));
    const search = screen.getByPlaceholderText('Buscar...');
    // Type a malicious string — it must stay as text value, never execute
    await userEvent.type(search, '<script>window.__searchXss=1</script>');
    expect((window as unknown as Record<string, unknown>).__searchXss).toBeUndefined();
  });

  it('handles SQL injection string in search without throwing', async () => {
    render(<Select options={options} searchable />);
    await userEvent.click(screen.getByRole('combobox'));
    const search = screen.getByPlaceholderText('Buscar...');
    // Should not throw; shows "no results" since nothing matches
    await userEvent.type(search, "' OR '1'='1");
    expect(screen.getByText('Nenhuma opção encontrada')).toBeTruthy();
  });

  it('handles null-byte in search without throwing', async () => {
    render(<Select options={options} searchable />);
    await userEvent.click(screen.getByRole('combobox'));
    const search = screen.getByPlaceholderText('Buscar...');
    await userEvent.type(search, '\u0000\u0000\u0000');
    // Component should still render "no results" gracefully
    expect(screen.getByText('Nenhuma opção encontrada')).toBeTruthy();
  });

  it('handles extremely long search string without crashing', async () => {
    render(<Select options={options} searchable />);
    await userEvent.click(screen.getByRole('combobox'));
    const search = screen.getByPlaceholderText('Buscar...');
    const longString = 'A'.repeat(10_000);
    fireEvent.change(search, { target: { value: longString } });
    expect(screen.getByText('Nenhuma opção encontrada')).toBeTruthy();
  });
});
