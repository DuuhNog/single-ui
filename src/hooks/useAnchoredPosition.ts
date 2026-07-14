import { RefObject, useEffect, useState } from 'react';

export type AnchoredPlacement =
  | 'top'
  | 'bottom'
  | 'left'
  | 'right'
  | 'top-start'
  | 'top-end'
  | 'bottom-start'
  | 'bottom-end';

export interface AnchoredPositionOptions {
  placement?: AnchoredPlacement;
  offset?: number;
  matchTriggerWidth?: boolean;
}

const EDGE_PADDING = 8;

export function useAnchoredPosition(
  triggerRef: RefObject<HTMLElement | null>,
  popupRef: RefObject<HTMLElement | null>,
  isOpen: boolean,
  options?: AnchoredPositionOptions
): React.CSSProperties {
  const { placement = 'bottom-start', offset = 4, matchTriggerWidth = false } = options ?? {};
  const [style, setStyle] = useState<React.CSSProperties>({ position: 'fixed', top: 0, left: 0, visibility: 'hidden' });

  useEffect(() => {
    if (!isOpen) return;

    const update = () => {
      const trigger = triggerRef.current;
      if (!trigger) return;

      const triggerRect = trigger.getBoundingClientRect();
      const popupRect = popupRef.current?.getBoundingClientRect();
      const popupWidth = popupRect?.width ?? triggerRect.width;
      const popupHeight = popupRect?.height ?? 0;
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      const [base, align] = placement.split('-') as [string, string | undefined];

      let top: number;
      let left: number;

      if (base === 'left' || base === 'right') {
        const spaceRight = viewportWidth - triggerRect.right;
        const spaceLeft = triggerRect.left;
        const side = base === 'left'
          ? (spaceLeft >= popupWidth + offset || spaceLeft >= spaceRight ? 'left' : 'right')
          : (spaceRight >= popupWidth + offset || spaceRight >= spaceLeft ? 'right' : 'left');

        left = side === 'left' ? triggerRect.left - popupWidth - offset : triggerRect.right + offset;
        top = triggerRect.top + triggerRect.height / 2 - popupHeight / 2;
      } else {
        const spaceBelow = viewportHeight - triggerRect.bottom;
        const spaceAbove = triggerRect.top;
        const side = base === 'bottom'
          ? (spaceBelow >= popupHeight + offset || spaceBelow >= spaceAbove ? 'bottom' : 'top')
          : (spaceAbove >= popupHeight + offset || spaceAbove >= spaceBelow ? 'top' : 'bottom');

        top = side === 'bottom' ? triggerRect.bottom + offset : triggerRect.top - popupHeight - offset;

        if (align === 'start') {
          left = triggerRect.left;
        } else if (align === 'end') {
          left = triggerRect.right - popupWidth;
        } else {
          left = triggerRect.left + triggerRect.width / 2 - popupWidth / 2;
        }
      }

      left = Math.min(Math.max(left, EDGE_PADDING), viewportWidth - popupWidth - EDGE_PADDING);
      top = Math.min(Math.max(top, EDGE_PADDING), viewportHeight - popupHeight - EDGE_PADDING);

      setStyle({
        position: 'fixed',
        top,
        left,
        minWidth: matchTriggerWidth ? triggerRect.width : undefined,
        visibility: 'visible',
      });
    };

    update();

    window.addEventListener('scroll', update, true);
    window.addEventListener('resize', update);

    let resizeObserver: ResizeObserver | undefined;
    if (popupRef.current && typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(update);
      resizeObserver.observe(popupRef.current);
    }

    return () => {
      window.removeEventListener('scroll', update, true);
      window.removeEventListener('resize', update);
      resizeObserver?.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, placement, offset, matchTriggerWidth]);

  return style;
}
