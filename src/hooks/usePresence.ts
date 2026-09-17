import { useEffect, useState } from 'react';
import { useReducedMotion } from './useReducedMotion';

export type PresenceState = 'open' | 'closed';

/**
 * Keeps an element mounted for the length of its exit transition so overlays can
 * animate out instead of vanishing. Honours `prefers-reduced-motion` by
 * unmounting immediately.
 */
export function usePresence(
  open: boolean,
  duration = 220,
): { mounted: boolean; state: PresenceState } {
  const reducedMotion = useReducedMotion();
  const [mounted, setMounted] = useState(open);
  const [state, setState] = useState<PresenceState>(open ? 'open' : 'closed');

  useEffect(() => {
    if (open) {
      setMounted(true);
      const frame = requestAnimationFrame(() => setState('open'));
      return () => cancelAnimationFrame(frame);
    }

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
