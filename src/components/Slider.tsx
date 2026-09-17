import type { InputHTMLAttributes, ReactNode, Ref } from 'react';
import { cx } from '../utils/cx';
import type { Size } from '../utils/types';
import { useControllableState } from '../hooks/useControllableState';
import { describedBy, Field, useFieldIds } from './Field';

export interface SliderProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'type' | 'value' | 'defaultValue' | 'onChange'> {
  label?: ReactNode;
  description?: ReactNode;
  error?: ReactNode;
  size?: Exclude<Size, 'lg'>;
  min?: number;
  max?: number;
  step?: number;
  value?: number;
  defaultValue?: number;
  onValueChange?: (value: number) => void;
  showValue?: boolean;
  formatValue?: (value: number) => string;
  ref?: Ref<HTMLInputElement>;
}

export function Slider({
  label,
  description,
  error,
  size = 'md',
  min = 0,
  max = 100,
  step = 1,
  value,
  defaultValue = min,
  onValueChange,
  showValue = false,
  formatValue,
  className,
  id,
  disabled,
  'aria-describedby': ariaDescribedBy,
  ...rest
}: SliderProps) {
  const ids = useFieldIds(id);
  const [current, setCurrent] = useControllableState(value, defaultValue, onValueChange);
  const percent = max === min ? 0 : ((current - min) / (max - min)) * 100;

  return (
    <Field
      ids={ids}
      label={
        label && (showValue || formatValue) ? (
          <span className="mors-slider-label-row">
            <span>{label}</span>
            <span className="mors-slider-value">{formatValue ? formatValue(current) : current}</span>
          </span>
        ) : (
          label
        )
      }
      description={description}
      error={error}
      size={size === 'sm' ? 'sm' : 'md'}
    >
      <div
        className={cx('mors-slider', size !== 'md' && `mors-slider--${size}`, disabled && 'mors-is-disabled', className)}
        style={{ ['--mors-slider-percent' as string]: `${percent}%` }}
      >
        <input
          id={ids.id}
          type="range"
          className="mors-slider-input"
          min={min}
          max={max}
          step={step}
          value={current}
          disabled={disabled}
          aria-invalid={error ? true : undefined}
          aria-valuetext={formatValue ? formatValue(current) : undefined}
          aria-describedby={describedBy(ids, Boolean(description), Boolean(error), ariaDescribedBy)}
          onChange={(event) => setCurrent(Number(event.currentTarget.value))}
          {...rest}
        />
      </div>
    </Field>
  );
}
