import { useEffect, type RefObject } from 'react';
import { getFocusable } from '../utils/focus';

/**
 * Confines Tab navigation to `containerRef` while active and returns focus to
 * whatever was focused beforehand on deactivation.
 */
export function useFocusTrap(containerRef: RefObject<HTMLElement | null>, active: boolean): void {
  useEffect(() => {
    if (!active) return;
    const container = containerRef.current;
    if (!container) return;

    const previous = document.activeElement as HTMLElement | null;
    const initial = container.querySelector<HTMLElement>('[data-mors-autofocus]');
    (initial ?? getFocusable(container)[0] ?? container).focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return;
      const focusable = getFocusable(container);
      if (focusable.length === 0) {
        event.preventDefault();
        return;
      }
      const first = focusable[0]!;
      const last = focusable[focusable.length - 1]!;
      const focused = document.activeElement;

      if (event.shiftKey && (focused === first || !container.contains(focused))) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && focused === last) {
        event.preventDefault();
        first.focus();
      }
    };

    container.addEventListener('keydown', onKeyDown);
    return () => {
      container.removeEventListener('keydown', onKeyDown);
      previous?.focus?.();
    };
  }, [containerRef, active]);
}
