import { useState, type ReactNode } from 'react';
import { cx } from '../utils/cx';
import type { Size } from '../utils/types';
import { useControllableState } from '../hooks/useControllableState';
import { describedBy, Field, useFieldIds } from './Field';
import { Calendar } from './Calendar';
import { Popover } from './Popover';
import { Button } from './Button';
import { Icon } from './Icon';

const DEFAULT_FORMAT: Intl.DateTimeFormatOptions = { dateStyle: 'medium' };

export interface DatePickerProps {
  value?: Date | null;
  defaultValue?: Date | null;
  onChange?: (date: Date | null) => void;
  label?: ReactNode;
  description?: ReactNode;
  error?: ReactNode;
  placeholder?: string;
  size?: Size;
  min?: Date;
  max?: Date;
  locale?: string;
  /** Intl options for the trigger label. */
  formatOptions?: Intl.DateTimeFormatOptions;
  disabled?: boolean;
  required?: boolean;
  /** Adds a "Clear" action inside the popover. */
  clearable?: boolean;
  block?: boolean;
  id?: string;
  className?: string;
}

/**
 * Text-trigger date field that opens a Calendar in a popover. The trigger is a
 * button rather than a text input, so the value can only ever be a valid date.
 */
export function DatePicker({
  value,
  defaultValue = null,
  onChange,
  label,
  description,
  error,
  placeholder = 'Select a date',
  size = 'md',
  min,
  max,
  locale,
  formatOptions = DEFAULT_FORMAT,
  disabled = false,
  required = false,
  clearable = false,
  block = true,
  id,
  className,
}: DatePickerProps) {
  const ids = useFieldIds(id);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useControllableState<Date | null>(value, defaultValue, onChange);
  const formatted = selected
    ? new Intl.DateTimeFormat(locale, formatOptions).format(selected)
    : placeholder;

  return (
    <Field
      ids={ids}
      label={label}
      description={description}
      error={error}
      required={required}
      size={size}
      labelElement="span"
      block={block}
      className={className}
    >
      <Popover
        open={open}
        onOpenChange={setOpen}
        placement="bottom"
        align="start"
        padding="none"
        ariaLabel={typeof label === 'string' ? label : 'Choose date'}
        trigger={
          <Button
            id={ids.id}
            variant="secondary"
            size={size}
            className={cx('mors-date-trigger', !selected && 'mors-date-trigger--empty')}
            disabled={disabled}
            block={block}
            startIcon={<Icon name="calendar" />}
            endIcon={<Icon name="chevron-down" />}
            aria-labelledby={label ? `${ids.id}-label` : undefined}
            aria-invalid={error ? true : undefined}
            aria-describedby={describedBy(ids, Boolean(description), Boolean(error))}
          >
            {formatted}
          </Button>
        }
      >
        <Calendar
          className="mors-date-calendar"
          value={selected}
          onChange={(date) => {
            setSelected(date);
            setOpen(false);
          }}
          min={min}
          max={max}
          locale={locale}
          footer={
            clearable && (
              <Button
                variant="link"
                size="sm"
                onClick={() => {
                  setSelected(null);
                  setOpen(false);
                }}
              >
                Clear date
              </Button>
            )
          }
        />
      </Popover>
    </Field>
  );
}
