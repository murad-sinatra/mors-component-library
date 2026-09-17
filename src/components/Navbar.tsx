import {
  Children,
  cloneElement,
  isValidElement,
  useEffect,
  useId,
  useState,
  type AnchorHTMLAttributes,
  type HTMLAttributes,
  type MouseEvent,
  type ReactElement,
  type ReactNode,
} from 'react';
import { cx } from '../utils/cx';
import { IconButton } from './Button';
import { Icon } from './Icon';

export interface NavbarProps extends HTMLAttributes<HTMLElement> {
  /** Wordmark or logo, placed at the start of the bar. */
  brand?: ReactNode;
  /** Navigation links; collapse behind a disclosure button on small screens. */
  children?: ReactNode;
  /** Trailing controls such as search, theme toggle or an avatar menu. */
  actions?: ReactNode;
  sticky?: boolean;
  /** Translucent, blurred background over scrolling content. */
  translucent?: boolean;
  menuLabel?: string;
}

/**
 * Application bar with a built-in responsive disclosure: below 768px the links
 * collapse behind a toggle wired with `aria-expanded`/`aria-controls`.
 */
export function Navbar({
  brand,
  children,
  actions,
  sticky = true,
  translucent = true,
  menuLabel = 'Main menu',
  className,
  ...rest
}: NavbarProps) {
  const [open, setOpen] = useState(false);
  const panelId = `mors${useId()}-navbar-panel`;

  useEffect(() => {
    if (!open) return;
    const close = () => setOpen(false);
    window.addEventListener('hashchange', close);
    return () => window.removeEventListener('hashchange', close);
  }, [open]);

  const panelLinks = Children.map(children, (child) => {
    if (!isValidElement(child)) return child;
    const element = child as ReactElement<{ onClick?: (event: MouseEvent<HTMLAnchorElement>) => void }>;
    const previous = element.props.onClick;
    return cloneElement(element, {
      onClick: (event: MouseEvent<HTMLAnchorElement>) => {
        previous?.(event);
        setOpen(false);
      },
    });
  });

  return (
    <header
      className={cx(
        'mors-navbar',
        sticky && 'mors-navbar--sticky',
        translucent && 'mors-navbar--translucent',
        open && 'mors-navbar--open',
        className,
      )}
      {...rest}
    >
      <div className="mors-navbar-bar">
        {brand && <div className="mors-navbar-brand">{brand}</div>}

        {children && (
          <nav className="mors-navbar-links" aria-label={menuLabel}>
            {children}
          </nav>
        )}

        <div className="mors-navbar-actions">
          {actions}
          {children && (
            <IconButton
              className="mors-navbar-toggle"
              label={open ? 'Close menu' : 'Open menu'}
              icon={<Icon name={open ? 'close' : 'menu'} />}
              variant="ghost"
              size="md"
              aria-expanded={open}
              aria-controls={panelId}
              onClick={() => setOpen((value) => !value)}
            />
          )}
        </div>
      </div>

      {children && (
        <nav id={panelId} className="mors-navbar-panel" aria-label={menuLabel} hidden={!open}>
          {panelLinks}
        </nav>
      )}
    </header>
  );
}

export interface NavbarLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  /** Marks the link as the current page. */
  active?: boolean;
}

export function NavbarLink({ active = false, className, children, ...rest }: NavbarLinkProps) {
  return (
    <a
      className={cx('mors-navbar-link', active && 'mors-navbar-link--active', className)}
      aria-current={active ? 'page' : undefined}
      {...rest}
    >
      {children}
    </a>
  );
}
