import React, { useState, useCallback, useRef } from 'react';
import { clsx } from 'clsx';
import './Accordion.css';

export interface AccordionItem {
  id: string;
  title: string;
  content: React.ReactNode;
  disabled?: boolean;
  badge?: string | number;
}

export interface AccordionProps {
  items: AccordionItem[];
  defaultOpen?: string | string[];
  open?: string | string[];
  onChange?: (id: string, isOpen: boolean) => void;
  multiple?: boolean;
  variant?: 'default' | 'bordered' | 'separated';
  className?: string;
}

// ── Single accordion item ────────────────────────────────────────────────────

interface AccordionItemPanelProps {
  item: AccordionItem;
  isOpen: boolean;
  onToggle: (id: string) => void;
  variant: NonNullable<AccordionProps['variant']>;
}

const AccordionItemPanel: React.FC<AccordionItemPanelProps> = ({ item, isOpen, onToggle, variant }) => {
  const contentRef = useRef<HTMLDivElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (!item.disabled) onToggle(item.id);
    }
  };

  return (
    <div
      className={clsx(
        'single-accordion__item',
        `single-accordion__item--${variant}`,
        {
          'single-accordion__item--open': isOpen,
          'single-accordion__item--disabled': item.disabled,
        }
      )}
    >
      <button
        type="button"
        className="single-accordion__trigger"
        aria-expanded={isOpen}
        aria-disabled={item.disabled}
        disabled={item.disabled}
        onClick={() => onToggle(item.id)}
        onKeyDown={handleKeyDown}
      >
        <span className="single-accordion__trigger-label">
          {item.title}
          {item.badge !== undefined && (
            <span className="single-accordion__badge">{item.badge}</span>
          )}
        </span>
        <span
          className={clsx('single-accordion__chevron', {
            'single-accordion__chevron--open': isOpen,
          })}
          aria-hidden="true"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </span>
      </button>

      {/* Grid trick for smooth height animation */}
      <div
        className={clsx('single-accordion__body', {
          'single-accordion__body--open': isOpen,
        })}
        ref={contentRef}
      >
        <div className="single-accordion__body-inner">
          {item.content}
        </div>
      </div>
    </div>
  );
};

// ── Accordion root ───────────────────────────────────────────────────────────

export const Accordion: React.FC<AccordionProps> = ({
  items,
  defaultOpen,
  open: controlledOpen,
  onChange,
  multiple = false,
  variant = 'default',
  className,
}) => {
  const isControlled = controlledOpen !== undefined;

  const normalizeIds = (val: string | string[] | undefined): string[] => {
    if (!val) return [];
    return Array.isArray(val) ? val : [val];
  };

  const [internalOpen, setInternalOpen] = useState<string[]>(() =>
    normalizeIds(defaultOpen)
  );

  const openIds = isControlled ? normalizeIds(controlledOpen) : internalOpen;

  const handleToggle = useCallback(
    (id: string) => {
      const currentlyOpen = isControlled ? normalizeIds(controlledOpen) : internalOpen;
      const isOpen = currentlyOpen.includes(id);
      let next: string[];

      if (isOpen) {
        next = currentlyOpen.filter((i) => i !== id);
      } else {
        next = multiple ? [...currentlyOpen, id] : [id];
      }

      if (!isControlled) setInternalOpen(next);
      onChange?.(id, !isOpen);
    },
    [isControlled, controlledOpen, internalOpen, multiple, onChange]
  );

  return (
    <div
      className={clsx(
        'single-accordion',
        `single-accordion--${variant}`,
        className
      )}
    >
      {items.map((item) => (
        <AccordionItemPanel
          key={item.id}
          item={item}
          isOpen={openIds.includes(item.id)}
          onToggle={handleToggle}
          variant={variant}
        />
      ))}
    </div>
  );
};

Accordion.displayName = 'Accordion';
