import { useCallback, useEffect, useLayoutEffect, useState, type RefObject } from 'react';
import type { Align, Placement } from '../utils/types';

export interface UseAnchoredPositionOptions {
  open: boolean;
  anchorRef: RefObject<HTMLElement | null>;
  floatingRef: RefObject<HTMLElement | null>;
  placement?: Placement;
  align?: Align;
  /** Gap between anchor and floating element, in px. */
  offset?: number;
  /** Minimum distance kept from the viewport edge, in px. */
  padding?: number;
}

export interface AnchoredPosition {
  style: { position: 'fixed'; top: number; left: number };
  placement: Placement;
}

const OPPOSITE: Record<Placement, Placement> = {
  top: 'bottom',
  bottom: 'top',
  left: 'right',
  right: 'left',
};

function computeCoords(
  anchor: DOMRect,
  floating: { width: number; height: number },
  placement: Placement,
  align: Align,
  offset: number,
): { top: number; left: number } {
  const vertical = placement === 'top' || placement === 'bottom';
  const mainStart =
    placement === 'bottom'
      ? anchor.bottom + offset
      : placement === 'top'
        ? anchor.top - floating.height - offset
        : placement === 'right'
          ? anchor.right + offset
          : anchor.left - floating.width - offset;

  const anchorLength = vertical ? anchor.width : anchor.height;
  const floatingLength = vertical ? floating.width : floating.height;
  const crossBase = vertical ? anchor.left : anchor.top;
  const crossStart =
    align === 'start'
      ? crossBase
      : align === 'end'
        ? crossBase + anchorLength - floatingLength
        : crossBase + (anchorLength - floatingLength) / 2;

  return vertical
    ? { top: mainStart, left: crossStart }
    : { top: crossStart, left: mainStart };
}

/**
 * Viewport-aware fixed positioning for popovers, menus and tooltips: flips to
 * the opposite side when the preferred side does not fit, then clamps the cross
 * axis inside the viewport. Recomputes on scroll, resize and content changes.
 */
export function useAnchoredPosition({
  open,
  anchorRef,
  floatingRef,
  placement = 'bottom',
  align = 'center',
  offset = 8,
  padding = 8,
}: UseAnchoredPositionOptions): AnchoredPosition {
  const [position, setPosition] = useState<AnchoredPosition>({
    style: { position: 'fixed', top: 0, left: 0 },
    placement,
  });

  const update = useCallback(() => {
    const anchor = anchorRef.current;
    const floating = floatingRef.current;
    if (!anchor || !floating) return;

    const anchorRect = anchor.getBoundingClientRect();
    const size = { width: floating.offsetWidth, height: floating.offsetHeight };
    const viewport = { width: window.innerWidth, height: window.innerHeight };

    let resolved = placement;
    let coords = computeCoords(anchorRect, size, resolved, align, offset);

    const overflows =
      coords.top < padding ||
      coords.left < padding ||
      coords.top + size.height > viewport.height - padding ||
      coords.left + size.width > viewport.width - padding;

    if (overflows) {
      const flipped = computeCoords(anchorRect, size, OPPOSITE[resolved], align, offset);
      const fitsFlipped =
        flipped.top >= padding &&
        flipped.left >= padding &&
        flipped.top + size.height <= viewport.height - padding &&
        flipped.left + size.width <= viewport.width - padding;
      if (fitsFlipped) {
        resolved = OPPOSITE[resolved];
        coords = flipped;
      }
    }

    coords.left = Math.min(
      Math.max(padding, coords.left),
      Math.max(padding, viewport.width - size.width - padding),
    );
    coords.top = Math.min(
      Math.max(padding, coords.top),
      Math.max(padding, viewport.height - size.height - padding),
    );

    setPosition((prev) =>
      prev.style.top === coords.top && prev.style.left === coords.left && prev.placement === resolved
        ? prev
        : { style: { position: 'fixed', top: coords.top, left: coords.left }, placement: resolved },
    );
  }, [anchorRef, floatingRef, placement, align, offset, padding]);

  useLayoutEffect(() => {
    if (open) update();
  }, [open, update]);

  useEffect(() => {
    if (!open) return;
    const onChange = () => update();
    window.addEventListener('scroll', onChange, true);
    window.addEventListener('resize', onChange);

    const floating = floatingRef.current;
    const observer =
      typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(() => update());
    if (floating && observer) observer.observe(floating);

    return () => {
      window.removeEventListener('scroll', onChange, true);
      window.removeEventListener('resize', onChange);
      observer?.disconnect();
    };
  }, [open, update, floatingRef]);

  return position;
}
