import { useEffect, useId, useMemo, useRef, useState, type KeyboardEvent } from 'react';
import { cx } from '../utils/cx';
import { useControllableState } from '../hooks/useControllableState';
import { describedBy, Field, useFieldControl, type FieldShellProps } from './Field';
import { Icon } from './Icon';
import { Popover } from './Popover';

export interface SelectOption {
  label: string;
  value: string;
  disabled?: boolean;
}

export interface SelectProps extends FieldShellProps {
  options: readonly SelectOption[];
  placeholder?: string;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  name?: string;
  required?: boolean;
  disabled?: boolean;
  id?: string;
  className?: string;
}

function enabledIndexes(options: readonly SelectOption[]): number[] {
  return options.flatMap((option, index) => (option.disabled ? [] : [index]));
}

export function Select({
  options,
  placeholder = 'Select',
  value,
  defaultValue = '',
  onChange,
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
}: SelectProps) {
  const { ids, validity } = useFieldControl(id, required, error);
  const listId = `mors${useId()}-list`;
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useControllableState(value, defaultValue, onChange);
  const selectedIndex = options.findIndex((option) => option.value === selected);
  const [highlight, setHighlight] = useState(() => Math.max(0, selectedIndex));
  const searchRef = useRef('');
  const searchTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const enabled = useMemo(() => enabledIndexes(options), [options]);

  const selectedOption = selectedIndex >= 0 ? options[selectedIndex] : undefined;

  useEffect(() => {
    if (open) setHighlight(selectedIndex >= 0 ? selectedIndex : (enabled[0] ?? 0));
  }, [open, selectedIndex, enabled]);

  const choose = (index: number) => {
    const option = options[index];
    if (!option || option.disabled) return;
    setSelected(option.value);
    validity.reportValue(option.value);
    setOpen(false);
  };

  const move = (delta: number) => {
    if (enabled.length === 0) return;
    const current = enabled.indexOf(highlight);
    const next = enabled[(current + delta + enabled.length) % enabled.length]!;
    setHighlight(next);
    document.getElementById(`${listId}-opt-${next}`)?.scrollIntoView({ block: 'nearest' });
  };

  const typeahead = (key: string) => {
    if (key.length !== 1 || key === ' ') return;
    searchRef.current += key.toLowerCase();
    clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => {
      searchRef.current = '';
    }, 400);
    const match = options.findIndex(
      (option) => !option.disabled && option.label.toLowerCase().startsWith(searchRef.current),
    );
    if (match >= 0) {
      setHighlight(match);
      document.getElementById(`${listId}-opt-${match}`)?.scrollIntoView({ block: 'nearest' });
    }
  };

  const onTriggerKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (disabled) return;
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp' || event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      setOpen(true);
    }
    typeahead(event.key);
  };

  const onListKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        move(1);
        break;
      case 'ArrowUp':
        event.preventDefault();
        move(-1);
        break;
      case 'Home':
        event.preventDefault();
        if (enabled[0] !== undefined) setHighlight(enabled[0]);
        break;
      case 'End':
        event.preventDefault();
        if (enabled[enabled.length - 1] !== undefined) setHighlight(enabled[enabled.length - 1]!);
        break;
      case 'Enter':
      case ' ':
        event.preventDefault();
        choose(highlight);
        break;
      default:
        typeahead(event.key);
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
      labelElement="span"
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
      <Popover
        open={open}
        onOpenChange={(next) => !disabled && setOpen(next)}
        placement="bottom"
        align="start"
        padding="none"
        matchWidth
        role="listbox"
        ariaLabel={typeof label === 'string' ? label : placeholder}
        className="mors-select-popover"
        onKeyDown={onListKeyDown}
        trigger={
          <button
            type="button"
            id={ids.id}
            className={cx(
              'mors-input-shell',
              'mors-select-trigger',
              disabled && 'mors-is-disabled',
              !selectedOption && 'mors-select-trigger--empty',
            )}
            disabled={disabled}
            aria-labelledby={label ? ids.labelId : undefined}
            aria-describedby={describedBy(ids, Boolean(description), Boolean(validity.error))}
            onKeyDown={onTriggerKeyDown}
          >
            <span className="mors-select-value">{selectedOption?.label ?? placeholder}</span>
            <Icon name="chevron-down" className="mors-select-arrow" />
          </button>
        }
      >
        {options.map((option, index) => {
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
              onClick={() => choose(index)}
            >
              <span>{option.label}</span>
              {isSelected && <Icon name="check" className="mors-select-check" />}
            </div>
          );
        })}
      </Popover>
    </Field>
  );
}
