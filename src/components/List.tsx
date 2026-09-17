import type { HTMLAttributes, ReactNode } from 'react';
import { cx } from '../utils/cx';
import { Icon } from './Icon';

export interface ListProps extends HTMLAttributes<HTMLUListElement> {
  inset?: boolean;
}

export function List({ inset = false, className, children, ...rest }: ListProps) {
  return (
    <ul className={cx('mors-list', inset && 'mors-list--inset', className)} {...rest}>
      {children}
    </ul>
  );
}

export interface ListItemProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  title: ReactNode;
  subtitle?: ReactNode;
  leading?: ReactNode;
  trailing?: ReactNode;
  href?: string;
  chevron?: boolean;
}

export function ListItem({
  title,
  subtitle,
  leading,
  trailing,
  href,
  chevron,
  className,
  onClick,
  ...rest
}: ListItemProps) {
  const interactive = Boolean(href) || Boolean(onClick);
  const showChevron = chevron ?? interactive;
  const classNames = cx('mors-list-row', interactive && 'mors-list-row--interactive', className);
  const body = (
    <>
      {leading && <span className="mors-list-leading">{leading}</span>}
      <span className="mors-list-copy">
        <span className="mors-list-title">{title}</span>
        {subtitle && <span className="mors-list-subtitle">{subtitle}</span>}
      </span>
      {trailing && <span className="mors-list-trailing">{trailing}</span>}
      {showChevron && <Icon name="chevron-right" className="mors-list-chevron" />}
    </>
  );

  return (
    <li className="mors-list-item">
      {href ? (
        <a className={classNames} href={href} {...rest}>
          {body}
        </a>
      ) : onClick ? (
        <button type="button" className={classNames} onClick={onClick} {...rest}>
          {body}
        </button>
      ) : (
        <div className={classNames} {...rest}>
          {body}
        </div>
      )}
    </li>
  );
}
