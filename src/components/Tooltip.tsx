import {
  cloneElement,
  isValidElement,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type FocusEvent,
  type ReactElement,
  type ReactNode,
  type Ref,
} from 'react';
import { cx } from '../utils/cx';
import type { Align, Placement } from '../utils/types';
import { useAnchoredPosition } from '../hooks/useAnchoredPosition';
import { usePresence } from '../hooks/usePresence';
import { Portal } from './Portal';

interface TooltipTriggerProps {
  ref?: Ref<HTMLElement>;
  onPointerEnter?: (event: React.PointerEvent<HTMLElement>) => void;
  onPointerLeave?: (event: React.PointerEvent<HTMLElement>) => void;
  onFocus?: (event: FocusEvent<HTMLElement>) => void;
  onBlur?: (event: FocusEvent<HTMLElement>) => void;
  'aria-describedby'?: string;
}

export interface TooltipProps {
  /** Short, plain-text description. Never put interactive content in a tooltip. */
  content: ReactNode;
  children: ReactElement;
  placement?: Placement;
  align?: Align;
  offset?: number;
  /** Hover delay in ms; keyboard focus shows the tooltip immediately. */
  delay?: number;
  className?: string;
}

/**
 * Describes its trigger via `aria-describedby`, appears on hover and on keyboard
 * focus, and closes on Escape so a tooltip can never trap a keyboard user.
 */
export function Tooltip({
  content,
  children,
  placement = 'top',
  align = 'center',
  offset = 8,
  delay = 200,
  className,
}: TooltipProps) {
  const triggerRef = useRef<HTMLElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const [open, setOpen] = useState(false);
  const tooltipId = `mors${useId()}-tooltip`;
  const { mounted, state } = usePresence(open, 150);

  const position = useAnchoredPosition({
    open,
    anchorRef: triggerRef,
    floatingRef: tooltipRef,
    placement,
    align,
    offset,
  });

  const show = useCallback(
    (immediate = false) => {
      clearTimeout(timerRef.current);
      if (immediate || delay === 0) setOpen(true);
      else timerRef.current = setTimeout(() => setOpen(true), delay);
    },
    [delay],
  );

  const hide = useCallback(() => {
    clearTimeout(timerRef.current);
    setOpen(false);
  }, []);

  useEffect(() => () => clearTimeout(timerRef.current), []);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === 'Escape') hide();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open, hide]);

  const trigger = isValidElement(children)
    ? cloneElement(children as ReactElement<TooltipTriggerProps>, {
        ref: triggerRef,
        'aria-describedby': mounted ? tooltipId : undefined,
        onPointerEnter: (event: React.PointerEvent<HTMLElement>) => {
          (children as ReactElement<TooltipTriggerProps>).props.onPointerEnter?.(event);
          if (event.pointerType !== 'touch') show();
        },
        onPointerLeave: (event: React.PointerEvent<HTMLElement>) => {
          (children as ReactElement<TooltipTriggerProps>).props.onPointerLeave?.(event);
          hide();
        },
        onFocus: (event: FocusEvent<HTMLElement>) => {
          (children as ReactElement<TooltipTriggerProps>).props.onFocus?.(event);
          show(true);
        },
        onBlur: (event: FocusEvent<HTMLElement>) => {
          (children as ReactElement<TooltipTriggerProps>).props.onBlur?.(event);
          hide();
        },
      })
    : children;

  return (
    <>
      {trigger}
      {mounted && (
        <Portal>
          <div
            ref={tooltipRef}
            id={tooltipId}
            role="tooltip"
            className={cx('mors-tooltip', className)}
            style={position.style}
            data-state={state}
            data-placement={position.placement}
          >
            {content}
          </div>
        </Portal>
      )}
    </>
  );
}
