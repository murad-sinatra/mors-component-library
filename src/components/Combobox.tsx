import { useEffect, useId, useMemo, useRef, useState, type KeyboardEvent } from 'react';
import { cx } from '../utils/cx';
import { useControllableState } from '../hooks/useControllableState';
import { describedBy, Field, useFieldControl, type FieldShellProps } from './Field';
import { Icon } from './Icon';
import { Anchor } from './internal/Anchor';
import { useFloatingSurface } from './internal/useFloatingSurface';
import { useDismiss } from '../hooks/useDismiss';
import { Portal } from './Portal';
import type { SelectOption } from './Select';

export interface ComboboxProps extends FieldShellProps {
  options: readonly SelectOption[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  emptyMessage?: string;
  name?: string;
  required?: boolean;
  disabled?: boolean;
  id?: string;
  className?: string;
}

/**
 * Searchable select. Typing filters the list; arrow keys move the highlight;
 * Enter commits. Use Select when the list is short enough to scan.
 */
export function Combobox({
  options,
  value,
  defaultValue = '',
  onChange,
  placeholder = 'Search',
  emptyMessage = 'No matches',
  label,
  description,
  error,
  size = 'md',
  block = true,
  name,
  required = false,
  disabled = false,
  id,
  className,
}: ComboboxProps) {
  const { ids, validity } = useFieldControl(id, required, error);
  const listId = `mors${useId()}-combo`;
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useControllableState(value, defaultValue, onChange);
  const selectedOption = options.find((option) => option.value === selected);
  const [query, setQuery] = useState(selectedOption?.label ?? '');
  const [highlight, setHighlight] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const { anchorRef, panelRef, panelId, mounted, state, position, refs } = useFloatingSurface({
    open,
    placement: 'bottom',
    align: 'start',
    offset: 6,
    matchWidth: true,
    idSuffix: 'combobox',
  });

  useDismiss({
    enabled: open,
    onDismiss: () => setOpen(false),
    refs,
  });

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle || query === selectedOption?.label) return options;
    return options.filter((option) => option.label.toLowerCase().includes(needle));
  }, [options, query, selectedOption?.label]);

  const enabled = useMemo(
    () => filtered.flatMap((option, index) => (option.disabled ? [] : [index])),
    [filtered],
  );

  useEffect(() => {
    if (!open) return;
    setHighlight(enabled[0] ?? 0);
  }, [open, enabled]);

  useEffect(() => {
    if (!open && selectedOption) setQuery(selectedOption.label);
  }, [open, selectedOption]);

  const choose = (index: number) => {
    const option = filtered[index];
    if (!option || option.disabled) return;
    setSelected(option.value);
    setQuery(option.label);
    validity.reportValue(option.value);
    setOpen(false);
    inputRef.current?.focus();
  };

  const move = (delta: number) => {
    if (enabled.length === 0) return;
    const current = enabled.indexOf(highlight);
    const next = enabled[(current + delta + enabled.length) % enabled.length]!;
    setHighlight(next);
    document.getElementById(`${listId}-opt-${next}`)?.scrollIntoView({ block: 'nearest' });
  };

  const onInputKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (disabled) return;
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        if (!open) setOpen(true);
        else move(1);
        break;
      case 'ArrowUp':
        event.preventDefault();
        if (!open) setOpen(true);
        else move(-1);
        break;
      case 'Enter':
        if (open) {
          event.preventDefault();
          choose(highlight);
        }
        break;
      case 'Escape':
        if (open) {
          event.preventDefault();
          setOpen(false);
        }
        break;
      default:
        break;
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
          value={selected}
          required={required}
          onInvalid={validity.onInvalid}
        />
      )}
      <Anchor ref={anchorRef}>
        <div className={cx('mors-input-shell', disabled && 'mors-is-disabled')}>
          <span className="mors-input-affix mors-input-affix--start">
            <Icon name="search" />
          </span>
          <input
            ref={inputRef}
            id={ids.id}
            className="mors-input"
            role="combobox"
            aria-autocomplete="list"
            aria-expanded={open}
            aria-controls={mounted ? panelId : undefined}
            aria-activedescendant={open ? `${listId}-opt-${highlight}` : undefined}
            aria-invalid={validity.error ? true : undefined}
            aria-describedby={describedBy(ids, Boolean(description), Boolean(validity.error))}
            disabled={disabled}
            placeholder={placeholder}
            value={query}
            autoComplete="off"
            onChange={(event) => {
              setQuery(event.currentTarget.value);
              setOpen(true);
              if (event.currentTarget.value === '') {
                setSelected('');
                validity.reportValue('');
              }
            }}
            onFocus={() => {
              if (!disabled) setOpen(true);
            }}
            onKeyDown={onInputKeyDown}
          />
          <span className="mors-input-affix mors-input-affix--end">
            <Icon name="chevron-down" className="mors-select-arrow" />
          </span>
        </div>
      </Anchor>
      {mounted && (
        <Portal>
          <div
            ref={panelRef}
            id={panelId}
            role="listbox"
            className={cx('mors-popover', 'mors-popover--flush', 'mors-select-popover')}
            style={position.style}
            data-state={state}
            data-placement={position.placement}
          >
            {filtered.length === 0 && <div className="mors-combobox-empty">{emptyMessage}</div>}
            {filtered.map((option, index) => {
              const active = index === highlight;
              const isSelected = option.value === selected;
              return (
                <div
                  key={option.value}
                  id={`${listId}-opt-${index}`}
                  role="option"
                  aria-selected={isSelected}
                  aria-disabled={option.disabled || undefined}
                  tabIndex={-1}
                  className={cx(
                    'mors-select-option',
                    active && 'mors-select-option--active',
                    isSelected && 'mors-select-option--selected',
                    option.disabled && 'mors-select-option--disabled',
                  )}
                  onMouseEnter={() => {
                    if (!option.disabled) setHighlight(index);
                  }}
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => choose(index)}
                >
                  <span>{option.label}</span>
                  {isSelected && <Icon name="check" className="mors-select-check" />}
                </div>
              );
            })}
          </div>
        </Portal>
      )}
    </Field>
  );
}
