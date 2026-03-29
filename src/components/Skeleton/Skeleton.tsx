import React, { forwardRef, HTMLAttributes } from 'react';
import { clsx } from 'clsx';
import './Skeleton.css';

export interface SkeletonProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  variant?: 'text' | 'rect' | 'circle';
  width?: string | number;
  height?: string | number;
  className?: string;
  lines?: number;
}

function normalizeSize(value: string | number | undefined): string | undefined {
  if (value === undefined) return undefined;
  return typeof value === 'number' ? `${value}px` : value;
}

export const Skeleton = forwardRef<HTMLDivElement, SkeletonProps>(
  (
    {
      variant = 'rect',
      width,
      height,
      className,
      lines,
      style,
      ...props
    },
    ref
  ) => {
    // Multi-line text skeleton
    if (variant === 'text' && lines !== undefined && lines > 1) {
      return (
        <div
          ref={ref}
          className={clsx('single-skeleton__lines', className)}
          {...props}
        >
          {Array.from({ length: lines }).map((_, i) => {
            const isLast = i === lines - 1;
            return (
              <div
                key={i}
                className="single-skeleton single-skeleton--text"
                style={{
                  width: isLast ? '60%' : normalizeSize(width) ?? '100%',
                  height: normalizeSize(height),
                  ...(!isLast ? {} : {}),
                }}
              />
            );
          })}
        </div>
      );
    }

    const classes = clsx(
      'single-skeleton',
      `single-skeleton--${variant}`,
      className
    );

    const inlineStyle: React.CSSProperties = {
      ...style,
    };

    if (width !== undefined) inlineStyle.width = normalizeSize(width);
    if (height !== undefined) inlineStyle.height = normalizeSize(height);

    // Circle: force equal dimensions using width as the diameter
    if (variant === 'circle' && width !== undefined) {
      const size = normalizeSize(width);
      inlineStyle.width = size;
      inlineStyle.height = size;
    }

    return (
      <div
        ref={ref}
        className={classes}
        style={inlineStyle}
        aria-hidden="true"
        {...props}
      />
    );
  }
);

Skeleton.displayName = 'Skeleton';
