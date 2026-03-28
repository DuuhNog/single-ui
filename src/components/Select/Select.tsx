import React, { useState, useRef, useEffect, useCallback } from 'react';
import { clsx } from 'clsx';
import { Chip } from '../Chip/Chip';
import './Select.css';

export interface SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

export interface SelectProps {
  options: SelectOption[];
  value?: string | number | null | (string | number)[];
  defaultValue?: string | number | null | (string | number)[];
  placeholder?: string;
  label?: string;
  error?: string;
  helperText?: string;
  disabled?: boolean;
  searchable?: boolean;
  clearable?: boolean;
  multiple?: boolean;
  fullWidth?: boolean;
  onChange?: (value: string | number | null | (string | number)[]) => void;
  className?: string;
}

// ─── Icons ────────────────────────────────────────────────────────────────────
function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      className={clsx('single-select__chevron', { 'single-select__chevron--open': open })}
      width="14" height="14" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2.5"
      strokeLinecap="round" strokeLinejoin="round"
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg
      className="single-select__search-icon"
      width="14" height="14" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      width="12" height="12" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2.5"
      strokeLinecap="round" strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg
      width="12" height="12" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2.5"
      strokeLinecap="round" strokeLinejoin="round"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────
export const Select: React.FC<SelectProps> = ({
  options,
  value: controlledValue,
  defaultValue,
  placeholder = 'Selecione...',
  label,
  error,
  helperText,
  disabled = false,
  searchable = false,
  clearable = false,
  multiple = false,
  fullWidth = false,
  onChange,
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [internalValue, setInternalValue] = useState<string | number | null | (string | number)[] | undefined>(
    defaultValue ?? (multiple ? [] : undefined)
  );
  const wrapperRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const isControlled = controlledValue !== undefined;
  const value = isControlled ? controlledValue : internalValue;

  const selectedValues: (string | number)[] = multiple
    ? (Array.isArray(value) ? value : (value != null ? [value as string | number] : []))
    : (value != null && value !== '' ? [value as string | number] : []);

  const selectedOptions = options.filter(o => selectedValues.includes(o.value));

  // Search is always shown for multiple; shown when searchable=true for single
  const showSearch = multiple || searchable;

  const filteredOptions = showSearch
    ? options.filter(o => o.label.toLowerCase().includes(search.toLowerCase()))
    : options;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setSearch('');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && showSearch) setTimeout(() => searchRef.current?.focus(), 0);
  }, [isOpen, showSearch]);

  const handleSelect = useCallback((option: SelectOption) => {
    if (option.disabled) return;
    if (multiple) {
      const current = Array.isArray(value) ? value : [];
      const next = current.includes(option.value)
        ? current.filter(v => v !== option.value)
        : [...current, option.value];
      if (!isControlled) setInternalValue(next);
      onChange?.(next);
    } else {
      if (!isControlled) setInternalValue(option.value);
      onChange?.(option.value);
      setIsOpen(false);
      setSearch('');
    }
  }, [multiple, value, isControlled, onChange]);

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isControlled) setInternalValue(multiple ? [] : undefined);
    onChange?.(multiple ? [] : null);
  };

  const hasValue = multiple ? selectedValues.length > 0 : (value != null && value !== '');

  const showPlaceholder = !hasValue;

  return (
    <div
      ref={wrapperRef}
      className={clsx('single-select-wrapper', {
        'single-select-wrapper--full-width': fullWidth,
        'single-select-wrapper--disabled': disabled,
        'single-select-wrapper--error': error,
      }, className)}
    >
      {label && <label className="single-select-label">{label}</label>}

      <div className="single-select">
        <div
          className={clsx('single-select__trigger', {
            'single-select__trigger--open': isOpen,
            'single-select__trigger--error': error,
          })}
          onClick={() => !disabled && setIsOpen(o => !o)}
          role="combobox"
          aria-expanded={isOpen}
        >
          {/* Value area */}
          {multiple && selectedOptions.length > 0 ? (
            <div className="single-select__chips-scroll">
              {selectedOptions.map(opt => (
                <Chip
                  key={opt.value}
                  label={opt.label}
                  variant="primary"
                  size="sm"
                  onRemove={(e) => {
                    e.stopPropagation();
                    if (!disabled) handleSelect(opt);
                  }}
                />
              ))}
            </div>
          ) : (
            <span className={clsx('single-select__value', { 'single-select__value--placeholder': showPlaceholder })}>
              {showPlaceholder ? placeholder : (selectedOptions[0]?.label ?? placeholder)}
            </span>
          )}

          <div className="single-select__icons">
            {clearable && hasValue && !disabled && (
              <button type="button" className="single-select__clear" onClick={handleClear} aria-label="Limpar">
                <XIcon />
              </button>
            )}
            <ChevronIcon open={isOpen} />
          </div>
        </div>

        {isOpen && (
          <div className="single-select__dropdown" role="listbox">
            {showSearch && (
              <div className="single-select__search">
                <SearchIcon />
                <input
                  ref={searchRef}
                  type="text"
                  className="single-select__search-input"
                  placeholder="Buscar..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  onClick={e => e.stopPropagation()}
                />
              </div>
            )}

            <div className="single-select__options">
              {filteredOptions.length === 0 ? (
                <div className="single-select__option single-select__option--empty">
                  Nenhuma opção encontrada
                </div>
              ) : (
                filteredOptions.map(option => {
                  const selected = selectedValues.includes(option.value);
                  return (
                    <div
                      key={option.value}
                      role="option"
                      aria-selected={selected}
                      className={clsx('single-select__option', {
                        'single-select__option--selected': selected,
                        'single-select__option--disabled': option.disabled,
                      })}
                      onClick={() => handleSelect(option)}
                    >
                      {multiple && (
                        <span className={clsx('single-select__checkbox', {
                          'single-select__checkbox--checked': selected,
                        })}>
                          {selected && <CheckIcon />}
                        </span>
                      )}
                      {option.label}
                      {!multiple && selected && (
                        <span className="single-select__option-check">
                          <CheckIcon />
                        </span>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>

      {error && <div className="single-select-error">{error}</div>}
      {!error && helperText && <div className="single-select-helper">{helperText}</div>}
    </div>
  );
};

Select.displayName = 'Select';
