import { useState, useEffect } from 'react';
import { clsx } from 'clsx';
import './FloatButton.css';

export interface FloatButtonProps {
  /** Scroll threshold in px before the button becomes visible (default: 300) */
  threshold?: number;
  /** Override default click handler (default: scroll to top) */
  onClick?: () => void;
  /** Custom icon (default: chevron up) */
  icon?: React.ReactNode;
  position?: 'bottom-right' | 'bottom-left';
  className?: string;
}

function ChevronUpIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="18 15 12 9 6 15" />
    </svg>
  );
}

export function FloatButton({
  threshold = 300,
  onClick,
  icon,
  position = 'bottom-right',
  className,
}: FloatButtonProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > threshold);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [threshold]);

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <button
      className={clsx(
        'single-float-btn',
        `single-float-btn--${position}`,
        { 'single-float-btn--visible': visible },
        className
      )}
      onClick={handleClick}
      aria-label="Voltar ao topo"
      aria-hidden={!visible}
    >
      {icon ?? <ChevronUpIcon />}
    </button>
  );
}

FloatButton.displayName = 'FloatButton';
