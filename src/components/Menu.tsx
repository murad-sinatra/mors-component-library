import {
  cloneElement,
  createContext,
  isValidElement,
  useCallback,
  useContext,
  useId,
  useMemo,
  useRef,
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
import { useAnchoredPosition } from '../hooks/useAnchoredPosition';
import { useControllableState } from '../hooks/useControllableState';
import { useDismiss } from '../hooks/useDismiss';
import { usePresence } from '../hooks/usePresence';
import { Anchor } from './internal/Anchor';
import { Portal } from './Portal';
import type { TriggerInjectedProps } from './Popover';

const MenuContext = createContext<{ close: () => void } | null>(null);

const ITEM_SELECTOR = '[role="menuitem"]:not([aria-disabled="true"]):not(:disabled)';

export interface MenuProps {
  /** Any focusable element; receives aria-haspopup="menu" and aria-expanded. */
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

/**
 * Dropdown menu with roving keyboard focus: Arrow keys move between items,
 * Home/End jump to the ends, Enter or Space activates, Escape closes and
 * returns focus to the trigger.
 */
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
  const anchorRef = useRef<HTMLElement>(null);
  const triggerRef = useRef<HTMLElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const refs = useMemo(() => [anchorRef, panelRef], [anchorRef, panelRef]);
  const menuId = `mors${useId()}-menu`;

  const [isOpen, setOpen] = useControllableState(open, defaultOpen, onOpenChange);
  const { mounted, state } = usePresence(isOpen, 160);
  const position = useAnchoredPosition({
    open: isOpen && mounted,
    anchorRef,
    floatingRef: panelRef,
    placement,
    align,
    offset,
  });

  const close = useCallback(
    (returnFocus = true) => {
      setOpen(false);
      if (!returnFocus) return;
      const node = triggerRef.current ?? getFocusable(anchorRef.current)[0] ?? anchorRef.current;
      node?.focus();
    },
    [setOpen],
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

  const menuApi = useMemo(() => ({ close: () => close() }), [close]);

  const triggerElement = isValidElement(trigger)
    ? cloneElement(trigger as ReactElement<TriggerInjectedProps>, {
        ref: composeRefs(
          triggerRef,
          (trigger as ReactElement<TriggerInjectedProps>).props.ref,
        ),
        'aria-haspopup': 'menu',
        'aria-expanded': isOpen,
        'aria-controls': mounted ? menuId : undefined,
        onClick: (event: MouseEvent<HTMLElement>) => {
          (trigger as ReactElement<TriggerInjectedProps>).props.onClick?.(event);
          if (isOpen) close(false);
          else openWith(0);
        },
        onKeyDown: (event: KeyboardEvent<HTMLElement>) => {
          (trigger as ReactElement<TriggerInjectedProps>).props.onKeyDown?.(event);
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
            id={menuId}
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
  /** Right-aligned hint such as "⌘K". Purely decorative. */
  shortcut?: ReactNode;
  tone?: 'default' | 'danger';
  /** Runs before the menu closes. */
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
