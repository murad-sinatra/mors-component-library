import { useEffect, useLayoutEffect, useState } from 'react';
import { useReducedMotion } from './useReducedMotion';

export type PresenceState = 'open' | 'closed';

/**
 * Keeps an element mounted for the length of its exit transition so overlays can
 * animate out instead of vanishing. Opening mounts in a layout effect so
 * popovers can be measured before paint; entering still waits a frame so the
 * closed styles can apply. Honours `prefers-reduced-motion` by skipping delays.
 */
export function usePresence(
  open: boolean,
  duration = 160,
): { mounted: boolean; state: PresenceState } {
  const reducedMotion = useReducedMotion();
  const [mounted, setMounted] = useState(open);
  const [state, setState] = useState<PresenceState>(open ? 'open' : 'closed');

  useLayoutEffect(() => {
    if (!open) return;

    setMounted(true);
    if (reducedMotion) {
      setState('open');
      return;
    }

    setState('closed');
    let inner = 0;
    const outer = requestAnimationFrame(() => {
      inner = requestAnimationFrame(() => setState('open'));
    });
    return () => {
      cancelAnimationFrame(outer);
      cancelAnimationFrame(inner);
    };
  }, [open, reducedMotion]);

  useEffect(() => {
    if (open) return;
    setState('closed');
    if (reducedMotion) {
      setMounted(false);
      return;
    }
    const timer = setTimeout(() => setMounted(false), duration);
    return () => clearTimeout(timer);
  }, [open, duration, reducedMotion]);

  return { mounted, state };
}
