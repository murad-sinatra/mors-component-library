import type { ReactNode } from 'react';
import { createPortal } from 'react-dom';

export interface PortalProps {
  children: ReactNode;
  /** Defaults to `document.body`. */
  container?: Element | null;
}

/**
 * Renders children outside the current DOM branch. Renders nothing on the
 * server; on the client the subtree is available in the same commit, which is
 * what lets overlays move focus into themselves immediately.
 */
export function Portal({ children, container }: PortalProps) {
  const target = container ?? (typeof document === 'undefined' ? null : document.body);
  if (!target) return null;
  return createPortal(children, target);
}
