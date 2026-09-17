import {
  useRef,
  useState,
  type InputHTMLAttributes,
  type ReactNode,
  type Ref,
  type SelectHTMLAttributes,
  type TextareaHTMLAttributes,
} from 'react';
import { cx } from '../utils/cx';
import type { Size } from '../utils/types';
import { describedBy, Field, useFieldIds } from './Field';
import { Icon } from './Icon';
import { IconButton } from './Button';

interface FieldShellProps {
  label?: ReactNode;
  description?: ReactNode;
  error?: ReactNode;
  size?: Size;
  /** Fills the available width (default). Set `false` for inline layouts. */
  block?: boolean;
}

export interface TextFieldProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'>,
    FieldShellProps {
  startIcon?: ReactNode;
  /** Trailing adornment: an icon, unit label or small control. */
  endAdornment?: ReactNode;
  ref?: Ref<HTMLInputElement>;
}

export function TextField({
  label,
  description,
  error,
  size = 'md',
  block = true,
  startIcon,
  endAdornment,
  className,
  id,
  required,
  disabled,
  'aria-describedby': ariaDescribedBy,
  ...rest
}: TextFieldProps) {
  const ids = useFieldIds(id);
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
      <div className={cx('mors-input-shell', disabled && 'mors-is-disabled', className)}>
        {startIcon && <span className="mors-input-affix mors-input-affix--start">{startIcon}</span>}
        <input
          id={ids.id}
          className="mors-input"
          disabled={disabled}
          required={required}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy(ids, Boolean(description), Boolean(error), ariaDescribedBy)}
          {...rest}
        />
        {endAdornment && (
          <span className="mors-input-affix mors-input-affix--end">{endAdornment}</span>
        )}
      </div>
    </Field>
  );
}

export interface TextareaProps
  extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'size'>,
    FieldShellProps {
  /** Vertical resize affordance. Defaults to `vertical`. */
  resize?: 'none' | 'vertical';
  ref?: Ref<HTMLTextAreaElement>;
}

export function Textarea({
  label,
  description,
  error,
  size = 'md',
  block = true,
  resize = 'vertical',
  rows = 4,
  className,
  id,
  required,
  disabled,
  'aria-describedby': ariaDescribedBy,
  ...rest
}: TextareaProps) {
  const ids = useFieldIds(id);
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
      <div className={cx('mors-input-shell mors-input-shell--textarea', disabled && 'mors-is-disabled', className)}>
        <textarea
          id={ids.id}
          className={cx('mors-input', 'mors-textarea', `mors-textarea--resize-${resize}`)}
          rows={rows}
          disabled={disabled}
          required={required}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy(ids, Boolean(description), Boolean(error), ariaDescribedBy)}
          {...rest}
        />
      </div>
    </Field>
  );
}

export interface SelectOption {
  label: string;
  value: string;
  disabled?: boolean;
}

export interface SelectProps
  extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'size' | 'children'>,
    FieldShellProps {
  options: readonly SelectOption[];
  /** Shown as a disabled first option when no value is selected. */
  placeholder?: string;
  ref?: Ref<HTMLSelectElement>;
}

export function Select({
  label,
  description,
  error,
  size = 'md',
  block = true,
  options,
  placeholder,
  className,
  id,
  required,
  disabled,
  'aria-describedby': ariaDescribedBy,
  ...rest
}: SelectProps) {
  const ids = useFieldIds(id);
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
      <div className={cx('mors-input-shell mors-input-shell--select', disabled && 'mors-is-disabled', className)}>
        <select
          id={ids.id}
          className="mors-input mors-select"
          disabled={disabled}
          required={required}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy(ids, Boolean(description), Boolean(error), ariaDescribedBy)}
          {...rest}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value} disabled={option.disabled}>
              {option.label}
            </option>
          ))}
        </select>
        <Icon name="chevron-down" className="mors-select-arrow" />
      </div>
    </Field>
  );
}

export interface SearchFieldProps extends Omit<TextFieldProps, 'startIcon' | 'endAdornment' | 'type'> {
  /** Called when the clear button is pressed or Escape clears the input. */
  onClear?: () => void;
  /** Fires on Enter, so the field works inside or outside a form. */
  onSearch?: (value: string) => void;
  clearLabel?: string;
}

export function SearchField({
  onClear,
  onSearch,
  clearLabel = 'Clear search',
  value,
  defaultValue,
  onChange,
  onKeyDown,
  size = 'md',
  ...rest
}: SearchFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [hasText, setHasText] = useState(() => String(defaultValue ?? '').length > 0);
  const hasValue = value === undefined ? hasText : String(value).length > 0;

  const clear = () => {
    if (inputRef.current) inputRef.current.value = '';
    setHasText(false);
    onClear?.();
    inputRef.current?.focus();
  };

  return (
    <TextField
      ref={inputRef}
      type="search"
      size={size}
      value={value}
      defaultValue={defaultValue}
      onChange={(event) => {
        setHasText(event.currentTarget.value.length > 0);
        onChange?.(event);
      }}
      startIcon={<Icon name="search" />}
      endAdornment={
        hasValue ? (
          <IconButton
            label={clearLabel}
            icon={<Icon name="close" />}
            size="sm"
            variant="ghost"
            onClick={clear}
            tabIndex={-1}
          />
        ) : undefined
      }
      onKeyDown={(event) => {
        onKeyDown?.(event);
        if (event.defaultPrevented) return;
        if (event.key === 'Enter') onSearch?.(event.currentTarget.value);
        if (event.key === 'Escape' && hasValue) {
          event.preventDefault();
          clear();
        }
      }}
      {...rest}
    />
  );
}
