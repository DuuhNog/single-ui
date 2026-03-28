import React, { HTMLAttributes, forwardRef } from 'react';
import { clsx } from 'clsx';
import './Card.css';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  title?: string;
  subtitle?: string;
  footer?: React.ReactNode;
  hoverable?: boolean;
  bordered?: boolean;
  children: React.ReactNode;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      title,
      subtitle,
      footer,
      hoverable = false,
      bordered = true,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const classes = clsx(
      'single-card',
      {
        'single-card--hoverable': hoverable,
        'single-card--bordered': bordered,
      },
      className
    );

    return (
      <div ref={ref} className={classes} {...props}>
        {(title || subtitle) && (
          <div className="single-card__header">
            {title && <h3 className="single-card__title">{title}</h3>}
            {subtitle && <p className="single-card__subtitle">{subtitle}</p>}
          </div>
        )}

        <div className="single-card__body">{children}</div>

        {footer && <div className="single-card__footer">{footer}</div>}
      </div>
    );
  }
);

Card.displayName = 'Card';
