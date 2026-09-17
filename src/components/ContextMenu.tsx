import {
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
  type PointerEvent,
  type ReactNode,
} from 'react';
import { cx } from '../utils/cx';
import { usePresence } from '../hooks/usePresence';
import { useDismiss } from '../hooks/useDismiss';
import { Portal } from './Portal';
import { MenuContext } from './Menu';

const LONG_PRESS_MS = 520;
const MOVE_CANCEL_PX = 10;

export interface ContextMenuProps {
  menu: ReactNode;
  children: ReactNode;
  disabled?: boolean;
  className?: string;
}

/**
 * Right-click (and long-press on touch) menu. Items are the same MenuItem /
 * MenuSeparator / MenuLabel components used by Menu.
 */
export function ContextMenu({ menu, children, disabled = false, className }: ContextMenuProps) {
  const [open, setOpen] = useState(false);
  const [point, setPoint] = useState({ x: 0, y: 0 });
  const panelRef = useRef<HTMLDivElement>(null);
  const anchorRef = useRef<HTMLDivElement>(null);
  const longPress = useRef<number | undefined>(undefined);
  const start = useRef<{ x: number; y: number } | null>(null);
  const { mounted, state } = usePresence(open, 160);
  const refs = [anchorRef, panelRef] as const;

  const close = useCallback(() => setOpen(false), []);
  useDismiss({ enabled: open, onDismiss: close, refs });

  const openAt = (x: number, y: number) => {
    if (disabled) return;
    setPoint({ x, y });
    setOpen(true);
  };

  const clearLongPress = () => {
    if (longPress.current) window.clearTimeout(longPress.current);
    longPress.current = undefined;
    start.current = null;
  };

  useLayoutEffect(() => {
    if (!mounted || !panelRef.current) return;
    const rect = panelRef.current.getBoundingClientRect();
    let x = point.x;
    let y = point.y;
    const pad = 8;
    if (x + rect.width > window.innerWidth - pad) x = window.innerWidth - rect.width - pad;
    if (y + rect.height > window.innerHeight - pad) y = window.innerHeight - rect.height - pad;
    panelRef.current.style.left = `${Math.max(pad, x)}px`;
    panelRef.current.style.top = `${Math.max(pad, y)}px`;
  }, [mounted, point]);

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (disabled || event.pointerType === 'mouse') return;
    start.current = { x: event.clientX, y: event.clientY };
    longPress.current = window.setTimeout(() => {
      if (!start.current) return;
      openAt(start.current.x, start.current.y);
      clearLongPress();
    }, LONG_PRESS_MS);
  };

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!start.current) return;
    const dx = event.clientX - start.current.x;
    const dy = event.clientY - start.current.y;
    if (dx * dx + dy * dy > MOVE_CANCEL_PX * MOVE_CANCEL_PX) clearLongPress();
  };

  return (
    <>
      <div
        ref={anchorRef}
        className={cx('mors-context-anchor', className)}
        onContextMenu={(event) => {
          if (disabled) return;
          event.preventDefault();
          clearLongPress();
          openAt(event.clientX, event.clientY);
        }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={clearLongPress}
        onPointerCancel={clearLongPress}
        onPointerLeave={clearLongPress}
      >
        {children}
      </div>
      {mounted && (
        <Portal>
          <div
            ref={panelRef}
            role="menu"
            tabIndex={-1}
            aria-orientation="vertical"
            className="mors-menu mors-context-menu"
            data-state={state}
            style={{ position: 'fixed', top: point.y, left: point.x }}
          >
            <MenuContext value={{ close }}>{menu}</MenuContext>
          </div>
        </Portal>
      )}
    </>
  );
}
