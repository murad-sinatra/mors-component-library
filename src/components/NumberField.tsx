import { useRef, type InputHTMLAttributes, type Ref } from 'react';
import { cx } from '../utils/cx';
import { useControllableState } from '../hooks/useControllableState';
import { describedBy, Field, useFieldControl, type FieldShellProps } from './Field';
import { Icon, type IconName } from './Icon';

export interface NumberFieldProps
  extends Omit<
      InputHTMLAttributes<HTMLInputElement>,
      'size' | 'type' | 'value' | 'defaultValue' | 'onChange'
    >,
    FieldShellProps {
  value?: number | null;
  defaultValue?: number | null;
  onValueChange?: (value: number | null) => void;
  min?: number;
  max?: number;
  step?: number;
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

function StepperButton({
  label,
  icon,
  disabled,
  onClick,
}: {
  label: string;
  icon: IconName;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      className="mors-number-step mors-focusable"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      tabIndex={-1}
    >
      <Icon name={icon} />
    </button>
  );
}

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
  const { ids, validity } = useFieldControl(id, required, error);
  const inputRef = useRef<HTMLInputElement>(null);
  const [current, setCurrent] = useControllableState(value, defaultValue, onValueChange);

  const commit = (next: number | null) => {
    if (next === null) {
      setCurrent(null);
      return;
    }
    const clamped = clamp(next, min, max);
    setCurrent(clamped);
    validity.reportValue(String(clamped));
  };

  const bump = (direction: 1 | -1) => {
    commit((current ?? 0) + direction * step);
    inputRef.current?.focus();
  };

  return (
    <Field
      ids={ids}
      label={label}
      description={description}
      error={validity.error}
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
          <StepperButton
            label="Decrease"
            icon="minus"
            disabled={disabled || (min !== undefined && current !== null && current <= min)}
            onClick={() => bump(-1)}
          />
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
          aria-invalid={validity.error ? true : undefined}
          aria-describedby={describedBy(ids, Boolean(description), Boolean(validity.error), ariaDescribedBy)}
          {...rest}
          onInvalid={validity.onInvalid}
          onChange={(event) => commit(parse(event.currentTarget.value))}
        />
        {!hideSteppers && (
          <StepperButton
            label="Increase"
            icon="plus"
            disabled={disabled || (max !== undefined && current !== null && current >= max)}
            onClick={() => bump(1)}
          />
        )}
      </div>
    </Field>
  );
}
