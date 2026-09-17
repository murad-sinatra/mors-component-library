/** Falsy members exist so `condition && 'class'` expressions type-check. */
export type ClassValue = string | number | bigint | boolean | null | undefined;

/** Joins truthy class name fragments. Keeps component code free of ternary noise. */
export function cx(...values: ClassValue[]): string {
  let out = '';
  for (const value of values) {
    if (!value && value !== 0) continue;
    out = out ? `${out} ${value}` : String(value);
  }
  return out;
}
