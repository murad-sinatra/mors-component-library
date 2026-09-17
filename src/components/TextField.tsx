import {
  useRef,
  useState,
  type InputHTMLAttributes,
  type ReactNode,
  type Ref,
  type TextareaHTMLAttributes,
} from 'react';
import { cx } from '../utils/cx';
import { describedBy, Field, useFieldControl, type FieldShellProps } from './Field';
import { Icon } from './Icon';
import { IconButton } from './Button';

export interface TextFieldProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'>,
    FieldShellProps {
  startIcon?: ReactNode;
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
  onChange,
  onInvalid,
  'aria-describedby': ariaDescribedBy,
  ...rest
}: TextFieldProps) {
  const { ids, validity } = useFieldControl(id, required, error);
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
      <div className={cx('mors-input-shell', disabled && 'mors-is-disabled', className)}>
        {startIcon && <span className="mors-input-affix mors-input-affix--start">{startIcon}</span>}
        <input
          id={ids.id}
          className="mors-input"
          disabled={disabled}
          required={required}
          aria-invalid={validity.error ? true : undefined}
          aria-describedby={describedBy(
            ids,
            Boolean(description),
            Boolean(validity.error),
            ariaDescribedBy,
          )}
          {...rest}
          onInvalid={(event) => {
            validity.onInvalid(event);
            onInvalid?.(event);
          }}
          onChange={(event) => {
            validity.reportValue(event.currentTarget.value);
            onChange?.(event);
          }}
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
  onChange,
  onInvalid,
  'aria-describedby': ariaDescribedBy,
  ...rest
}: TextareaProps) {
  const { ids, validity } = useFieldControl(id, required, error);
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
      <div className={cx('mors-input-shell mors-input-shell--textarea', disabled && 'mors-is-disabled', className)}>
        <textarea
          id={ids.id}
          className={cx('mors-input', 'mors-textarea', `mors-textarea--resize-${resize}`)}
          rows={rows}
          disabled={disabled}
          required={required}
          aria-invalid={validity.error ? true : undefined}
          aria-describedby={describedBy(
            ids,
            Boolean(description),
            Boolean(validity.error),
            ariaDescribedBy,
          )}
          {...rest}
          onInvalid={(event) => {
            validity.onInvalid(event);
            onInvalid?.(event);
          }}
          onChange={(event) => {
            validity.reportValue(event.currentTarget.value);
            onChange?.(event);
          }}
        />
      </div>
    </Field>
  );
}

export interface SearchFieldProps extends Omit<TextFieldProps, 'startIcon' | 'endAdornment' | 'type'> {
  onClear?: () => void;
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
        <IconButton
          label={clearLabel}
          icon={<Icon name="close" />}
          size="sm"
          variant="ghost"
          onClick={clear}
          tabIndex={-1}
          aria-hidden={!hasValue}
          className={hasValue ? undefined : 'mors-input-affix--reserved'}
        />
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
