import {
  createContext,
  useContext,
  useId,
  useMemo,
  type HTMLAttributes,
  type ReactNode,
} from 'react';
import { cx } from '../utils/cx';
import { useControllableState } from '../hooks/useControllableState';
import { Icon } from './Icon';

const NONE_OPEN: readonly string[] = [];

interface AccordionContextValue {
  openValues: readonly string[];
  toggle: (value: string) => void;
  baseId: string;
}

const AccordionContext = createContext<AccordionContextValue | null>(null);

export interface AccordionProps extends HTMLAttributes<HTMLDivElement> {
  /** `single` closes the previous item, `multiple` allows several open at once. */
  type?: 'single' | 'multiple';
  value?: readonly string[];
  defaultValue?: readonly string[];
  onValueChange?: (value: readonly string[]) => void;
  /** Removes the outer border/background for use inside a Card. */
  flush?: boolean;
  children: ReactNode;
}

export function Accordion({
  type = 'single',
  value,
  defaultValue = NONE_OPEN,
  onValueChange,
  flush = false,
  className,
  children,
  ...rest
}: AccordionProps) {
  const [openValues, setOpenValues] = useControllableState(value, defaultValue, onValueChange);
  const baseId = `mors${useId()}`;

  const context = useMemo<AccordionContextValue>(
    () => ({
      openValues,
      baseId,
      toggle: (itemValue: string) => {
        const isOpen = openValues.includes(itemValue);
        if (type === 'single') {
          setOpenValues(isOpen ? NONE_OPEN : [itemValue]);
          return;
        }
        setOpenValues(
          isOpen ? openValues.filter((entry) => entry !== itemValue) : [...openValues, itemValue],
        );
      },
    }),
    [openValues, baseId, type, setOpenValues],
  );

  return (
    <AccordionContext value={context}>
      <div className={cx('mors-accordion', flush && 'mors-accordion--flush', className)} {...rest}>
        {children}
      </div>
    </AccordionContext>
  );
}

export interface AccordionItemProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  value: string;
  title: ReactNode;
  /** Secondary line under the title. */
  subtitle?: ReactNode;
  disabled?: boolean;
  children: ReactNode;
}

export function AccordionItem({
  value,
  title,
  subtitle,
  disabled = false,
  className,
  children,
  ...rest
}: AccordionItemProps) {
  const context = useContext(AccordionContext);
  if (!context) throw new Error('<AccordionItem> must be rendered inside <Accordion>.');

  const open = context.openValues.includes(value);
  const triggerId = `${context.baseId}-trigger-${value}`;
  const panelId = `${context.baseId}-panel-${value}`;

  return (
    <div
      className={cx('mors-accordion-item', open && 'mors-accordion-item--open', className)}
      {...rest}
    >
      <h3 className="mors-accordion-heading">
        <button
          type="button"
          id={triggerId}
          className="mors-accordion-trigger"
          aria-expanded={open}
          aria-controls={panelId}
          disabled={disabled}
          onClick={() => context.toggle(value)}
        >
          <span className="mors-accordion-text">
            <span className="mors-accordion-title">{title}</span>
            {subtitle && <span className="mors-accordion-subtitle">{subtitle}</span>}
          </span>
          <Icon name="chevron-down" className="mors-accordion-chevron" />
        </button>
      </h3>
      <section
        id={panelId}
        aria-labelledby={triggerId}
        className="mors-accordion-panel"
        hidden={!open}
      >
        <div className="mors-accordion-content">{children}</div>
      </section>
    </div>
  );
}
