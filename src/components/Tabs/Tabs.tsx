import React, { useCallback, useEffect, useRef, useState } from 'react';
import { clsx } from 'clsx';
import './Tabs.css';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface TabItem {
  id: string;
  label: string;
  content: React.ReactNode;
  disabled?: boolean;
  badge?: string | number;
}

export interface TabsProps {
  items: TabItem[];
  defaultTab?: string;
  activeTab?: string;
  onChange?: (id: string) => void;
  variant?: 'underline' | 'pills';
  className?: string;
}

// ─── Tabs ─────────────────────────────────────────────────────────────────────

export const Tabs: React.FC<TabsProps> = ({
  items,
  defaultTab,
  activeTab: controlledTab,
  onChange,
  variant = 'underline',
  className,
}) => {
  const isControlled = controlledTab !== undefined;
  const [internalTab, setInternalTab] = useState<string>(
    defaultTab ?? items[0]?.id ?? ''
  );

  const activeId = isControlled ? controlledTab : internalTab;

  // Indicator slide state
  const tabListRef = useRef<HTMLDivElement>(null);
  const [indicatorStyle, setIndicatorStyle] = useState<React.CSSProperties>({});

  const updateIndicator = useCallback(() => {
    if (!tabListRef.current) return;
    const activeBtn = tabListRef.current.querySelector<HTMLButtonElement>(
      `[data-tab-id="${activeId}"]`
    );
    if (!activeBtn) return;

    const listRect = tabListRef.current.getBoundingClientRect();
    const btnRect = activeBtn.getBoundingClientRect();

    setIndicatorStyle({
      width: btnRect.width,
      transform: `translateX(${btnRect.left - listRect.left}px)`,
    });
  }, [activeId]);

  useEffect(() => {
    updateIndicator();
    // Recalculate on resize
    const obs = typeof ResizeObserver !== 'undefined'
      ? new ResizeObserver(updateIndicator)
      : null;
    if (obs && tabListRef.current) obs.observe(tabListRef.current);
    return () => obs?.disconnect();
  }, [updateIndicator]);

  const handleSelect = (id: string) => {
    if (!isControlled) setInternalTab(id);
    onChange?.(id);
  };

  const activeItem = items.find((t) => t.id === activeId) ?? items[0];

  const listClasses = clsx(
    'single-tabs__list',
    `single-tabs__list--${variant}`
  );

  return (
    <div className={clsx('single-tabs', `single-tabs--${variant}`, className)}>
      {/* Tab list */}
      <div className={listClasses} ref={tabListRef} role="tablist">
        {items.map((tab) => {
          const isActive = tab.id === activeId;
          return (
            <button
              key={tab.id}
              role="tab"
              type="button"
              data-tab-id={tab.id}
              aria-selected={isActive}
              aria-controls={`single-tabs-panel-${tab.id}`}
              id={`single-tabs-tab-${tab.id}`}
              disabled={tab.disabled}
              onClick={() => !tab.disabled && handleSelect(tab.id)}
              className={clsx(
                'single-tabs__tab',
                `single-tabs__tab--${variant}`,
                {
                  'single-tabs__tab--active': isActive,
                  'single-tabs__tab--disabled': tab.disabled,
                }
              )}
            >
              {tab.label}
              {tab.badge !== undefined && (
                <span
                  className={clsx('single-tabs__badge', {
                    'single-tabs__badge--active': isActive,
                  })}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}

        {/* Sliding indicator */}
        <span
          className={clsx(
            'single-tabs__indicator',
            `single-tabs__indicator--${variant}`
          )}
          style={indicatorStyle}
          aria-hidden="true"
        />
      </div>

      {/* Tab panels */}
      {items.map((tab) => (
        <div
          key={tab.id}
          role="tabpanel"
          id={`single-tabs-panel-${tab.id}`}
          aria-labelledby={`single-tabs-tab-${tab.id}`}
          hidden={tab.id !== activeItem?.id}
          className="single-tabs__panel"
        >
          {tab.content}
        </div>
      ))}
    </div>
  );
};

Tabs.displayName = 'Tabs';
