import type { HTMLAttributes } from 'react';
import { cx } from '../utils/cx';
import type { Size, Tone } from '../utils/types';

export interface SpinnerProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'children'> {
  size?: Size;
  /** Announced by screen readers while busy; pass `null` for decorative use. */
  label?: string | null;
}

export function Spinner({ size = 'md', label = 'Loading', className, ...rest }: SpinnerProps) {
  return (
    <span
      className={cx('mors-spinner', `mors-spinner--${size}`, className)}
      role={label ? 'status' : undefined}
      {...rest}
    >
      <span className="mors-spinner-track" aria-hidden="true" />
      {label && <span className="mors-visually-hidden">{label}</span>}
    </span>
  );
}

export interface SkeletonProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'text' | 'rect' | 'circle';
  width?: number | string;
  height?: number | string;
  /** Number of stacked text lines; only meaningful for `variant="text"`. */
  lines?: number;
}

export function Skeleton({
  variant = 'text',
  width,
  height,
  lines = 1,
  className,
  style,
  ...rest
}: SkeletonProps) {
  if (variant === 'text' && lines > 1) {
    return (
      <span className={cx('mors-skeleton-stack', className)} aria-hidden="true" {...rest}>
        {Array.from({ length: lines }, (_, index) => (
          <span
            key={index}
            className="mors-skeleton mors-skeleton--text"
            style={{ width: index === lines - 1 ? '62%' : width ?? '100%', height }}
          />
        ))}
      </span>
    );
  }

  return (
    <span
      className={cx('mors-skeleton', `mors-skeleton--${variant}`, className)}
      style={{ width, height, ...style }}
      aria-hidden="true"
      {...rest}
    />
  );
}

export interface ProgressProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** Omit for an indeterminate bar. */
  value?: number;
  max?: number;
  size?: Exclude<Size, 'lg'>;
  tone?: Extract<Tone, 'accent' | 'success' | 'warning' | 'danger'>;
  label?: string;
  /** Renders the numeric percentage beside the label. */
  showValue?: boolean;
}

export function Progress({
  value,
  max = 100,
  size = 'md',
  tone = 'accent',
  label,
  showValue = false,
  className,
  ...rest
}: ProgressProps) {
  const indeterminate = value === undefined;
  const percent = indeterminate ? 0 : Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div className={cx('mors-progress', className)} {...rest}>
      {(label || showValue) && (
        <div className="mors-progress-header">
          {label && <span className="mors-progress-label">{label}</span>}
          {showValue && !indeterminate && (
            <span className="mors-progress-value">{Math.round(percent)}%</span>
          )}
        </div>
      )}
      <div
        className={cx(
          'mors-progress-track',
          `mors-progress-track--${size}`,
          `mors-progress-track--${tone}`,
          indeterminate && 'mors-progress-track--indeterminate',
        )}
        role="progressbar"
        aria-label={label}
        aria-valuemin={indeterminate ? undefined : 0}
        aria-valuemax={indeterminate ? undefined : max}
        aria-valuenow={indeterminate ? undefined : value}
      >
        <div
          className="mors-progress-fill"
          style={indeterminate ? undefined : { inlineSize: `${percent}%` }}
        />
      </div>
    </div>
  );
}
