import { useRef, type InputHTMLAttributes, type ReactNode, type Ref } from 'react';
import { cx } from '../utils/cx';
import type { Size } from '../utils/types';
import { useControllableState } from '../hooks/useControllableState';
import { describedBy, Field, useFieldIds } from './Field';
import { Icon } from './Icon';

export interface NumberFieldProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    'size' | 'type' | 'value' | 'defaultValue' | 'onChange'
  > {
  label?: ReactNode;
  description?: ReactNode;
  error?: ReactNode;
  size?: Size;
  block?: boolean;
  value?: number | null;
  defaultValue?: number | null;
  onValueChange?: (value: number | null) => void;
  min?: number;
  max?: number;
  step?: number;
  /** Hide the plus/minus steppers and keep a plain numeric input. */
  hideSteppers?: boolean;
  ref?: Ref<HTMLInputElement>;
}

function clamp(value: number, min?: number, max?: number): number {
  let next = value;
  if (min !== undefined) next = Math.max(min, next);
  if (max !== undefined) next = Math.min(max, next);
  return next;
}

function parse(raw: string): number | null {
  if (raw.trim() === '') return null;
  const next = Number(raw);
  return Number.isFinite(next) ? next : null;
}

/**
 * Numeric entry with Apple-style steppers. The underlying control is a native
 * number input, so mobile keyboards and form serialization stay platform-native.
 */
export function NumberField({
  label,
  description,
  error,
  size = 'md',
  block = true,
  value,
  defaultValue = null,
  onValueChange,
  min,
  max,
  step = 1,
  hideSteppers = false,
  className,
  id,
  required,
  disabled,
  'aria-describedby': ariaDescribedBy,
  ...rest
}: NumberFieldProps) {
  const ids = useFieldIds(id);
  const inputRef = useRef<HTMLInputElement>(null);
  const [current, setCurrent] = useControllableState(value, defaultValue, onValueChange);

  const commit = (next: number | null) => {
    if (next === null) {
      setCurrent(null);
      return;
    }
    setCurrent(clamp(next, min, max));
  };

  const bump = (direction: 1 | -1) => {
    const base = current ?? 0;
    commit(base + direction * step);
    inputRef.current?.focus();
  };

  return (
    <Field
      ids={ids}
      label={label}
      description={description}
      error={error}
      required={required}
      size={size}
      block={block}
    >
      <div
        className={cx(
          'mors-input-shell',
          'mors-number-shell',
          disabled && 'mors-is-disabled',
          className,
        )}
      >
        {!hideSteppers && (
          <button
            type="button"
            className="mors-number-step mors-focusable"
            aria-label="Decrease"
            disabled={disabled || (min !== undefined && current !== null && current <= min)}
            onClick={() => bump(-1)}
            tabIndex={-1}
          >
            <Icon name="minus" />
          </button>
        )}
        <input
          ref={inputRef}
          id={ids.id}
          type="number"
          className="mors-input mors-number-input"
          disabled={disabled}
          required={required}
          min={min}
          max={max}
          step={step}
          value={current ?? ''}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy(ids, Boolean(description), Boolean(error), ariaDescribedBy)}
          onChange={(event) => commit(parse(event.currentTarget.value))}
          {...rest}
        />
        {!hideSteppers && (
          <button
            type="button"
            className="mors-number-step mors-focusable"
            aria-label="Increase"
            disabled={disabled || (max !== undefined && current !== null && current >= max)}
            onClick={() => bump(1)}
            tabIndex={-1}
          >
            <Icon name="plus" />
          </button>
        )}
      </div>
    </Field>
  );
}
