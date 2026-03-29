import React, { forwardRef, useId, useState } from 'react';
import { clsx } from 'clsx';
import './Slider.css';

export interface SliderProps {
  min?: number;
  max?: number;
  step?: number;
  value?: number;
  defaultValue?: number;
  onChange?: (value: number) => void;
  disabled?: boolean;
  label?: string;
  helperText?: string;
  showValue?: boolean;
  formatValue?: (value: number) => string;
  className?: string;
}

export const Slider = forwardRef<HTMLInputElement, SliderProps>(({
  min = 0,
  max = 100,
  step = 1,
  value,
  defaultValue,
  onChange,
  disabled = false,
  label,
  helperText,
  showValue = false,
  formatValue,
  className,
}, ref) => {
  const id = useId();
  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = useState(defaultValue ?? min);
  const currentValue = isControlled ? value! : internalValue;
  const pct = Math.round(((currentValue - min) / (max - min)) * 100);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const next = Number(e.target.value);
    if (!isControlled) setInternalValue(next);
    onChange?.(next);
  };

  const displayValue = formatValue ? formatValue(currentValue) : String(currentValue);

  return (
    <div className={clsx('single-slider-wrapper', { 'single-slider-wrapper--disabled': disabled }, className)}>
      {(label || showValue) && (
        <div className="single-slider__header">
          {label && <label htmlFor={id} className="single-slider__label">{label}</label>}
          {showValue && <span className="single-slider__value">{displayValue}</span>}
        </div>
      )}
      <div className="single-slider__track-wrapper">
        <input
          ref={ref}
          id={id}
          type="range"
          min={min}
          max={max}
          step={step}
          value={currentValue}
          onChange={handleChange}
          disabled={disabled}
          className="single-slider__input"
          style={{ '--single-slider-pct': `${pct}%` } as React.CSSProperties}
        />
      </div>
      {helperText && <span className="single-slider__helper">{helperText}</span>}
    </div>
  );
});

Slider.displayName = 'Slider';
