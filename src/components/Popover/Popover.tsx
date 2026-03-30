import React, { forwardRef, useRef, useState, useEffect, useCallback } from 'react';
import { clsx } from 'clsx';
import './Popover.css';

export type PopoverPlacement =
  | 'top'
  | 'bottom'
  | 'left'
  | 'right'
  | 'top-start'
  | 'top-end'
  | 'bottom-start'
  | 'bottom-end';

export interface PopoverProps {
  trigger: React.ReactElement;
  content: React.ReactNode;
  placement?: PopoverPlacement;
  title?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  closeOnOutside?: boolean;
  className?: string;
}

export const Popover = forwardRef<HTMLSpanElement, PopoverProps>(
  (
    {
      trigger,
      content,
      placement = 'bottom-start',
      title,
      open: controlledOpen,
      onOpenChange,
      closeOnOutside = true,
      className,
    },
    ref
  ) => {
    const isControlled = controlledOpen !== undefined;
    const [internalOpen, setInternalOpen] = useState(false);
    const open = isControlled ? controlledOpen : internalOpen;

    const wrapperRef = useRef<HTMLSpanElement>(null);

    const setOpen = useCallback(
      (value: boolean) => {
        if (!isControlled) setInternalOpen(value);
        onOpenChange?.(value);
      },
      [isControlled, onOpenChange]
    );

    const toggle = useCallback(() => setOpen(!open), [open, setOpen]);

    // Close on outside click
    useEffect(() => {
      if (!open || !closeOnOutside) return;

      const handleMouseDown = (e: MouseEvent) => {
        const wrapper = wrapperRef.current;
        if (wrapper && !wrapper.contains(e.target as Node)) {
          setOpen(false);
        }
      };

      document.addEventListener('mousedown', handleMouseDown);
      return () => document.removeEventListener('mousedown', handleMouseDown);
    }, [open, closeOnOutside, setOpen]);

    type TriggerProps = { onClick?: (e: React.MouseEvent) => void };
    const typedTrigger = trigger as React.ReactElement<TriggerProps>;
    const triggerEl = React.cloneElement(typedTrigger, {
      onClick: (e: React.MouseEvent) => {
        toggle();
        typedTrigger.props.onClick?.(e);
      },
    });

    const panelClasses = clsx(
      'single-popover__panel',
      `single-popover__panel--${placement}`,
      { 'single-popover__panel--open': open },
      className
    );

    return (
      <span ref={(node) => {
        (wrapperRef as React.MutableRefObject<HTMLSpanElement | null>).current = node;
        if (typeof ref === 'function') ref(node);
        else if (ref) (ref as React.MutableRefObject<HTMLSpanElement | null>).current = node;
      }} className="single-popover">
        {triggerEl}
        <span className={panelClasses} role="dialog">
          {(title) && (
            <div className="single-popover__header">
              {title && (
                <span className="single-popover__title">{title}</span>
              )}
              <button
                type="button"
                className="single-popover__close"
                onClick={() => setOpen(false)}
                aria-label="Close"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path
                    d="M18 6L6 18M6 6L18 18"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          )}
          <div className="single-popover__content">{content}</div>
        </span>
      </span>
    );
  }
);

Popover.displayName = 'Popover';
