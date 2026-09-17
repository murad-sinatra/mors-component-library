import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode } from 'react';
import { cx } from '../utils/cx';
import { Icon } from './Icon';

export interface ChipProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  children: ReactNode;
  selected?: boolean;
  size?: 'sm' | 'md';
  startIcon?: ReactNode;
  onRemove?: () => void;
  removeLabel?: string;
  count?: number;
}

export function Chip({
  children,
  selected = false,
  size = 'md',
  startIcon,
  onRemove,
  removeLabel = 'Remove',
  count,
  className,
  ...rest
}: ChipProps) {
  return (
    <span
      className={cx(
        'mors-chip-wrapper',
        `mors-chip-wrapper--${size}`,
        selected && 'mors-chip-wrapper--selected',
      )}
    >
      <button
        type="button"
        className={cx('mors-chip', selected && 'mors-chip--selected', className)}
        aria-pressed={selected}
        {...rest}
      >
        {startIcon && <span className="mors-chip-icon">{startIcon}</span>}
        <span>{children}</span>
        {count !== undefined && <span className="mors-chip-count">{count}</span>}
      </button>
      {onRemove && (
        <button
          type="button"
          className="mors-chip-remove mors-focusable"
          aria-label={`${removeLabel}: ${typeof children === 'string' ? children : ''}`.trim()}
          onClick={onRemove}
        >
          <Icon name="close" />
        </button>
      )}
    </span>
  );
}

export interface FilterBarProps extends HTMLAttributes<HTMLDivElement> {
  label: string;
  leading?: ReactNode;
  trailing?: ReactNode;
  summary?: ReactNode;
}

export function FilterBar({
  label,
  leading,
  trailing,
  summary,
  className,
  children,
  ...rest
}: FilterBarProps) {
  return (
    <div
      role="group"
      aria-label={label}
      className={cx('mors-filter-bar', className)}
      {...rest}
    >
      {leading && <div className="mors-filter-bar-leading">{leading}</div>}
      <div className="mors-filter-bar-chips">{children}</div>
      <div className="mors-filter-bar-trailing">
        {summary && (
          <span className="mors-filter-bar-summary" aria-live="polite">
            {summary}
          </span>
        )}
        {trailing}
      </div>
    </div>
  );
}
