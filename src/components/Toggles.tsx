import {
  createContext,
  useContext,
  useMemo,
  type InputHTMLAttributes,
  type ReactNode,
  type Ref,
} from 'react';
import { cx } from '../utils/cx';
import type { Size } from '../utils/types';
import { describedBy, useFieldIds } from './Field';
import { Icon } from './Icon';

interface ToggleShellProps {
  label?: ReactNode;
  description?: ReactNode;
  error?: ReactNode;
  size?: Exclude<Size, 'lg'>;
  /** Puts the control after the label, e.g. in settings rows. */
  labelPosition?: 'end' | 'start';
}

function ToggleRow({
  ids,
  className,
  size,
  labelPosition,
  disabled,
  control,
  label,
  description,
  error,
}: {
  ids: ReturnType<typeof useFieldIds>;
  className?: string;
  size: 'sm' | 'md';
  labelPosition: 'end' | 'start';
  disabled?: boolean;
  control: ReactNode;
  label?: ReactNode;
  description?: ReactNode;
  error?: ReactNode;
}) {
  return (
    <div
      className={cx(
        'mors-toggle',
        `mors-toggle--${size}`,
        labelPosition === 'start' && 'mors-toggle--label-start',
        disabled && 'mors-is-disabled',
        error && 'mors-toggle--invalid',
        className,
      )}
    >
      {/* The label wraps only the control and its name so the accessible name
          never absorbs the description text. */}
      <label className="mors-toggle-row" htmlFor={ids.id}>
        {control}
        {label && <span className="mors-toggle-label">{label}</span>}
      </label>
      {description && (
        <p className="mors-toggle-description" id={ids.descriptionId}>
          {description}
        </p>
      )}
      {error && (
        <p className="mors-field-error" id={ids.errorId}>
          {error}
        </p>
      )}
    </div>
  );
}

export interface CheckboxProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'>,
    ToggleShellProps {
  /** Renders the mixed state; pairs with `aria-checked="mixed"`. */
  indeterminate?: boolean;
  ref?: Ref<HTMLInputElement>;
}

export function Checkbox({
  label,
  description,
  error,
  size = 'md',
  labelPosition = 'end',
  indeterminate = false,
  className,
  id,
  disabled,
  'aria-describedby': ariaDescribedBy,
  ...rest
}: CheckboxProps) {
  const ids = useFieldIds(id);
  return (
    <ToggleRow
      ids={ids}
      className={className}
      size={size}
      labelPosition={labelPosition}
      disabled={disabled}
      label={label}
      description={description}
      error={error}
      control={
        <>
          <input
            id={ids.id}
            type="checkbox"
            className="mors-checkbox-input mors-visually-hidden"
            disabled={disabled}
            aria-invalid={error ? true : undefined}
            aria-checked={indeterminate ? 'mixed' : undefined}
            aria-describedby={describedBy(
              ids,
              Boolean(description),
              Boolean(error),
              ariaDescribedBy,
            )}
            {...rest}
          />
          <span className="mors-checkbox-box" aria-hidden="true">
            <Icon name={indeterminate ? 'minus' : 'check'} className="mors-checkbox-mark" />
          </span>
        </>
      }
    />
  );
}

export interface RadioProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'>,
    ToggleShellProps {
  ref?: Ref<HTMLInputElement>;
}

const RadioGroupContext = createContext<{ name?: string } | null>(null);

export function Radio({
  label,
  description,
  error,
  size = 'md',
  labelPosition = 'end',
  className,
  id,
  name,
  disabled,
  'aria-describedby': ariaDescribedBy,
  ...rest
}: RadioProps) {
  const ids = useFieldIds(id);
  const group = useContext(RadioGroupContext);
  return (
    <ToggleRow
      ids={ids}
      className={className}
      size={size}
      labelPosition={labelPosition}
      disabled={disabled}
      label={label}
      description={description}
      error={error}
      control={
        <>
          <input
            id={ids.id}
            type="radio"
            name={name ?? group?.name}
            className="mors-radio-input mors-visually-hidden"
            disabled={disabled}
            aria-describedby={describedBy(
              ids,
              Boolean(description),
              Boolean(error),
              ariaDescribedBy,
            )}
            {...rest}
          />
          <span className="mors-radio-dot" aria-hidden="true" />
        </>
      }
    />
  );
}

export interface RadioGroupProps {
  /** Applied to every nested Radio that does not set its own `name`. */
  name: string;
  legend?: ReactNode;
  description?: ReactNode;
  error?: ReactNode;
  orientation?: 'vertical' | 'horizontal';
  className?: string;
  children: ReactNode;
}

export function RadioGroup({
  name,
  legend,
  description,
  error,
  orientation = 'vertical',
  className,
  children,
}: RadioGroupProps) {
  const ids = useFieldIds();
  const group = useMemo(() => ({ name }), [name]);
  return (
    <fieldset
      className={cx('mors-radio-group', `mors-radio-group--${orientation}`, className)}
      aria-describedby={describedBy(ids, Boolean(description), Boolean(error))}
      aria-invalid={error ? true : undefined}
    >
      {legend && <legend className="mors-field-label mors-radio-group-legend">{legend}</legend>}
      {description && (
        <p className="mors-field-description" id={ids.descriptionId}>
          {description}
        </p>
      )}
      <div className="mors-radio-group-options">
        <RadioGroupContext value={group}>{children}</RadioGroupContext>
      </div>
      {error && (
        <p className="mors-field-error" id={ids.errorId}>
          {error}
        </p>
      )}
    </fieldset>
  );
}

export interface SwitchProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'>,
    ToggleShellProps {
  ref?: Ref<HTMLInputElement>;
}

export function Switch({
  label,
  description,
  error,
  size = 'md',
  labelPosition = 'end',
  className,
  id,
  disabled,
  'aria-describedby': ariaDescribedBy,
  ...rest
}: SwitchProps) {
  const ids = useFieldIds(id);
  return (
    <ToggleRow
      ids={ids}
      className={cx('mors-toggle--switch', className)}
      size={size}
      labelPosition={labelPosition}
      disabled={disabled}
      label={label}
      description={description}
      error={error}
      control={
        <>
          <input
            id={ids.id}
            type="checkbox"
            role="switch"
            className="mors-switch-input mors-visually-hidden"
            disabled={disabled}
            aria-invalid={error ? true : undefined}
            aria-describedby={describedBy(
              ids,
              Boolean(description),
              Boolean(error),
              ariaDescribedBy,
            )}
            {...rest}
          />
          <span className="mors-switch-track" aria-hidden="true">
            <span className="mors-switch-thumb" />
          </span>
        </>
      }
    />
  );
}
