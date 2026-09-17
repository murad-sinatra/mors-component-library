import {
  cloneElement,
  isValidElement,
  useCallback,
  useId,
  useMemo,
  useRef,
  type MouseEvent,
  type ReactElement,
  type ReactNode,
  type Ref,
} from 'react';
import { cx } from '../utils/cx';
import type { Align, Placement } from '../utils/types';
import { useAnchoredPosition } from '../hooks/useAnchoredPosition';
import { useControllableState } from '../hooks/useControllableState';
import { useDismiss } from '../hooks/useDismiss';
import { usePresence } from '../hooks/usePresence';
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
  /** Any focusable element; it receives ref and aria-expanded/-controls. */
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
}: PopoverProps) {
  const triggerRef = useRef<HTMLElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const refs = useMemo(() => [triggerRef, panelRef], [triggerRef, panelRef]);
  const panelId = `mors${useId()}-popover`;

  const [isOpen, setOpen] = useControllableState(open, defaultOpen, onOpenChange);
  const { mounted, state } = usePresence(isOpen, 160);
  const position = useAnchoredPosition({
    open: isOpen && mounted,
    anchorRef: triggerRef,
    floatingRef: panelRef,
    placement,
    align,
    offset,
  });

  const dismiss = useCallback(() => setOpen(false), [setOpen]);
  useDismiss({ enabled: isOpen, onDismiss: dismiss, refs });

  // The trigger is user-supplied, so its props are widened once, here.
  const triggerElement = isValidElement(trigger)
    ? cloneElement(trigger as ReactElement<TriggerInjectedProps>, {
        ref: triggerRef,
        'aria-expanded': isOpen,
        'aria-haspopup': 'dialog',
        'aria-controls': mounted ? panelId : undefined,
        onClick: (event: MouseEvent<HTMLElement>) => {
          (trigger as ReactElement<TriggerInjectedProps>).props.onClick?.(event);
          setOpen(!isOpen);
        },
      })
    : trigger;

  return (
    <>
      {triggerElement}
      {mounted && (
        <Portal>
          <div
            ref={panelRef}
            id={panelId}
            role="dialog"
            aria-label={ariaLabel}
            className={cx('mors-popover', padding === 'none' && 'mors-popover--flush', className)}
            style={position.style}
            data-state={state}
            data-placement={position.placement}
          >
            {children}
          </div>
        </Portal>
      )}
    </>
  );
}
