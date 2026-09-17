import { useRef, type ClipboardEvent, type KeyboardEvent } from 'react';
import { cx } from '../utils/cx';
import { useControllableState } from '../hooks/useControllableState';
import { describedBy, Field, useFieldControl, type FieldShellProps } from './Field';

const DIGIT = /^\d$/;

export interface OtpFieldProps extends FieldShellProps {
  length?: number;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  onComplete?: (value: string) => void;
  disabled?: boolean;
  required?: boolean;
  id?: string;
  name?: string;
  className?: string;
  autoComplete?: string;
}

/**
 * One-time-code / PIN entry. Each cell is a digit; paste fills them all,
 * Backspace walks backwards, and `onComplete` fires when every cell is full.
 */
export function OtpField({
  length = 6,
  value,
  defaultValue = '',
  onChange,
  onComplete,
  label,
  description,
  error,
  size = 'md',
  block = true,
  disabled = false,
  required = false,
  id,
  name,
  className,
  autoComplete = 'one-time-code',
}: OtpFieldProps) {
  const { ids, validity } = useFieldControl(id, required, error);
  const [code, setCode] = useControllableState(value, defaultValue, (next) => {
    onChange?.(next);
    if (next.length === length && /^\d+$/.test(next)) onComplete?.(next);
  });
  const cells = Array.from({ length }, (_, index) => code[index] ?? '');
  const refs = useRef<Array<HTMLInputElement | null>>([]);

  const write = (next: string) => {
    const digits = next.replace(/\D/g, '').slice(0, length);
    setCode(digits);
    validity.reportValue(digits);
  };

  const focusAt = (index: number) => {
    refs.current[Math.max(0, Math.min(length - 1, index))]?.focus();
  };

  const onCellKeyDown = (index: number, event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Backspace') {
      event.preventDefault();
      if (cells[index]) {
        const next = cells.slice();
        next[index] = '';
        write(next.join(''));
      } else {
        focusAt(index - 1);
        const next = cells.slice();
        if (index > 0) next[index - 1] = '';
        write(next.join(''));
      }
      return;
    }
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      focusAt(index - 1);
    }
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      focusAt(index + 1);
    }
  };

  const onPaste = (event: ClipboardEvent<HTMLInputElement>) => {
    const text = event.clipboardData.getData('text');
    if (!/\d/.test(text)) return;
    event.preventDefault();
    write(text);
    focusAt(Math.min(text.replace(/\D/g, '').length, length - 1));
  };

  return (
    <Field
      ids={ids}
      label={label}
      description={description}
      error={validity.error}
      required={required}
      size={size}
      labelElement="span"
      block={block}
      className={className}
    >
      {(name || required) && (
        <input
          type="hidden"
          name={name}
          value={code}
          required={required}
          minLength={length}
          onInvalid={validity.onInvalid}
        />
      )}
      <div
        role="group"
        className="mors-otp"
        aria-labelledby={label ? ids.labelId : undefined}
        aria-describedby={describedBy(ids, Boolean(description), Boolean(validity.error))}
      >
        {cells.map((digit, index) => (
          <input
            key={index}
            ref={(node) => {
              refs.current[index] = node;
            }}
            id={index === 0 ? ids.id : undefined}
            className={cx('mors-otp-cell', disabled && 'mors-is-disabled')}
            inputMode="numeric"
            autoComplete={index === 0 ? autoComplete : 'off'}
            pattern="\d*"
            maxLength={1}
            disabled={disabled}
            aria-label={`Digit ${index + 1} of ${length}`}
            aria-invalid={validity.error ? true : undefined}
            value={digit}
            onChange={(event) => {
              const char = event.currentTarget.value.replace(/\D/g, '').slice(-1);
              if (!DIGIT.test(char) && event.currentTarget.value !== '') return;
              const next = cells.slice();
              next[index] = char;
              write(next.join(''));
              if (char) focusAt(index + 1);
            }}
            onKeyDown={(event) => onCellKeyDown(index, event)}
            onPaste={onPaste}
            onFocus={(event) => event.currentTarget.select()}
          />
        ))}
      </div>
    </Field>
  );
}
