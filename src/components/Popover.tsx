import {
  cloneElement,
  isValidElement,
  useCallback,
  useLayoutEffect,
  type MouseEvent,
  type ReactElement,
  type ReactNode,
  type Ref,
} from 'react';
import { cx } from '../utils/cx';
import { composeRefs } from '../utils/refs';
import type { Align, Placement } from '../utils/types';
import { useControllableState } from '../hooks/useControllableState';
import { useDismiss } from '../hooks/useDismiss';
import { Anchor } from './internal/Anchor';
import { useFloatingSurface } from './internal/useFloatingSurface';
import { Portal } from './Portal';

export interface TriggerInjectedProps {
  ref?: Ref<HTMLElement>;
  onClick?: (event: MouseEvent<HTMLElement>) => void;
  onKeyDown?: (event: React.KeyboardEvent<HTMLElement>) => void;
  'aria-expanded'?: boolean;
  'aria-haspopup'?: 'dialog' | 'menu' | 'listbox' | 'true';
  'aria-controls'?: string;
}

export interface PopoverProps {
  trigger: ReactElement;
  children: ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  placement?: Placement;
  align?: Align;
  offset?: number;
  ariaLabel?: string;
  padding?: 'none' | 'md';
  className?: string;
  matchWidth?: boolean;
  role?: 'dialog' | 'listbox';
  onKeyDown?: (event: React.KeyboardEvent<HTMLDivElement>) => void;
}

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
  const [isOpen, setOpen] = useControllableState(open, defaultOpen, onOpenChange);
  const { anchorRef, triggerRef, panelRef, panelId, mounted, state, position, refs } =
    useFloatingSurface({
      open: isOpen,
      placement,
      align,
      offset,
      matchWidth,
      idSuffix: 'popover',
    });

  const dismiss = useCallback(() => setOpen(false), [setOpen]);
  useDismiss({ enabled: isOpen, onDismiss: dismiss, refs });

  useLayoutEffect(() => {
    if (role === 'listbox' && isOpen && mounted) panelRef.current?.focus();
  }, [role, isOpen, mounted, panelRef]);

  const triggerEl = trigger as ReactElement<TriggerInjectedProps>;
  const triggerElement = isValidElement(trigger)
    ? cloneElement(triggerEl, {
        ref: composeRefs(triggerRef, triggerEl.props.ref),
        'aria-expanded': isOpen,
        'aria-haspopup': role === 'listbox' ? 'listbox' : 'dialog',
        'aria-controls': mounted ? panelId : undefined,
        onClick: (event: MouseEvent<HTMLElement>) => {
          triggerEl.props.onClick?.(event);
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
