import { useMemo, useState, type KeyboardEvent } from 'react';
import { cx } from '../utils/cx';
import { useControllableState } from '../hooks/useControllableState';
import { describedBy, Field, useFieldControl, type FieldShellProps } from './Field';
import { Icon } from './Icon';
import { Popover } from './Popover';
import { Button } from './Button';

const pad = (value: number) => String(value).padStart(2, '0');

function parseTime(value: string): { hours: number; minutes: number } | null {
  const match = /^(\d{1,2}):(\d{2})$/.exec(value);
  if (!match) return null;
  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  if (hours > 23 || minutes > 59) return null;
  return { hours, minutes };
}

function formatDisplay(value: string, hourCycle: 'h12' | 'h23', locale?: string): string {
  const parsed = parseTime(value);
  if (!parsed) return '';
  const date = new Date();
  date.setHours(parsed.hours, parsed.minutes, 0, 0);
  return new Intl.DateTimeFormat(locale, {
    hour: 'numeric',
    minute: '2-digit',
    hourCycle,
  }).format(date);
}

export interface TimePickerProps extends FieldShellProps {
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  minuteStep?: number;
  hourCycle?: 'h12' | 'h23';
  locale?: string;
  disabled?: boolean;
  required?: boolean;
  clearable?: boolean;
  id?: string;
  className?: string;
}

/**
 * Time of day as `HH:mm` (24-hour). The trigger shows a locale-formatted
 * string; the popover is two scrollable columns of hours and minutes.
 */
export function TimePicker({
  value,
  defaultValue = '',
  onChange,
  placeholder = 'Select a time',
  minuteStep = 5,
  hourCycle = 'h12',
  locale,
  label,
  description,
  error,
  size = 'md',
  block = true,
  disabled = false,
  required = false,
  clearable = false,
  id,
  className,
}: TimePickerProps) {
  const { ids, validity } = useFieldControl(id, required, error);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useControllableState(value, defaultValue, onChange);
  const parsed = parseTime(selected);
  const hours = useMemo(
    () => (hourCycle === 'h12' ? Array.from({ length: 12 }, (_, i) => i + 1) : Array.from({ length: 24 }, (_, i) => i)),
    [hourCycle],
  );
  const minutes = useMemo(() => {
    const step = Math.min(30, Math.max(1, minuteStep));
    return Array.from({ length: Math.ceil(60 / step) }, (_, i) => i * step).filter((m) => m < 60);
  }, [minuteStep]);

  const displayHour = parsed
    ? hourCycle === 'h12'
      ? parsed.hours % 12 === 0
        ? 12
        : parsed.hours % 12
      : parsed.hours
    : null;
  const meridiem = parsed ? (parsed.hours >= 12 ? 'pm' : 'am') : 'am';
  const formatted = parsed ? formatDisplay(selected, hourCycle, locale) : placeholder;

  const commit = (nextHours: number, nextMinutes: number) => {
    const next = `${pad(nextHours)}:${pad(nextMinutes)}`;
    setSelected(next);
    validity.reportValue(next);
  };

  const setHourColumn = (hour: number) => {
    const minutesValue = parsed?.minutes ?? 0;
    if (hourCycle === 'h12') {
      const isPm = meridiem === 'pm';
      const h24 = hour === 12 ? (isPm ? 12 : 0) : isPm ? hour + 12 : hour;
      commit(h24, minutesValue);
      return;
    }
    commit(hour, minutesValue);
  };

  const onTriggerKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (disabled) return;
    if (event.key === 'ArrowDown' || event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      setOpen(true);
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
      {required && (
        <input type="hidden" value={selected} required onInvalid={validity.onInvalid} />
      )}
      <Popover
        open={open}
        onOpenChange={(next) => !disabled && setOpen(next)}
        placement="bottom"
        align="start"
        padding="none"
        className="mors-time-popover"
        ariaLabel={typeof label === 'string' ? label : 'Choose time'}
        trigger={
          <Button
            id={ids.id}
            variant="secondary"
            size={size}
            className={cx('mors-date-trigger', !parsed && 'mors-date-trigger--empty')}
            disabled={disabled}
            block={block}
            startIcon={<Icon name="clock" />}
            endIcon={<Icon name="chevron-down" />}
            aria-labelledby={label ? ids.labelId : undefined}
            aria-invalid={validity.error ? true : undefined}
            aria-describedby={describedBy(ids, Boolean(description), Boolean(validity.error))}
            onKeyDown={onTriggerKeyDown}
          >
            {formatted}
          </Button>
        }
      >
        <div className={cx('mors-time-grid', hourCycle === 'h12' && 'mors-time-grid--ampm')}>
          <div className="mors-time-column" role="listbox" aria-label="Hours">
            {hours.map((hour) => {
              const selectedHour =
                hourCycle === 'h12' ? displayHour === hour : parsed?.hours === hour;
              return (
                <button
                  key={hour}
                  type="button"
                  role="option"
                  aria-selected={selectedHour || undefined}
                  className={cx('mors-time-option', selectedHour && 'mors-time-option--selected')}
                  onClick={() => setHourColumn(hour)}
                >
                  {hourCycle === 'h23' ? pad(hour) : hour}
                </button>
              );
            })}
          </div>
          <div className="mors-time-column" role="listbox" aria-label="Minutes">
            {minutes.map((minute) => {
              const selectedMinute = parsed?.minutes === minute;
              return (
                <button
                  key={minute}
                  type="button"
                  role="option"
                  aria-selected={selectedMinute || undefined}
                  className={cx('mors-time-option', selectedMinute && 'mors-time-option--selected')}
                  onClick={() => commit(parsed?.hours ?? 9, minute)}
                >
                  {pad(minute)}
                </button>
              );
            })}
          </div>
          {hourCycle === 'h12' && (
            <div className="mors-time-column" role="listbox" aria-label="AM or PM">
              {(['am', 'pm'] as const).map((period) => (
                <button
                  key={period}
                  type="button"
                  role="option"
                  aria-selected={meridiem === period || undefined}
                  className={cx('mors-time-option', meridiem === period && 'mors-time-option--selected')}
                  onClick={() => {
                    const base = parsed?.hours ?? 9;
                    const twelveHour = base % 12;
                    commit(period === 'pm' ? (twelveHour === 0 ? 12 : twelveHour + 12) : twelveHour, parsed?.minutes ?? 0);
                  }}
                >
                  {period.toUpperCase()}
                </button>
              ))}
            </div>
          )}
        </div>
        {clearable && (
          <div className="mors-time-footer">
            <Button
              variant="link"
              size="sm"
              onClick={() => {
                setSelected('');
                validity.reportValue('');
                setOpen(false);
              }}
            >
              Clear time
            </Button>
          </div>
        )}
      </Popover>
    </Field>
  );
}
