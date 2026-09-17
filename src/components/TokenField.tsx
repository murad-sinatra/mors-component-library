import { useRef, useState, type KeyboardEvent } from 'react';
import { cx } from '../utils/cx';
import { useControllableState } from '../hooks/useControllableState';
import { describedBy, Field, useFieldControl, type FieldShellProps } from './Field';
import { Chip } from './FilterBar';

const EMPTY_TOKENS: readonly string[] = [];

export interface TokenFieldProps extends FieldShellProps {
  tokens?: readonly string[];
  defaultTokens?: readonly string[];
  onTokensChange?: (tokens: readonly string[]) => void;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  unique?: boolean;
  max?: number;
  id?: string;
  name?: string;
  className?: string;
}

function splitChunk(value: string): string[] {
  return value
    .split(/[,;\n]+/)
    .map((part) => part.trim())
    .filter(Boolean);
}

/**
 * Freeform tags. Enter, comma or blur commits the current text as a token;
 * Backspace on an empty input removes the last one.
 */
export function TokenField({
  tokens,
  defaultTokens = EMPTY_TOKENS,
  onTokensChange,
  placeholder = 'Add and press Enter',
  label,
  description,
  error,
  size = 'md',
  block = true,
  disabled = false,
  required = false,
  unique = true,
  max,
  id,
  name,
  className,
}: TokenFieldProps) {
  const { ids, validity } = useFieldControl(id, required, error);
  const [value, setValue] = useControllableState<readonly string[]>(
    tokens,
    defaultTokens,
    onTokensChange,
  );
  const [draft, setDraft] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const commit = (raw: string) => {
    const next = [...value];
    for (const token of splitChunk(raw)) {
      if (unique && next.includes(token)) continue;
      if (max !== undefined && next.length >= max) break;
      next.push(token);
    }
    setValue(next);
    validity.reportValue(next.join(','));
    setDraft('');
  };

  const removeAt = (index: number) => {
    const next = value.filter((_, i) => i !== index);
    setValue(next);
    validity.reportValue(next.join(','));
    inputRef.current?.focus();
  };

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' || event.key === ',') {
      event.preventDefault();
      if (draft.trim()) commit(draft);
    }
    if (event.key === 'Backspace' && draft === '' && value.length > 0) {
      event.preventDefault();
      removeAt(value.length - 1);
    }
  };

  return (
    <Field
      ids={ids}
      label={label}
      description={description}
      error={validity.error}
      required={required}
      size={size}
      labelElement="label"
      block={block}
      className={className}
    >
      {(name || required) && (
        <input
          type="hidden"
          name={name}
          value={value.join(',')}
          required={required}
          onInvalid={validity.onInvalid}
        />
      )}
      <div
        className={cx('mors-input-shell', 'mors-token-field', disabled && 'mors-is-disabled')}
        onClick={() => inputRef.current?.focus()}
      >
        {value.map((token, index) => (
          <Chip
            key={`${token}-${index}`}
            size="sm"
            selected
            onRemove={disabled ? undefined : () => removeAt(index)}
          >
            {token}
          </Chip>
        ))}
        <input
          ref={inputRef}
          id={ids.id}
          className="mors-input mors-token-input"
          disabled={disabled || (max !== undefined && value.length >= max)}
          placeholder={value.length === 0 ? placeholder : undefined}
          value={draft}
          aria-invalid={validity.error ? true : undefined}
          aria-describedby={describedBy(ids, Boolean(description), Boolean(validity.error))}
          onChange={(event) => setDraft(event.currentTarget.value)}
          onKeyDown={onKeyDown}
          onBlur={() => {
            if (draft.trim()) commit(draft);
          }}
        />
      </div>
    </Field>
  );
}
