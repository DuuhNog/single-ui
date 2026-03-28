import React, { useEffect, useCallback, HTMLAttributes } from 'react';
import { createPortal } from 'react-dom';
import { clsx } from 'clsx';
import './Modal.css';

export type ModalSize = 'sm' | 'md' | 'lg' | 'xl';

export interface ModalProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  open: boolean;
  onClose: () => void;
  title?: string;
  size?: ModalSize;
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  showCloseButton?: boolean;
  footer?: React.ReactNode;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({
  open,
  onClose,
  title,
  size = 'md',
  closeOnOverlayClick = true,
  closeOnEscape = true,
  showCloseButton = true,
  footer,
  children,
  className,
  ...props
}) => {
  const handleEscape = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape' && closeOnEscape) {
        onClose();
      }
    },
    [closeOnEscape, onClose]
  );

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
      
      if (closeOnEscape) {
        document.addEventListener('keydown', handleEscape);
      }

      return () => {
        document.body.style.overflow = '';
        document.removeEventListener('keydown', handleEscape);
      };
    }
  }, [open, closeOnEscape, handleEscape]);

  if (!open) return null;

  const modalClasses = clsx(
    'single-modal',
    `single-modal--${size}`,
    className
  );

  const modalContent = (
    <div className="single-modal-container" {...props}>
      <div 
        className="single-modal-overlay" 
        onClick={closeOnOverlayClick ? onClose : undefined}
        aria-hidden="true"
      />
      
      <div className={modalClasses} role="dialog" aria-modal="true">
        {/* Header */}
        {(title || showCloseButton) && (
          <div className="single-modal__header">
            {title && <h2 className="single-modal__title">{title}</h2>}
            {showCloseButton && (
              <button
                type="button"
                className="single-modal__close"
                onClick={onClose}
                aria-label="Fechar"
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
            )}
          </div>
        )}

        {/* Body */}
        <div className="single-modal__content">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="single-modal__footer">
            {footer}
          </div>
        )}
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

Modal.displayName = 'Modal';
