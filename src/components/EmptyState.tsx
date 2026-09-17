import type { HTMLAttributes, ReactNode } from 'react';
import { cx } from '../utils/cx';
import { Icon } from './Icon';

export interface EmptyStateProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  title: ReactNode;
  description?: ReactNode;
  /** Defaults to an inbox glyph; pass `null` for a text-only state. */
  icon?: ReactNode | null;
  /** Primary and secondary calls to action. */
  actions?: ReactNode;
  size?: 'sm' | 'md';
}

export function EmptyState({
  title,
  description,
  icon,
  actions,
  size = 'md',
  className,
  children,
  ...rest
}: EmptyStateProps) {
  return (
    <div className={cx('mors-empty-state', `mors-empty-state--${size}`, className)} {...rest}>
      {icon !== null && (
        <span className="mors-empty-state-icon" aria-hidden="true">
          {icon ?? <Icon name="inbox" />}
        </span>
      )}
      <p className="mors-empty-state-title">{title}</p>
      {description && <p className="mors-empty-state-description">{description}</p>}
      {children}
      {actions && <div className="mors-empty-state-actions">{actions}</div>}
    </div>
  );
}
