import { useCallback, useEffect, useState } from 'react';

export type PaletteId = 'default' | 'farm';

export interface PaletteOption {
  id: PaletteId;
  label: string;
  shortLabel: string;
}

export const PALETTES: readonly PaletteOption[] = [
  { id: 'default', label: 'Default Theme', shortLabel: 'Default' },
  { id: 'farm', label: 'Farm Theme', shortLabel: 'Farm' },
] as const;

const STORAGE_KEY = 'mors-demo-palette';

function preferredPalette(): PaletteId {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === 'default' || stored === 'farm') return stored;
  return 'default';
}

/**
 * Mirrors the chosen palette into `data-mors-palette` on <html>. Each palette
 * is a CSS file under src/styles/themes that redefines the visual tokens.
 */
export function usePalette(): {
  palette: PaletteId;
  paletteOption: PaletteOption;
  setPalette: (next: PaletteId) => void;
} {
  const [palette, setPaletteState] = useState<PaletteId>(preferredPalette);

  useEffect(() => {
    document.documentElement.dataset.morsPalette = palette;
    localStorage.setItem(STORAGE_KEY, palette);
  }, [palette]);

  const setPalette = useCallback((next: PaletteId) => setPaletteState(next), []);

  const paletteOption = PALETTES.find((entry) => entry.id === palette) ?? PALETTES[0]!;

  return { palette, paletteOption, setPalette };
}
