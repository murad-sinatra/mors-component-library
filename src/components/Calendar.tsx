import {
  useEffect,
  useId,
  useRef,
  useState,
  type HTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
} from 'react';
import { cx } from '../utils/cx';
import {
  addDays,
  addMonths,
  clampDate,
  isAfter,
  isBefore,
  isSameDay,
  isSameMonth,
  monthGrid,
  startOfDay,
  startOfMonth,
  weekdayNames,
} from '../utils/date';
import { useControllableState } from '../hooks/useControllableState';
import { IconButton } from './Button';
import { Icon } from './Icon';

export interface CalendarProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange' | 'children' | 'defaultValue'> {
  value?: Date | null;
  defaultValue?: Date | null;
  onChange?: (date: Date) => void;
  month?: Date;
  defaultMonth?: Date;
  onMonthChange?: (month: Date) => void;
  min?: Date;
  max?: Date;
  weekStartsOn?: 0 | 1;
  locale?: string;
  isDateDisabled?: (date: Date) => boolean;
  footer?: ReactNode;
}

/**
 * Month grid following the WAI-ARIA date-grid pattern: arrow keys move by day,
 * PageUp/PageDown by month, Home/End to the ends of the week, and Enter or
 * Space selects. Only one day is in the tab order at a time.
 */
export function Calendar({
  value,
  defaultValue = null,
  onChange,
  month,
  defaultMonth,
  onMonthChange,
  min,
  max,
  weekStartsOn = 1,
  locale,
  isDateDisabled,
  footer,
  className,
  ...rest
}: CalendarProps) {
  const [selected, setSelected] = useControllableState<Date | null>(value, defaultValue, (next) => {
    if (next) onChange?.(next);
  });
  const [visibleMonth, setVisibleMonth] = useControllableState(
    month,
    startOfMonth(defaultMonth ?? selected ?? new Date()),
    onMonthChange,
  );
  const [focusedDate, setFocusedDate] = useState<Date>(
    () => selected ?? clampDate(startOfDay(new Date()), min, max),
  );
  const [keyboardActive, setKeyboardActive] = useState(false);
  const gridRef = useRef<HTMLTableElement>(null);
  const labelId = `mors${useId()}-calendar-label`;

  const today = startOfDay(new Date());
  const days = monthGrid(visibleMonth, weekStartsOn);
  const weekdays = weekdayNames(locale, weekStartsOn);
  const monthLabel = new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric' }).format(
    visibleMonth,
  );
  const dayLabel = new Intl.DateTimeFormat(locale, { dateStyle: 'full' });

  const disabled = (date: Date) =>
    (min ? isBefore(date, min) : false) ||
    (max ? isAfter(date, max) : false) ||
    (isDateDisabled?.(date) ?? false);

  // Move DOM focus only in response to keyboard navigation.
  useEffect(() => {
    if (!keyboardActive) return;
    const iso = focusedDate.toDateString();
    gridRef.current?.querySelector<HTMLButtonElement>(`[data-date="${iso}"]`)?.focus();
  }, [focusedDate, keyboardActive]);

  const moveFocus = (next: Date) => {
    const clamped = clampDate(next, min, max);
    setKeyboardActive(true);
    setFocusedDate(clamped);
    if (!isSameMonth(clamped, visibleMonth)) setVisibleMonth(startOfMonth(clamped));
  };

  const select = (date: Date) => {
    if (disabled(date)) return;
    setSelected(date);
    setFocusedDate(date);
    if (!isSameMonth(date, visibleMonth)) setVisibleMonth(startOfMonth(date));
  };

  const onKeyDown = (event: KeyboardEvent<HTMLTableElement>) => {
    const moves: Record<string, number> = {
      ArrowLeft: -1,
      ArrowRight: 1,
      ArrowUp: -7,
      ArrowDown: 7,
    };

    if (event.key in moves) {
      event.preventDefault();
      moveFocus(addDays(focusedDate, moves[event.key]!));
      return;
    }

    switch (event.key) {
      case 'PageUp':
        event.preventDefault();
        moveFocus(addMonths(focusedDate, event.shiftKey ? -12 : -1));
        break;
      case 'PageDown':
        event.preventDefault();
        moveFocus(addMonths(focusedDate, event.shiftKey ? 12 : 1));
        break;
      case 'Home':
        event.preventDefault();
        moveFocus(addDays(focusedDate, -((focusedDate.getDay() - weekStartsOn + 7) % 7)));
        break;
      case 'End':
        event.preventDefault();
        moveFocus(addDays(focusedDate, 6 - ((focusedDate.getDay() - weekStartsOn + 7) % 7)));
        break;
      default:
        break;
    }
  };

  const tabbableDate = isSameMonth(focusedDate, visibleMonth)
    ? focusedDate
    : isSameMonth(selected ?? visibleMonth, visibleMonth)
      ? (selected ?? startOfMonth(visibleMonth))
      : startOfMonth(visibleMonth);

  return (
    <div className={cx('mors-calendar', className)} {...rest}>
      <div className="mors-calendar-header">
        <IconButton
          label="Previous month"
          icon={<Icon name="chevron-left" />}
          variant="ghost"
          size="sm"
          onClick={() => setVisibleMonth(startOfMonth(addMonths(visibleMonth, -1)))}
        />
        <span className="mors-calendar-label" id={labelId} aria-live="polite">
          {monthLabel}
        </span>
        <IconButton
          label="Next month"
          icon={<Icon name="chevron-right" />}
          variant="ghost"
          size="sm"
          onClick={() => setVisibleMonth(startOfMonth(addMonths(visibleMonth, 1)))}
        />
      </div>

      <table
        ref={gridRef}
        role="grid"
        aria-labelledby={labelId}
        className="mors-calendar-grid"
        onKeyDown={onKeyDown}
      >
        <thead>
          <tr>
            {weekdays.map((day) => (
              <th key={day.long} scope="col" abbr={day.long} className="mors-calendar-weekday">
                {day.short}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: 6 }, (_, week) => (
            <tr key={week}>
              {days.slice(week * 7, week * 7 + 7).map((date) => {
                const outside = !isSameMonth(date, visibleMonth);
                const isSelected = isSameDay(date, selected);
                const isDisabled = disabled(date);

                return (
                  <td key={date.toISOString()} aria-selected={isSelected}>
                    <button
                      type="button"
                      data-date={date.toDateString()}
                      className={cx(
                        'mors-calendar-day',
                        outside && 'mors-calendar-day--outside',
                        isSelected && 'mors-calendar-day--selected',
                        isSameDay(date, today) && 'mors-calendar-day--today',
                      )}
                      tabIndex={isSameDay(date, tabbableDate) ? 0 : -1}
                      disabled={isDisabled}
                      aria-label={dayLabel.format(date)}
                      aria-current={isSameDay(date, today) ? 'date' : undefined}
                      onClick={() => select(date)}
                      onFocus={() => setFocusedDate(date)}
                    >
                      {date.getDate()}
                    </button>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>

      {footer && <div className="mors-calendar-footer">{footer}</div>}
    </div>
  );
}
