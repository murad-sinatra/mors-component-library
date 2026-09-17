import type { Ref, RefCallback } from 'react';

/** Writes a value into a callback ref or a ref object. */
export function assignRef<T>(ref: Ref<T> | undefined, value: T | null): void {
  if (!ref) return;
  if (typeof ref === 'function') {
    ref(value);
    return;
  }
  ref.current = value;
}

/** Runs every ref with the same node so cloneElement can keep a consumer's ref. */
export function composeRefs<T>(...refs: Array<Ref<T> | undefined>): RefCallback<T> {
  return (node) => {
    for (const ref of refs) assignRef(ref, node);
  };
}
