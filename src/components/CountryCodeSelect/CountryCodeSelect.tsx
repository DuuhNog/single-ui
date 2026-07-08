import React, { useState, useRef, useEffect } from 'react';
import { clsx } from 'clsx';
import './CountryCodeSelect.css';

export interface CountryCodeOption {
  /** ISO 3166-1 alpha-2 code, e.g. 'BR' */
  iso: string;
  name: string;
  /** Dial code without the leading '+', e.g. '55' */
  dial: string;
}

export interface CountryCodeSelectProps {
  countries?: CountryCodeOption[];
  value?: string;
  defaultValue?: string;
  onChange?: (country: CountryCodeOption) => void;
  disabled?: boolean;
  searchable?: boolean;
  className?: string;
  'aria-label'?: string;
}

export const DEFAULT_COUNTRY_CODES: CountryCodeOption[] = [
  { iso: 'BR', name: 'Brasil', dial: '55' },
  { iso: 'US', name: 'Estados Unidos', dial: '1' },
  { iso: 'CA', name: 'Canadá', dial: '1' },
  { iso: 'PY', name: 'Paraguai', dial: '595' },
  { iso: 'AR', name: 'Argentina', dial: '54' },
  { iso: 'UY', name: 'Uruguai', dial: '598' },
  { iso: 'CL', name: 'Chile', dial: '56' },
  { iso: 'BO', name: 'Bolívia', dial: '591' },
  { iso: 'CO', name: 'Colômbia', dial: '57' },
  { iso: 'MX', name: 'México', dial: '52' },
  { iso: 'PE', name: 'Peru', dial: '51' },
  { iso: 'PT', name: 'Portugal', dial: '351' },
  { iso: 'ES', name: 'Espanha', dial: '34' },
  { iso: 'DE', name: 'Alemanha', dial: '49' },
  { iso: 'FR', name: 'França', dial: '33' },
  { iso: 'IT', name: 'Itália', dial: '39' },
  { iso: 'GB', name: 'Reino Unido', dial: '44' },
  { iso: 'CN', name: 'China', dial: '86' },
  { iso: 'JP', name: 'Japão', dial: '81' },
];

function isoToFlagEmoji(iso: string): string {
  return iso
    .toUpperCase()
    .replace(/./g, (char) => String.fromCodePoint(127397 + char.charCodeAt(0)));
}

function SearchIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

export const CountryCodeSelect: React.FC<CountryCodeSelectProps> = ({
  countries = DEFAULT_COUNTRY_CODES,
  value: controlledValue,
  defaultValue,
  onChange,
  disabled = false,
  searchable = true,
  className,
  'aria-label': ariaLabel = 'Código do país',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [internalValue, setInternalValue] = useState(defaultValue ?? countries[0]?.iso);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const isControlled = controlledValue !== undefined;
  const selectedIso = isControlled ? controlledValue : internalValue;
  const selected = countries.find((c) => c.iso === selectedIso) ?? countries[0];

  const filteredCountries = searchable && search
    ? countries.filter((c) =>
        c.name.toLowerCase().includes(search.toLowerCase()) || c.dial.includes(search)
      )
    : countries;

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
    if (isOpen && searchable) setTimeout(() => searchRef.current?.focus(), 0);
  }, [isOpen, searchable]);

  const handleSelect = (country: CountryCodeOption) => {
    if (!isControlled) setInternalValue(country.iso);
    onChange?.(country);
    setIsOpen(false);
    setSearch('');
  };

  return (
    <div ref={wrapperRef} className={clsx('single-country-select', className)}>
      <button
        type="button"
        className={clsx('single-country-select__trigger', {
          'single-country-select__trigger--open': isOpen,
          'single-country-select__trigger--disabled': disabled,
        })}
        onClick={() => !disabled && setIsOpen((o) => !o)}
        disabled={disabled}
        aria-label={ariaLabel}
        aria-expanded={isOpen}
      >
        {selected && (
          <>
            <span className="single-country-select__flag" aria-hidden="true">
              {isoToFlagEmoji(selected.iso)}
            </span>
            <span className="single-country-select__dial">+{selected.dial}</span>
          </>
        )}
      </button>

      {isOpen && (
        <div className="single-country-select__dropdown" role="listbox">
          {searchable && (
            <div className="single-country-select__search">
              <SearchIcon />
              <input
                ref={searchRef}
                type="text"
                className="single-country-select__search-input"
                placeholder="Buscar país ou código..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          )}

          <div className="single-country-select__options">
            {filteredCountries.length === 0 ? (
              <div className="single-country-select__option single-country-select__option--empty">
                Nenhum país encontrado
              </div>
            ) : (
              filteredCountries.map((country) => (
                <div
                  key={country.iso}
                  role="option"
                  aria-selected={country.iso === selected?.iso}
                  className={clsx('single-country-select__option', {
                    'single-country-select__option--selected': country.iso === selected?.iso,
                  })}
                  onClick={() => handleSelect(country)}
                >
                  <span className="single-country-select__flag" aria-hidden="true">
                    {isoToFlagEmoji(country.iso)}
                  </span>
                  <span className="single-country-select__option-name">{country.name}</span>
                  <span className="single-country-select__option-dial">+{country.dial}</span>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

CountryCodeSelect.displayName = 'CountryCodeSelect';
