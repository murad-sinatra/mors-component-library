import {
  type HTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
  useRef,
} from 'react';
import { cx } from '../utils/cx';

const ITEM_SELECTOR =
  'button:not(:disabled), a[href], [tabindex]:not([tabindex="-1"]):not(:disabled)';

export interface ToolbarProps extends HTMLAttributes<HTMLDivElement> {
  /** Required accessible name for the toolbar landmark. */
  label: string;
  children?: ReactNode;
}

/**
 * Compact action row for editors, mail and tables. Arrow keys move between
 * the focusable controls inside it.
 */
export function Toolbar({ label, className, children, onKeyDown, ...rest }: ToolbarProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  const onKey = (event: KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(event);
    if (event.defaultPrevented) return;
    if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft' && event.key !== 'Home' && event.key !== 'End') {
      return;
    }

    const items = Array.from(rootRef.current?.querySelectorAll<HTMLElement>(ITEM_SELECTOR) ?? []);
    if (items.length === 0) return;
    const index = items.indexOf(document.activeElement as HTMLElement);
    const next =
      event.key === 'Home'
        ? 0
        : event.key === 'End'
          ? items.length - 1
          : (index + (event.key === 'ArrowRight' ? 1 : -1) + items.length) % items.length;

    event.preventDefault();
    items[next]?.focus();
  };

  return (
    <div
      ref={rootRef}
      role="toolbar"
      aria-label={label}
      className={cx('mors-toolbar', className)}
      tabIndex={-1}
      onKeyDown={onKey}
      {...rest}
    >
      {children}
    </div>
  );
}

export function ToolbarGroup({ className, children, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div role="group" className={cx('mors-toolbar-group', className)} {...rest}>
      {children}
    </div>
  );
}

export function ToolbarSeparator({ className, ...rest }: HTMLAttributes<HTMLHRElement>) {
  return <hr className={cx('mors-toolbar-separator', className)} {...rest} />;
}

export function ToolbarSpacer({ className, ...rest }: HTMLAttributes<HTMLSpanElement>) {
  return <span className={cx('mors-toolbar-spacer', className)} {...rest} />;
}
