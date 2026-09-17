import { useEffect, type RefObject } from 'react';

export interface UseDismissOptions {
  enabled: boolean;
  onDismiss: () => void;
  /** Elements that should not count as "outside" (trigger, floating panel, …). */
  refs: readonly RefObject<HTMLElement | null>[];
  closeOnEscape?: boolean;
  closeOnOutsidePointer?: boolean;
}

/** Escape-key and outside-pointer dismissal shared by every overlay. */
export function useDismiss({
  enabled,
  onDismiss,
  refs,
  closeOnEscape = true,
  closeOnOutsidePointer = true,
}: UseDismissOptions): void {
  useEffect(() => {
    if (!enabled) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (closeOnEscape && event.key === 'Escape') {
        event.stopPropagation();
        onDismiss();
      }
    };

    const onPointerDown = (event: PointerEvent | MouseEvent) => {
      if (!closeOnOutsidePointer) return;
      const target = event.target as Node | null;
      if (!target) return;
      const inside = refs.some((ref) => ref.current?.contains(target));
      if (!inside) onDismiss();
    };

    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('pointerdown', onPointerDown, true);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('pointerdown', onPointerDown, true);
    };
  }, [enabled, onDismiss, refs, closeOnEscape, closeOnOutsidePointer]);
}
