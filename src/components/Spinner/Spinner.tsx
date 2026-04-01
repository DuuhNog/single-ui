import { clsx } from 'clsx';
import './Spinner.css';

export type SpinnerVariant = 'gear' | 'circular' | 'lifeline';
export type SpinnerSize = 'sm' | 'md' | 'lg';

export interface SpinnerProps {
  variant?: SpinnerVariant;
  size?: SpinnerSize;
  sizeNumber?: number;
  color?: string;
  className?: string;
}

const SIZE_PX: Record<SpinnerSize, number> = { sm: 16, md: 24, lg: 40 };

export function Spinner({
  variant = 'circular',
  size = 'md',
  sizeNumber,
  color,
  className,
}: SpinnerProps) {
  const px = sizeNumber ?? SIZE_PX[size];

  const style: React.CSSProperties = {};
  if (color) style.color = color;
  if (sizeNumber) { style.width = sizeNumber; style.height = sizeNumber; }

  return (
    <span
      className={clsx('single-spinner', !sizeNumber && `single-spinner--${size}`, className)}
      style={Object.keys(style).length ? style : undefined}
      role="status"
      aria-label="Carregando"
    >
      {variant === 'gear' && <GearSpinner size={px} />}
      {variant === 'circular' && <CircularSpinner size={px} />}
      {variant === 'lifeline' && <LifelineSpinner size={px} />}
    </span>
  );
}

/* ─── Gear ───────────────────────────────────────────────────────────────── */
function GearSpinner({ size }: { size: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className="single-spinner__gear"
    >
      <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94L14.4 2.81c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41L9.25 5.35C8.66 5.59 8.12 5.92 7.63 6.29L5.24 5.33c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.22-.07.47.12.61l2.03 1.58C4.84 11.36 4.8 11.69 4.8 12s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61L19.14 12.94zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z" />
    </svg>
  );
}

/* ─── Circular ───────────────────────────────────────────────────────────── */
function CircularSpinner({ size }: { size: number }) {
  const stroke = Math.max(2, size / 8);
  const r = (size - stroke * 2) / 2;
  const c = 2 * Math.PI * r;
  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className="single-spinner__circular"
    >
      {/* Track */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke="currentColor"
        strokeWidth={stroke}
        opacity={0.15}
      />
      {/* Arc */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke="currentColor"
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={`${c * 0.7} ${c * 0.3}`}
        strokeDashoffset={0}
      />
    </svg>
  );
}

/* ─── Lifeline (ECG pulse) ───────────────────────────────────────────────── */
function LifelineSpinner({ size }: { size: number }) {
  const h = size;
  const w = size * 3;
  const mid = h / 2;
  // ECG-style path
  const points = `0,${mid} ${w * 0.25},${mid} ${w * 0.33},${mid * 0.3} ${w * 0.42},${mid * 1.7} ${w * 0.5},${mid * 0.1} ${w * 0.58},${mid * 1.9} ${w * 0.66},${mid * 0.5} ${w * 0.75},${mid} ${w},${mid}`;

  return (
    <svg
      width={size}
      height={h}
      viewBox={`0 0 ${w} ${h}`}
      className="single-spinner__lifeline"
      preserveAspectRatio="xMidYMid meet"
    >
      <polyline
        points={points}
        fill="none"
        stroke="currentColor"
        strokeWidth={size / 8}
        strokeLinecap="round"
        strokeLinejoin="round"
        pathLength="1"
      />
    </svg>
  );
}

Spinner.displayName = 'Spinner';
