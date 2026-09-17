import { useState } from 'react';
import { cx } from '../utils/cx';
import { dateKey } from '../utils/date';
import { useControllableState } from '../hooks/useControllableState';
import { describedBy, Field, useFieldControl, type FieldShellProps } from './Field';
import { Calendar } from './Calendar';
import { Popover } from './Popover';
import { Button } from './Button';
import { Icon } from './Icon';

const DEFAULT_FORMAT: Intl.DateTimeFormatOptions = { dateStyle: 'medium' };

export interface DatePickerProps extends FieldShellProps {
  value?: Date | null;
  defaultValue?: Date | null;
  onChange?: (date: Date | null) => void;
  placeholder?: string;
  min?: Date;
  max?: Date;
  locale?: string;
  formatOptions?: Intl.DateTimeFormatOptions;
  disabled?: boolean;
  required?: boolean;
  clearable?: boolean;
  id?: string;
  className?: string;
}

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
  const { ids, validity } = useFieldControl(id, required, error);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useControllableState<Date | null>(value, defaultValue, onChange);
  const formatted = selected
    ? new Intl.DateTimeFormat(locale, formatOptions).format(selected)
    : placeholder;

  const choose = (date: Date | null) => {
    setSelected(date);
    validity.reportValue(date ? dateKey(date) : '');
    setOpen(false);
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
      {required && (
        <input
          type="hidden"
          value={selected ? dateKey(selected) : ''}
          required
          onInvalid={validity.onInvalid}
        />
      )}
      <Popover
        open={open}
        onOpenChange={setOpen}
        placement="bottom"
        align="start"
        padding="none"
        className="mors-date-popover"
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
            aria-labelledby={label ? ids.labelId : undefined}
            aria-invalid={validity.error ? true : undefined}
            aria-describedby={describedBy(ids, Boolean(description), Boolean(validity.error))}
          >
            {formatted}
          </Button>
        }
      >
        <Calendar
          className="mors-date-calendar"
          value={selected}
          onChange={(date) => choose(date)}
          min={min}
          max={max}
          locale={locale}
          footer={
            clearable && (
              <Button variant="link" size="sm" onClick={() => choose(null)}>
                Clear date
              </Button>
            )
          }
        />
      </Popover>
    </Field>
  );
}
