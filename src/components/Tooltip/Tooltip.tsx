import React, { forwardRef, useRef, useState, useCallback } from 'react';
import { clsx } from 'clsx';
import './Tooltip.css';

export type TooltipPlacement = 'top' | 'bottom' | 'left' | 'right';

export interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactElement;
  placement?: TooltipPlacement;
  delay?: number;
  disabled?: boolean;
  className?: string;
}

export const Tooltip = forwardRef<HTMLSpanElement, TooltipProps>(
  (
    {
      content,
      children,
      placement = 'top',
      delay = 300,
      disabled = false,
      className,
    },
    ref
  ) => {
    const [visible, setVisible] = useState(false);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const show = useCallback(() => {
      if (disabled) return;
      timerRef.current = setTimeout(() => setVisible(true), delay);
    }, [disabled, delay]);

    const hide = useCallback(() => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      setVisible(false);
    }, []);

    const tooltipClasses = clsx(
      'single-tooltip__panel',
      `single-tooltip__panel--${placement}`,
      { 'single-tooltip__panel--visible': visible },
      className
    );

    type ChildProps = {
      onMouseEnter?: (e: React.MouseEvent) => void;
      onMouseLeave?: (e: React.MouseEvent) => void;
      onFocus?: (e: React.FocusEvent) => void;
      onBlur?: (e: React.FocusEvent) => void;
    };
    const typedChildren = children as React.ReactElement<ChildProps>;
    const childProps = typedChildren.props;
    const child = React.cloneElement(typedChildren, {
      onMouseEnter: (e: React.MouseEvent) => {
        show();
        childProps.onMouseEnter?.(e);
      },
      onMouseLeave: (e: React.MouseEvent) => {
        hide();
        childProps.onMouseLeave?.(e);
      },
      onFocus: (e: React.FocusEvent) => {
        show();
        childProps.onFocus?.(e);
      },
      onBlur: (e: React.FocusEvent) => {
        hide();
        childProps.onBlur?.(e);
      },
    });

    return (
      <span ref={ref} className="single-tooltip" style={{ position: 'relative', display: 'inline-flex' }}>
        {child}
        {!disabled && (
          <span className={tooltipClasses} role="tooltip">
            {content}
            <span className="single-tooltip__arrow" aria-hidden="true" />
          </span>
        )}
      </span>
    );
  }
);

Tooltip.displayName = 'Tooltip';
