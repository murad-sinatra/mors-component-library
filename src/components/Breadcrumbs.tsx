import type { HTMLAttributes, MouseEvent, ReactNode } from 'react';
import { cx } from '../utils/cx';
import { Icon } from './Icon';

export interface BreadcrumbItem {
  label: ReactNode;
  href?: string;
  onClick?: (event: MouseEvent<HTMLAnchorElement>) => void;
}

export interface BreadcrumbsProps extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
  items: readonly BreadcrumbItem[];
  /** Middle items collapse into an ellipsis above this count. */
  maxItems?: number;
  label?: string;
}

/**
 * Ordered trail of ancestors. The final item is rendered as static text with
 * `aria-current="page"` because you cannot navigate to where you already are.
 */
export function Breadcrumbs({
  items,
  maxItems = 4,
  label = 'Breadcrumb',
  className,
  ...rest
}: BreadcrumbsProps) {
  const collapsed =
    items.length > maxItems
      ? [items[0]!, { label: '…' } satisfies BreadcrumbItem, ...items.slice(-2)]
      : items;

  return (
    <nav aria-label={label} className={cx('mors-breadcrumbs', className)} {...rest}>
      <ol className="mors-breadcrumbs-list">
        {collapsed.map((item, index) => {
          const last = index === collapsed.length - 1;
          const isEllipsis = item.label === '…' && !item.href && !item.onClick;

          return (
            <li key={index} className="mors-breadcrumbs-item">
              {last ? (
                <span className="mors-breadcrumbs-current" aria-current="page">
                  {item.label}
                </span>
              ) : isEllipsis ? (
                <span className="mors-breadcrumbs-ellipsis" aria-hidden="true">
                  {item.label}
                </span>
              ) : (
                <a
                  className="mors-breadcrumbs-link mors-link"
                  href={item.href ?? '#'}
                  onClick={item.onClick}
                >
                  {item.label}
                </a>
              )}
              {!last && (
                <Icon name="chevron-right" className="mors-breadcrumbs-separator" aria-hidden="true" />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
