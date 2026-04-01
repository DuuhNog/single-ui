import { clsx } from 'clsx';
import './Anchor.css';

export interface AnchorProps {
  /** Target element ID (with or without leading #) */
  href: string;
  children: React.ReactNode;
  /** Extra offset subtracted from the scroll position (useful for fixed headers) */
  offset?: number;
  className?: string;
}

export function Anchor({ href, children, offset = 0, className }: AnchorProps) {
  const normalizedHref = href.startsWith('#') ? href : `#${href}`;
  const targetId = href.startsWith('#') ? href.slice(1) : href;

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const el = document.getElementById(targetId);
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  };

  return (
    <a
      href={normalizedHref}
      onClick={handleClick}
      className={clsx('single-anchor', className)}
    >
      {children}
    </a>
  );
}

Anchor.displayName = 'Anchor';
