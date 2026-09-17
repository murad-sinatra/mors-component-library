import type { AnchorHTMLAttributes } from 'react';
import { cx } from '../utils/cx';

export interface SkipLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  /** Target id, including the hash — e.g. `#main`. */
  href: string;
}

/**
 * Visually hidden until focused. Place as the first focusable node in the
 * document so keyboard users can jump past chrome.
 */
export function SkipLink({ href, className, children = 'Skip to content', ...rest }: SkipLinkProps) {
  return (
    <a href={href} className={cx('mors-skip-link', className)} {...rest}>
      {children}
    </a>
  );
}
