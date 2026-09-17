import type { ReactNode, Ref } from 'react';

/**
 * Always-present DOM node to measure against. Popover/Menu/Tooltip triggers are
 * often custom components; cloning a `ref` onto them is not reliable, so
 * placement uses this wrapper instead.
 */
export function Anchor({
  ref,
  children,
}: {
  ref: Ref<HTMLElement | null>;
  children: ReactNode;
}) {
  return (
    <span ref={ref} className="mors-floating-anchor">
      {children}
    </span>
  );
}
