import { TextareaHTMLAttributes, forwardRef } from 'react';
import { clsx } from 'clsx';
import './Textarea.css';

export interface TextareaProps extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'rows'> {
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
  rows?: number;
  resize?: 'none' | 'vertical' | 'horizontal' | 'both';
  className?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      label,
      error,
      helperText,
      fullWidth = false,
      rows = 3,
      resize = 'vertical',
      className,
      required,
      disabled,
      style,
      ...props
    },
    ref
  ) => {
    const wrapperClasses = clsx(
      'single-textarea-wrapper',
      {
        'single-textarea-wrapper--full-width': fullWidth,
        'single-textarea-wrapper--error': error,
        'single-textarea-wrapper--disabled': disabled,
      },
      className
    );

    const textareaClasses = clsx('single-textarea', {
      'single-textarea--error': error,
      [`single-textarea--resize-${resize}`]: true,
    });

    return (
      <div className={wrapperClasses}>
        {label && (
          <label className="single-textarea-label">
            {label}
            {required && <span className="single-textarea-label__required"> *</span>}
          </label>
        )}

        <textarea
          ref={ref}
          className={textareaClasses}
          rows={rows}
          disabled={disabled}
          required={required}
          style={style}
          {...props}
        />

        {error && <div className="single-textarea-error">{error}</div>}
        {!error && helperText && <div className="single-textarea-helper">{helperText}</div>}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
