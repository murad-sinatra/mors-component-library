import type { HTMLAttributes, ReactNode } from 'react';
import { cx } from '../utils/cx';
import type { Tone } from '../utils/types';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: Tone;
  variant?: 'soft' | 'solid' | 'outline';
  size?: 'sm' | 'md';
  /** Small leading dot, useful for status labels. */
  dot?: boolean;
  startIcon?: ReactNode;
}

export function Badge({
  tone = 'neutral',
  variant = 'soft',
  size = 'md',
  dot = false,
  startIcon,
  className,
  children,
  ...rest
}: BadgeProps) {
  return (
    <span
      className={cx(
        'mors-badge',
        `mors-badge--${variant}`,
        `mors-badge--${tone}`,
        `mors-badge--${size}`,
        className,
      )}
      {...rest}
    >
      {dot && <span className="mors-badge-dot" aria-hidden="true" />}
      {startIcon && <span className="mors-badge-icon">{startIcon}</span>}
      {children}
    </span>
  );
}
