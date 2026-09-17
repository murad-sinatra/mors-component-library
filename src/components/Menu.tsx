import {
  cloneElement,
  createContext,
  isValidElement,
  useCallback,
  useContext,
  useMemo,
  type ButtonHTMLAttributes,
  type KeyboardEvent,
  type MouseEvent,
  type ReactElement,
  type ReactNode,
} from 'react';
import { cx } from '../utils/cx';
import { composeRefs } from '../utils/refs';
import { getFocusable } from '../utils/focus';
import type { Align, Placement } from '../utils/types';
import { useControllableState } from '../hooks/useControllableState';
import { useDismiss } from '../hooks/useDismiss';
import { Anchor } from './internal/Anchor';
import { useFloatingSurface } from './internal/useFloatingSurface';
import { Portal } from './Portal';
import type { TriggerInjectedProps } from './Popover';

export const MenuContext = createContext<{ close: (returnFocus?: boolean) => void } | null>(null);

const ITEM_SELECTOR = '[role="menuitem"]:not([aria-disabled="true"]):not(:disabled)';

export interface MenuProps {
  trigger: ReactElement;
  children: ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  placement?: Placement;
  align?: Align;
  offset?: number;
  ariaLabel?: string;
  className?: string;
}

export function Menu({
  trigger,
  children,
  open,
  defaultOpen = false,
  onOpenChange,
  placement = 'bottom',
  align = 'end',
  offset = 6,
  ariaLabel,
  className,
}: MenuProps) {
  const [isOpen, setOpen] = useControllableState(open, defaultOpen, onOpenChange);
  const { anchorRef, triggerRef, panelRef, panelId, mounted, state, position, refs } =
    useFloatingSurface({
      open: isOpen,
      placement,
      align,
      offset,
      idSuffix: 'menu',
    });

  const close = useCallback(
    (returnFocus = true) => {
      setOpen(false);
      if (!returnFocus) return;
      const node = triggerRef.current ?? getFocusable(anchorRef.current)[0] ?? anchorRef.current;
      node?.focus();
    },
    [setOpen, triggerRef, anchorRef],
  );

  const dismiss = useCallback(() => setOpen(false), [setOpen]);
  useDismiss({ enabled: isOpen, onDismiss: dismiss, refs });

  const items = () =>
    Array.from(panelRef.current?.querySelectorAll<HTMLElement>(ITEM_SELECTOR) ?? []);

  const focusItem = (index: number) => {
    const all = items();
    if (all.length === 0) return;
    const next = ((index % all.length) + all.length) % all.length;
    all[next]?.focus();
  };

  const onPanelKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const all = items();
    const current = all.indexOf(document.activeElement as HTMLElement);

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        focusItem(current + 1);
        break;
      case 'ArrowUp':
        event.preventDefault();
        focusItem(current - 1);
        break;
      case 'Home':
        event.preventDefault();
        focusItem(0);
        break;
      case 'End':
        event.preventDefault();
        focusItem(all.length - 1);
        break;
      case 'Tab':
        event.preventDefault();
        close();
        break;
      default:
        break;
    }
  };

  const openWith = (index: number) => {
    setOpen(true);
    requestAnimationFrame(() => focusItem(index));
  };

  const menuApi = useMemo(() => ({ close }), [close]);
  const triggerEl = trigger as ReactElement<TriggerInjectedProps>;
  const triggerElement = isValidElement(trigger)
    ? cloneElement(triggerEl, {
        ref: composeRefs(triggerRef, triggerEl.props.ref),
        'aria-haspopup': 'menu',
        'aria-expanded': isOpen,
        'aria-controls': mounted ? panelId : undefined,
        onClick: (event: MouseEvent<HTMLElement>) => {
          triggerEl.props.onClick?.(event);
          if (isOpen) close(false);
          else openWith(0);
        },
        onKeyDown: (event: KeyboardEvent<HTMLElement>) => {
          triggerEl.props.onKeyDown?.(event);
          if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
            event.preventDefault();
            openWith(event.key === 'ArrowDown' ? 0 : -1);
          }
        },
      })
    : trigger;

  return (
    <>
      <Anchor ref={anchorRef}>{triggerElement}</Anchor>
      {mounted && (
        <Portal>
          <div
            ref={panelRef}
            id={panelId}
            role="menu"
            tabIndex={-1}
            aria-label={ariaLabel}
            aria-orientation="vertical"
            className={cx('mors-menu', className)}
            style={position.style}
            data-state={state}
            data-placement={position.placement}
            onKeyDown={onPanelKeyDown}
          >
            <MenuContext value={menuApi}>{children}</MenuContext>
          </div>
        </Portal>
      )}
    </>
  );
}

export interface MenuItemProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onSelect'> {
  icon?: ReactNode;
  shortcut?: ReactNode;
  tone?: 'default' | 'danger';
  onSelect?: () => void;
}

export function MenuItem({
  icon,
  shortcut,
  tone = 'default',
  onSelect,
  className,
  children,
  disabled,
  onClick,
  ...rest
}: MenuItemProps) {
  const menu = useContext(MenuContext);
  return (
    <button
      type="button"
      role="menuitem"
      tabIndex={-1}
      className={cx('mors-menu-item', tone === 'danger' && 'mors-menu-item--danger', className)}
      disabled={disabled}
      aria-disabled={disabled || undefined}
      onClick={(event) => {
        onClick?.(event);
        if (disabled) return;
        onSelect?.();
        menu?.close();
      }}
      {...rest}
    >
      {icon && <span className="mors-menu-item-icon">{icon}</span>}
      <span className="mors-menu-item-label">{children}</span>
      {shortcut && <span className="mors-menu-item-shortcut">{shortcut}</span>}
    </button>
  );
}

export function MenuSeparator({ className }: { className?: string }) {
  return <hr className={cx('mors-menu-separator', className)} />;
}

export interface MenuLabelProps {
  children: ReactNode;
  className?: string;
}

export function MenuLabel({ children, className }: MenuLabelProps) {
  return <div className={cx('mors-menu-label', className)}>{children}</div>;
}
