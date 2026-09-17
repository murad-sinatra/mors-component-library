import { useEffect, useState } from 'react';

const QUERY = '(prefers-reduced-motion: reduce)';

/** Mirrors the user's motion preference so JS-driven animation can opt out too. */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(
    () => typeof window !== 'undefined' && window.matchMedia?.(QUERY).matches === true,
  );

  useEffect(() => {
    const media = window.matchMedia?.(QUERY);
    if (!media) return;
    const onChange = (event: MediaQueryListEvent) => setReduced(event.matches);
    media.addEventListener('change', onChange);
    setReduced(media.matches);
    return () => media.removeEventListener('change', onChange);
  }, []);

  return reduced;
}
