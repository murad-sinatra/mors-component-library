import { useEffect } from 'react';

let lockCount = 0;
let restore: (() => void) | null = null;

/** Prevents background scrolling while a modal surface is open, nesting-safe. */
export function useScrollLock(active: boolean): void {
  useEffect(() => {
    if (!active) return;

    lockCount += 1;
    if (lockCount === 1) {
      const { body } = document;
      const previousOverflow = body.style.overflow;
      const previousPaddingRight = body.style.paddingRight;
      const viewport = document.documentElement.clientWidth;
      const scrollbar = viewport > 0 ? window.innerWidth - viewport : 0;

      body.style.overflow = 'hidden';
      // Compensate for the disappearing scrollbar so content does not shift.
      if (scrollbar > 0 && scrollbar < 40) body.style.paddingRight = `${scrollbar}px`;

      restore = () => {
        body.style.overflow = previousOverflow;
        body.style.paddingRight = previousPaddingRight;
      };
    }

    return () => {
      lockCount -= 1;
      if (lockCount === 0) {
        restore?.();
        restore = null;
      }
    };
  }, [active]);
}
