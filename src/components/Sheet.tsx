import { useCallback, useId, useMemo, useRef, useState, type PointerEvent, type ReactNode } from 'react';
import { cx } from '../utils/cx';
import { useControllableState } from '../hooks/useControllableState';
import { useDismiss } from '../hooks/useDismiss';
import { useFocusTrap } from '../hooks/useFocusTrap';
import { usePresence } from '../hooks/usePresence';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { useScrollLock } from '../hooks/useScrollLock';
import { Portal } from './Portal';
import { IconButton } from './Button';
import { Icon } from './Icon';

export type SheetSnap = 'peek' | 'half' | 'full';

const SNAP_RATIO: Record<SheetSnap, number> = {
  peek: 0.32,
  half: 0.5,
  full: 0.92,
};

function snapHeight(snap: SheetSnap, viewport: number): number {
  return Math.round(viewport * SNAP_RATIO[snap]);
}

function nearestSnap(height: number, snaps: readonly SheetSnap[], viewport: number): SheetSnap {
  let best = snaps[0] ?? 'half';
  let bestDelta = Infinity;
  for (const snap of snaps) {
    const delta = Math.abs(snapHeight(snap, viewport) - height);
    if (delta < bestDelta) {
      best = snap;
      bestDelta = delta;
    }
  }
  return best;
}

const DEFAULT_SNAPS: readonly SheetSnap[] = ['peek', 'half', 'full'];

export interface SheetProps {
  open: boolean;
  onClose: () => void;
  snap?: SheetSnap;
  defaultSnap?: SheetSnap;
  onSnapChange?: (snap: SheetSnap) => void;
  snaps?: readonly SheetSnap[];
  title?: ReactNode;
  description?: ReactNode;
  footer?: ReactNode;
  children?: ReactNode;
  ariaLabel?: string;
  showCloseButton?: boolean;
  className?: string;
}

/**
 * Bottom sheet with a grabber, drag-to-dismiss and snap points. Distinct from
 * Drawer: the height is interactive, not a fixed slide-in panel.
 */
export function Sheet({
  open,
  onClose,
  snap,
  defaultSnap = 'half',
  onSnapChange,
  snaps = DEFAULT_SNAPS,
  title,
  description,
  footer,
  children,
  ariaLabel,
  showCloseButton = false,
  className,
}: SheetProps) {
  const surfaceRef = useRef<HTMLDivElement>(null);
  const refs = useMemo(() => [surfaceRef], [surfaceRef]);
  const baseId = useId();
  const titleId = `mors${baseId}-sheet-title`;
  const descriptionId = `mors${baseId}-sheet-description`;
  const { mounted, state } = usePresence(open, 320);
  const reducedMotion = useReducedMotion();
  const [currentSnap, setCurrentSnap] = useControllableState(snap, defaultSnap, onSnapChange);
  const [dragHeight, setDragHeight] = useState<number | null>(null);
  const drag = useRef<{ startY: number; startH: number } | null>(null);

  useScrollLock(open);
  useFocusTrap(surfaceRef, open && mounted);
  useDismiss({
    enabled: open,
    onDismiss: onClose,
    refs,
    closeOnOutsidePointer: false,
  });

  const onPointerDown = useCallback((event: PointerEvent<HTMLElement>) => {
    if (event.button !== 0) return;
    if ((event.target as HTMLElement).closest('button')) return;
    const node = surfaceRef.current;
    if (!node) return;
    node.setPointerCapture(event.pointerId);
    drag.current = { startY: event.clientY, startH: node.getBoundingClientRect().height };
    setDragHeight(drag.current.startH);
  }, []);

  const onPointerMove = useCallback((event: PointerEvent<HTMLElement>) => {
    if (!drag.current) return;
    const viewport = window.innerHeight;
    const max = snapHeight('full', viewport);
    const next = Math.min(max, Math.max(72, drag.current.startH + (drag.current.startY - event.clientY)));
    setDragHeight(next);
  }, []);

  const onPointerUp = useCallback(
    (event: PointerEvent<HTMLElement>) => {
      if (!drag.current) return;
      const viewport = window.innerHeight;
      const height = dragHeight ?? drag.current.startH;
      drag.current = null;
      setDragHeight(null);
      event.currentTarget.releasePointerCapture?.(event.pointerId);

      const peek = snapHeight(snaps.includes('peek') ? 'peek' : (snaps[0] ?? 'half'), viewport);
      if (height < peek * 0.6) {
        onClose();
        return;
      }
      setCurrentSnap(nearestSnap(height, snaps, viewport));
    },
    [dragHeight, onClose, setCurrentSnap, snaps],
  );

  if (!mounted) return null;

  const viewport = typeof window === 'undefined' ? 800 : window.innerHeight;
  const height = dragHeight ?? snapHeight(currentSnap, viewport);

  return (
    <Portal>
      <div className={cx('mors-overlay', 'mors-sheet-overlay', className)} data-state={state}>
        <div className="mors-scrim" data-state={state} onClick={onClose} />
        <div
          ref={surfaceRef}
          className={cx('mors-sheet', dragHeight !== null && 'mors-sheet--dragging')}
          style={{
            height,
            transition: reducedMotion || dragHeight !== null ? 'none' : undefined,
          }}
          data-state={state}
          role="dialog"
          aria-modal="true"
          aria-label={title ? undefined : ariaLabel}
          aria-labelledby={title ? titleId : undefined}
          aria-describedby={description ? descriptionId : undefined}
          tabIndex={-1}
        >
          <div
            className="mors-sheet-handle"
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
          >
            <span className="mors-sheet-grabber" aria-hidden="true" />
            <span className="mors-visually-hidden">Drag to resize</span>
          </div>
          {(title || description || showCloseButton) && (
            <header
              className="mors-sheet-header"
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onPointerCancel={onPointerUp}
            >
              <div className="mors-sheet-heading">
                {title && (
                  <h2 className="mors-sheet-title" id={titleId}>
                    {title}
                  </h2>
                )}
                {description && (
                  <p className="mors-sheet-description" id={descriptionId}>
                    {description}
                  </p>
                )}
              </div>
              {showCloseButton && (
                <IconButton
                  className="mors-sheet-close mors-close"
                  label="Close"
                  icon={<Icon name="close" />}
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                />
              )}
            </header>
          )}
          {children != null && <div className="mors-sheet-body">{children}</div>}
          {footer && <footer className="mors-sheet-footer">{footer}</footer>}
        </div>
      </div>
    </Portal>
  );
}
