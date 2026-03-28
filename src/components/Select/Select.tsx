import React, { useState, useRef, useEffect } from 'react';
import { clsx } from 'clsx';
import './Select.css';

export interface SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

export interface SelectProps {
  options: SelectOption[];
  value?: string | number;
  defaultValue?: string | number;
  placeholder?: string;
  label?: string;
  error?: string;
  helperText?: string;
  disabled?: boolean;
  searchable?: boolean;
  clearable?: boolean;
  fullWidth?: boolean;
  onChange?: (value: string | number) => void;
  className?: string;
}

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
  fullWidth = false,
  onChange,
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [internalValue, setInternalValue] = useState(defaultValue);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const isControlled = controlledValue !== undefined;
  const value = isControlled ? controlledValue : internalValue;

  const selectedOption = options.find((opt) => opt.value === value);

  const filteredOptions = searchable
    ? options.filter((opt) =>
        opt.label.toLowerCase().includes(search.toLowerCase())
      )
    : options;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearch('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (option: SelectOption) => {
    if (option.disabled) return;

    if (!isControlled) {
      setInternalValue(option.value);
    }

    onChange?.(option.value);
    setIsOpen(false);
    setSearch('');
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!isControlled) {
      setInternalValue(undefined);
    }

    onChange?.('' as any);
  };

  const wrapperClasses = clsx(
    'single-select-wrapper',
    {
      'single-select-wrapper--full-width': fullWidth,
      'single-select-wrapper--disabled': disabled,
      'single-select-wrapper--error': error,
    },
    className
  );

  const triggerClasses = clsx('single-select__trigger', {
    'single-select__trigger--open': isOpen,
    'single-select__trigger--error': error,
  });

  return (
    <div ref={wrapperRef} className={wrapperClasses}>
      {label && (
        <label className="single-select-label">
          {label}
        </label>
      )}

      <div className="single-select">
        <div
          className={triggerClasses}
          onClick={() => !disabled && setIsOpen(!isOpen)}
        >
          <span className="single-select__value">
            {selectedOption ? selectedOption.label : placeholder}
          </span>

          <div className="single-select__icons">
            {clearable && value && !disabled && (
              <button
                type="button"
                className="single-select__clear"
                onClick={handleClear}
              >
                ×
              </button>
            )}
            <span className="single-select__arrow">▼</span>
          </div>
        </div>

        {isOpen && (
          <div className="single-select__dropdown">
            {searchable && (
              <div className="single-select__search">
                <input
                  type="text"
                  className="single-select__search-input"
                  placeholder="Buscar..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  autoFocus
                />
              </div>
            )}

            <div className="single-select__options">
              {filteredOptions.length === 0 ? (
                <div className="single-select__option single-select__option--empty">
                  Nenhuma opção encontrada
                </div>
              ) : (
                filteredOptions.map((option) => (
                  <div
                    key={option.value}
                    className={clsx('single-select__option', {
                      'single-select__option--selected': option.value === value,
                      'single-select__option--disabled': option.disabled,
                    })}
                    onClick={() => handleSelect(option)}
                  >
                    {option.label}
                  </div>
                ))
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
