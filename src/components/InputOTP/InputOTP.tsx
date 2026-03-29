import { forwardRef, useRef, useEffect, useCallback, ClipboardEvent, KeyboardEvent, ChangeEvent } from 'react';
import { clsx } from 'clsx';
import './InputOTP.css';

export interface InputOTPProps {
  length?: number;
  value?: string;
  onChange?: (value: string) => void;
  onComplete?: (value: string) => void;
  disabled?: boolean;
  error?: string;
  helperText?: string;
  label?: string;
  separator?: number | number[];
  className?: string;
}

/**
 * Normalises the `separator` prop to a Set of positions (1-based) after which
 * a separator should be rendered.
 */
function getSeparatorPositions(separator: number | number[] | undefined): Set<number> {
  if (separator === undefined) return new Set();
  const positions = Array.isArray(separator) ? separator : [separator];
  return new Set(positions);
}

export const InputOTP = forwardRef<HTMLDivElement, InputOTPProps>(
  (
    {
      length = 6,
      value = '',
      onChange,
      onComplete,
      disabled = false,
      error,
      helperText,
      label,
      separator,
      className,
    },
    ref
  ) => {
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
    const separatorPositions = getSeparatorPositions(separator);

    // Keep inputRefs array in sync with `length`
    useEffect(() => {
      inputRefs.current = inputRefs.current.slice(0, length);
    }, [length]);

    const digits = Array.from({ length }, (_, i) => value[i] ?? '');

    const focusIndex = useCallback((index: number) => {
      const el = inputRefs.current[index];
      if (el) {
        el.focus();
        // Move cursor to end of the single character so it can be overwritten
        el.setSelectionRange(el.value.length, el.value.length);
      }
    }, []);

    const updateValue = useCallback(
      (nextDigits: string[]) => {
        const next = nextDigits.join('');
        onChange?.(next);
        if (next.length === length && !next.includes('')) {
          onComplete?.(next);
        }
      },
      [length, onChange, onComplete]
    );

    const handleChange = useCallback(
      (e: ChangeEvent<HTMLInputElement>, index: number) => {
        const raw = e.target.value;
        // Accept only the last entered character if somehow more got in
        const char = raw.replace(/\D/g, '').slice(-1);

        if (!char) {
          // Non-numeric character — restore the current digit value
          e.target.value = digits[index];
          return;
        }

        const nextDigits = [...digits];
        nextDigits[index] = char;
        updateValue(nextDigits);

        // Advance focus to next empty box (or the next box if all filled)
        const nextIndex = index + 1;
        if (nextIndex < length) {
          focusIndex(nextIndex);
        }
      },
      [digits, length, updateValue, focusIndex]
    );

    const handleKeyDown = useCallback(
      (e: KeyboardEvent<HTMLInputElement>, index: number) => {
        if (e.key === 'Backspace') {
          if (digits[index] !== '') {
            // Clear current box
            const nextDigits = [...digits];
            nextDigits[index] = '';
            updateValue(nextDigits);
          } else if (index > 0) {
            // Move to previous box and clear it
            const nextDigits = [...digits];
            nextDigits[index - 1] = '';
            updateValue(nextDigits);
            focusIndex(index - 1);
          }
          e.preventDefault();
          return;
        }

        if (e.key === 'ArrowLeft' && index > 0) {
          e.preventDefault();
          focusIndex(index - 1);
          return;
        }

        if (e.key === 'ArrowRight' && index < length - 1) {
          e.preventDefault();
          focusIndex(index + 1);
          return;
        }

        // If the box already has a digit and user types another digit,
        // the change event will handle it, but we need to clear first
        // so the input doesn't grow beyond maxLength=1.
        if (/^\d$/.test(e.key) && digits[index] !== '') {
          const input = inputRefs.current[index];
          if (input) input.value = '';
        }
      },
      [digits, length, updateValue, focusIndex]
    );

    const handlePaste = useCallback(
      (e: ClipboardEvent<HTMLInputElement>, index: number) => {
        e.preventDefault();
        const pasted = e.clipboardData.getData('text').replace(/\D/g, '');
        if (!pasted) return;

        const nextDigits = [...digits];
        let lastFilled = index;

        for (let i = 0; i < pasted.length && index + i < length; i++) {
          nextDigits[index + i] = pasted[i];
          lastFilled = index + i;
        }

        updateValue(nextDigits);

        // Focus last filled box (or the one after if there's room)
        const focusTarget = Math.min(lastFilled + 1, length - 1);
        focusIndex(focusTarget);
      },
      [digits, length, updateValue, focusIndex]
    );

    const wrapperClasses = clsx('single-otp', className, {
      'single-otp--disabled': disabled,
      'single-otp--error': !!error,
    });

    return (
      <div ref={ref} className={wrapperClasses}>
        {label && (
          <label className="single-otp__label">{label}</label>
        )}

        <div className="single-otp__inputs">
          {Array.from({ length }, (_, index) => {
            const digit = digits[index];
            const isFilled = digit !== '';

            return (
              <span key={index} className="single-otp__group">
                <input
                  ref={(el) => {
                    inputRefs.current[index] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  pattern="\d*"
                  maxLength={1}
                  value={digit}
                  className={clsx('single-otp__box', {
                    'single-otp__box--filled': isFilled,
                    'single-otp__box--error': !!error,
                  })}
                  disabled={disabled}
                  autoComplete="one-time-code"
                  aria-label={`Digit ${index + 1} of ${length}`}
                  onChange={(e) => handleChange(e, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  onPaste={(e) => handlePaste(e, index)}
                  onFocus={(e) => e.target.select()}
                />

                {/* Render separator after this position if configured */}
                {separatorPositions.has(index + 1) && index + 1 < length && (
                  <span className="single-otp__separator" aria-hidden="true">
                    —
                  </span>
                )}
              </span>
            );
          })}
        </div>

        {error && (
          <div className="single-otp__error" role="alert">
            {error}
          </div>
        )}
        {!error && helperText && (
          <div className="single-otp__helper">{helperText}</div>
        )}
      </div>
    );
  }
);

InputOTP.displayName = 'InputOTP';
