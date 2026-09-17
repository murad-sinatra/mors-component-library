import type { HTMLAttributes, ReactNode } from 'react';
import { cx } from '../utils/cx';

export interface KbdProps extends HTMLAttributes<HTMLElement> {
  /** Shortcut keys rendered as a combo, e.g. `['⌘', 'K']`. */
  keys?: readonly ReactNode[];
  children?: ReactNode;
}

/** A keyboard key, or a combo when `keys` is provided. */
export function Kbd({ keys, children, className, ...rest }: KbdProps) {
  if (keys && keys.length > 0) {
    return (
      <span className={cx('mors-kbd-combo', className)} {...rest}>
        {keys.map((key, index) => (
          <kbd key={index} className="mors-kbd">
            {key}
          </kbd>
        ))}
      </span>
    );
  }

  return (
    <kbd className={cx('mors-kbd', className)} {...rest}>
      {children}
    </kbd>
  );
}
