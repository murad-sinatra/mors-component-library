import { useCallback, useEffect, useState } from 'react';

export interface PaletteOption {
  id: string;
  label: string;
  shortLabel: string;
}

export const PALETTES = [
  { id: 'default', label: 'Default Theme', shortLabel: 'Default' },
  { id: 'farm', label: 'Farm Theme', shortLabel: 'Farm' },
  { id: 'cyberpunk', label: 'Cyberpunk Theme', shortLabel: 'Cyberpunk' },
  { id: 'retro', label: 'Retro Theme', shortLabel: 'Retro' },
  { id: 'modern', label: 'Modern Theme', shortLabel: 'Modern' },
] as const;

export type PaletteId = (typeof PALETTES)[number]['id'];

const STORAGE_KEY = 'mors-demo-palette';

function isPaletteId(value: string | null): value is PaletteId {
  return PALETTES.some((entry) => entry.id === value);
}

function preferredPalette(): PaletteId {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (isPaletteId(stored)) return stored;
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
