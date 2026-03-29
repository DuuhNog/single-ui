import React, { forwardRef, HTMLAttributes, Children, isValidElement, cloneElement } from 'react';
import { clsx } from 'clsx';
import './Avatar.css';

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type AvatarStatus = 'online' | 'offline' | 'busy' | 'away';

export interface AvatarProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'children'> {
  src?: string;
  alt?: string;
  name?: string;
  size?: AvatarSize;
  status?: AvatarStatus;
  className?: string;
}

export interface AvatarGroupProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  max?: number;
  size?: AvatarSize;
  className?: string;
}

// Deterministic background color from name
const PRESET_COLORS = [
  '#f59e0b', // amber
  '#3b82f6', // blue
  '#22c55e', // green
  '#a855f7', // purple
  '#ef4444', // red
  '#ec4899', // pink
];

function getColorFromName(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = (hash + name.charCodeAt(i)) % PRESET_COLORS.length;
  }
  return PRESET_COLORS[hash];
}

function getInitials(name: string): string {
  const words = name.trim().split(/\s+/);
  if (words.length === 0) return '';
  if (words.length === 1) return words[0].charAt(0).toUpperCase();
  return (words[0].charAt(0) + words[words.length - 1].charAt(0)).toUpperCase();
}

const UserIcon: React.FC = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
    className="single-avatar__icon"
  >
    <path
      fillRule="evenodd"
      d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z"
      clipRule="evenodd"
    />
  </svg>
);

export const Avatar = forwardRef<HTMLSpanElement, AvatarProps>(
  (
    {
      src,
      alt,
      name,
      size = 'md',
      status,
      className,
      style,
      ...props
    },
    ref
  ) => {
    const bgColor = name ? getColorFromName(name) : undefined;

    const classes = clsx(
      'single-avatar',
      `single-avatar--${size}`,
      {
        'single-avatar--image': !!src,
        'single-avatar--initials': !src && !!name,
        'single-avatar--fallback': !src && !name,
      },
      className
    );

    const inlineStyle: React.CSSProperties = {
      ...style,
      ...(bgColor && !src ? { backgroundColor: bgColor } : {}),
    };

    return (
      <span ref={ref} className={classes} style={inlineStyle} {...props}>
        {src ? (
          <img
            src={src}
            alt={alt ?? name ?? 'avatar'}
            className="single-avatar__image"
          />
        ) : name ? (
          <span className="single-avatar__initials">{getInitials(name)}</span>
        ) : (
          <UserIcon />
        )}

        {status && (
          <span
            className={clsx('single-avatar__status', `single-avatar__status--${status}`)}
            aria-label={status}
          />
        )}
      </span>
    );
  }
);

Avatar.displayName = 'Avatar';

// AvatarGroup
export const AvatarGroup = forwardRef<HTMLDivElement, AvatarGroupProps>(
  ({ children, max, size, className, ...props }, ref) => {
    const childArray = Children.toArray(children).filter(isValidElement);
    const total = childArray.length;
    const overflow = max !== undefined && total > max ? total - max : 0;
    const visible = overflow > 0 ? childArray.slice(0, max) : childArray;

    return (
      <div ref={ref} className={clsx('single-avatar-group', className)} {...props}>
        {visible.map((child, i) => {
          if (!isValidElement(child)) return null;
          return cloneElement(child as React.ReactElement<AvatarProps>, {
            key: i,
            size: size ?? (child.props as AvatarProps).size,
            className: clsx(
              (child.props as AvatarProps).className,
              'single-avatar-group__item'
            ),
          });
        })}
        {overflow > 0 && (
          <span
            className={clsx(
              'single-avatar',
              'single-avatar--overflow',
              size ? `single-avatar--${size}` : 'single-avatar--md',
              'single-avatar-group__item'
            )}
            aria-label={`${overflow} more`}
          >
            <span className="single-avatar__initials">+{overflow}</span>
          </span>
        )}
      </div>
    );
  }
);

AvatarGroup.displayName = 'AvatarGroup';
