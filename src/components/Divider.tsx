import type { HTMLAttributes, ReactNode } from 'react';
import { cx } from '../utils/cx';

export interface DividerProps extends HTMLAttributes<HTMLElement> {
  orientation?: 'horizontal' | 'vertical';
  /** Optional centred label, e.g. "or". */
  label?: ReactNode;
  /** Extra vertical rhythm around a horizontal divider. */
  spacing?: 'none' | 'sm' | 'md' | 'lg';
}

export function Divider({
  orientation = 'horizontal',
  label,
  spacing = 'md',
  className,
  ...rest
}: DividerProps) {
  if (label && orientation === 'horizontal') {
    return (
      <div
        className={cx('mors-divider', 'mors-divider--labelled', `mors-divider--spacing-${spacing}`, className)}
        {...rest}
      >
        <span className="mors-divider-line" />
        <span className="mors-divider-label">{label}</span>
        <span className="mors-divider-line" />
      </div>
    );
  }

  return (
    <hr
      aria-orientation={orientation}
      className={cx(
        'mors-divider',
        `mors-divider--${orientation}`,
        `mors-divider--spacing-${spacing}`,
        className,
      )}
      {...rest}
    />
  );
}
