import type { AnchorHTMLAttributes, ReactNode } from 'react';
import { cx } from '../utils/cx';
import { Icon } from './Icon';

export interface LinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  /** Opens in a new tab and marks the destination as external for assistive tech. */
  external?: boolean;
  endIcon?: ReactNode;
}

export function Link({
  external = false,
  endIcon,
  className,
  children,
  target,
  rel,
  ...rest
}: LinkProps) {
  const isExternal = external || target === '_blank';
  return (
    <a
      className={cx('mors-link', className)}
      target={isExternal ? '_blank' : target}
      rel={isExternal ? (rel ?? 'noopener noreferrer') : rel}
      {...rest}
    >
      {children}
      {endIcon ?? (isExternal ? <Icon name="external" className="mors-link-icon" /> : null)}
    </a>
  );
}
