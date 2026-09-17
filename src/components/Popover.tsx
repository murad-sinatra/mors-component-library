import {
  cloneElement,
  isValidElement,
  useCallback,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  type MouseEvent,
  type ReactElement,
  type ReactNode,
  type Ref,
} from 'react';
import { cx } from '../utils/cx';
import { composeRefs } from '../utils/refs';
import type { Align, Placement } from '../utils/types';
import { useAnchoredPosition } from '../hooks/useAnchoredPosition';
import { useControllableState } from '../hooks/useControllableState';
import { useDismiss } from '../hooks/useDismiss';
import { usePresence } from '../hooks/usePresence';
import { Anchor } from './internal/Anchor';
import { Portal } from './Portal';

/** Props the library injects into a floating-element trigger. */
export interface TriggerInjectedProps {
  ref?: Ref<HTMLElement>;
  onClick?: (event: MouseEvent<HTMLElement>) => void;
  onKeyDown?: (event: React.KeyboardEvent<HTMLElement>) => void;
  'aria-expanded'?: boolean;
  'aria-haspopup'?: 'dialog' | 'menu' | 'listbox' | 'true';
  'aria-controls'?: string;
}

export interface PopoverProps {
  /** Any focusable element; it receives aria-expanded and aria-controls. */
  trigger: ReactElement;
  children: ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  placement?: Placement;
  align?: Align;
  offset?: number;
  /** Accessible name for the panel, recommended when it has no heading. */
  ariaLabel?: string;
  padding?: 'none' | 'md';
  className?: string;
  /** Stretch the panel to the trigger's width — used by Select. */
  matchWidth?: boolean;
  role?: 'dialog' | 'listbox';
  onKeyDown?: (event: React.KeyboardEvent<HTMLDivElement>) => void;
}

/**
 * Click-triggered floating panel: viewport-aware placement with flipping,
 * dismissal on Escape or an outside pointer press, and a subtle rise-in.
 */
export function Popover({
  trigger,
  children,
  open,
  defaultOpen = false,
  onOpenChange,
  placement = 'bottom',
  align = 'center',
  offset = 8,
  ariaLabel,
  padding = 'md',
  className,
  matchWidth = false,
  role = 'dialog',
  onKeyDown,
}: PopoverProps) {
  const anchorRef = useRef<HTMLElement>(null);
  const triggerRef = useRef<HTMLElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const refs = useMemo(() => [anchorRef, panelRef], [anchorRef, panelRef]);
  const panelId = `mors${useId()}-popover`;

  const [isOpen, setOpen] = useControllableState(open, defaultOpen, onOpenChange);
  const { mounted, state } = usePresence(isOpen, 160);
  const position = useAnchoredPosition({
    open: isOpen && mounted,
    anchorRef,
    floatingRef: panelRef,
    placement,
    align,
    offset,
    matchWidth,
  });

  const dismiss = useCallback(() => setOpen(false), [setOpen]);
  useDismiss({ enabled: isOpen, onDismiss: dismiss, refs });

  useLayoutEffect(() => {
    if (role === 'listbox' && isOpen && mounted) panelRef.current?.focus();
  }, [role, isOpen, mounted]);

  const triggerElement = isValidElement(trigger)
    ? cloneElement(trigger as ReactElement<TriggerInjectedProps>, {
        ref: composeRefs(
          triggerRef,
          (trigger as ReactElement<TriggerInjectedProps>).props.ref,
        ),
        'aria-expanded': isOpen,
        'aria-haspopup': role === 'listbox' ? 'listbox' : 'dialog',
        'aria-controls': mounted ? panelId : undefined,
        onClick: (event: MouseEvent<HTMLElement>) => {
          (trigger as ReactElement<TriggerInjectedProps>).props.onClick?.(event);
          setOpen(!isOpen);
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
            role={role}
            aria-label={ariaLabel}
            className={cx('mors-popover', padding === 'none' && 'mors-popover--flush', className)}
            style={position.style}
            data-state={state}
            data-placement={position.placement}
            tabIndex={role === 'listbox' ? 0 : undefined}
            onKeyDown={onKeyDown}
          >
            {children}
          </div>
        </Portal>
      )}
    </>
  );
}
