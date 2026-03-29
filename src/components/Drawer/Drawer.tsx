import React, { useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { clsx } from 'clsx';
import './Drawer.css';

export type DrawerSide = 'left' | 'right' | 'top' | 'bottom';
export type DrawerSize = 'sm' | 'md' | 'lg' | 'full';

export interface DrawerProps {
  open: boolean;
  onClose: () => void;
  side?: DrawerSide;
  size?: DrawerSize;
  title?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  closeOnBackdrop?: boolean;
  className?: string;
}

export const Drawer: React.FC<DrawerProps> = ({
  open,
  onClose,
  side = 'right',
  size = 'md',
  title,
  children,
  footer,
  closeOnBackdrop = true,
  className,
}) => {
  const handleEscape = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    },
    [onClose]
  );

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
      document.addEventListener('keydown', handleEscape);

      return () => {
        document.body.style.overflow = '';
        document.removeEventListener('keydown', handleEscape);
      };
    }
  }, [open, handleEscape]);

  if (!open) return null;

  const drawerClasses = clsx(
    'single-drawer',
    `single-drawer--${side}`,
    `single-drawer--${size}`,
    className
  );

  const content = (
    <div className="single-drawer-container">
      {/* Backdrop */}
      <div
        className="single-drawer-backdrop"
        onClick={closeOnBackdrop ? onClose : undefined}
        aria-hidden="true"
      />

      {/* Panel */}
      <div className={drawerClasses} role="dialog" aria-modal="true">
        {/* Header */}
        <div className="single-drawer__header">
          {title ? (
            <h2 className="single-drawer__title">{title}</h2>
          ) : (
            <span />
          )}
          <button
            type="button"
            className="single-drawer__close"
            onClick={onClose}
            aria-label="Close"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
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

        {/* Body */}
        <div className="single-drawer__body">{children}</div>

        {/* Footer */}
        {footer && <div className="single-drawer__footer">{footer}</div>}
      </div>
    </div>
  );

  return createPortal(content, document.body);
};

Drawer.displayName = 'Drawer';
