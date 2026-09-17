import type { AnchorHTMLAttributes, ButtonHTMLAttributes, HTMLAttributes, ReactNode } from 'react';
import { cx } from '../utils/cx';

export interface SidebarProps extends HTMLAttributes<HTMLElement> {
  /** Shrinks to icon-only. Labels remain available to assistive tech. */
  collapsed?: boolean;
  children?: ReactNode;
}

/**
 * Persistent application navigation. Not a Drawer — there is no scrim, no
 * focus trap, and it stays in the layout. Pair with AppShell to slide it
 * off-canvas below 768px.
 */
export function Sidebar({ collapsed = false, className, children, ...rest }: SidebarProps) {
  return (
    <aside
      className={cx('mors-sidebar', collapsed && 'mors-sidebar--collapsed', className)}
      data-collapsed={collapsed || undefined}
      {...rest}
    >
      {children}
    </aside>
  );
}

export function SidebarHeader({ className, children, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cx('mors-sidebar-header', className)} {...rest}>
      {children}
    </div>
  );
}

export function SidebarNav({ className, children, ...rest }: HTMLAttributes<HTMLElement>) {
  return (
    <nav className={cx('mors-sidebar-nav', className)} {...rest}>
      {children}
    </nav>
  );
}

export function SidebarFooter({ className, children, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cx('mors-sidebar-footer', className)} {...rest}>
      {children}
    </div>
  );
}

export interface SidebarSectionProps extends HTMLAttributes<HTMLDivElement> {
  label?: ReactNode;
  children?: ReactNode;
}

export function SidebarSection({ label, className, children, ...rest }: SidebarSectionProps) {
  return (
    <div className={cx('mors-sidebar-section', className)} {...rest}>
      {label && <p className="mors-sidebar-section-label">{label}</p>}
      <ul className="mors-sidebar-list">{children}</ul>
    </div>
  );
}

type SidebarItemShared = {
  icon?: ReactNode;
  badge?: ReactNode;
  active?: boolean;
  children: ReactNode;
};

export type SidebarItemProps = SidebarItemShared &
  (
    | ({ href: string } & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'children' | 'href'>)
    | ({ href?: undefined } & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'>)
  );

export function SidebarItem({
  icon,
  badge,
  active = false,
  children,
  className,
  href,
  ...rest
}: SidebarItemProps) {
  const classNames = cx('mors-sidebar-item', active && 'mors-sidebar-item--active', className);
  const body = (
    <>
      {icon && <span className="mors-sidebar-item-icon">{icon}</span>}
      <span className="mors-sidebar-item-label">{children}</span>
      {badge && <span className="mors-sidebar-item-badge">{badge}</span>}
    </>
  );

  return (
    <li className="mors-sidebar-item-wrap">
      {href ? (
        <a
          href={href}
          className={classNames}
          aria-current={active ? 'page' : undefined}
          title={typeof children === 'string' ? children : undefined}
          {...(rest as Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href' | 'children' | 'className'>)}
        >
          {body}
        </a>
      ) : (
        <button
          type="button"
          className={classNames}
          aria-current={active ? 'page' : undefined}
          title={typeof children === 'string' ? children : undefined}
          {...(rest as Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'className'>)}
        >
          {body}
        </button>
      )}
    </li>
  );
}
