import { useId, useMemo, useRef } from 'react';
import type { Align, Placement } from '../../utils/types';
import { useAnchoredPosition } from '../../hooks/useAnchoredPosition';
import { usePresence } from '../../hooks/usePresence';

export function useFloatingSurface({
  open,
  placement,
  align,
  offset,
  matchWidth,
  duration = 160,
  idSuffix,
}: {
  open: boolean;
  placement?: Placement;
  align?: Align;
  offset?: number;
  matchWidth?: boolean;
  duration?: number;
  idSuffix: string;
}) {
  const anchorRef = useRef<HTMLElement>(null);
  const triggerRef = useRef<HTMLElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const panelId = `mors${useId()}-${idSuffix}`;
  const { mounted, state } = usePresence(open, duration);
  const position = useAnchoredPosition({
    open: open && mounted,
    anchorRef,
    floatingRef: panelRef,
    placement,
    align,
    offset,
    matchWidth,
  });
  const refs = useMemo(() => [anchorRef, panelRef] as const, [anchorRef, panelRef]);

  return {
    anchorRef,
    triggerRef,
    panelRef,
    panelId,
    mounted,
    state,
    position,
    refs,
  };
}
