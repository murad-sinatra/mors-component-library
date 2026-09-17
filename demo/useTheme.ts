import { useCallback, useEffect, useState } from 'react';

export type ThemeChoice = 'light' | 'dark';

const STORAGE_KEY = 'mors-demo-theme';

function preferredTheme(): ThemeChoice {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === 'light' || stored === 'dark') return stored;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

/**
 * Mirrors the chosen theme into `data-mors-theme` on <html> — the same one-line
 * integration the library documents for consumers.
 */
export function useTheme(): { theme: ThemeChoice; toggleTheme: () => void } {
  const [theme, setTheme] = useState<ThemeChoice>(preferredTheme);

  useEffect(() => {
    document.documentElement.dataset.morsTheme = theme;
    localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  const toggleTheme = useCallback(
    () => setTheme((current) => (current === 'dark' ? 'light' : 'dark')),
    [],
  );

  return { theme, toggleTheme };
}
