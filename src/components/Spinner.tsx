import type { HTMLAttributes } from 'react';
import { cx } from '../utils/cx';
import type { Size } from '../utils/types';

export interface SpinnerProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'children'> {
  size?: Size;
  label?: string | null;
}

export function Spinner({ size = 'md', label = 'Loading', className, ...rest }: SpinnerProps) {
  return (
    <span
      className={cx('mors-spinner', size !== 'md' && `mors-spinner--${size}`, className)}
      role={label ? 'status' : undefined}
      {...rest}
    >
      <span className="mors-spinner-track" aria-hidden="true" />
      {label && <span className="mors-visually-hidden">{label}</span>}
    </span>
  );
}
