import {
  createContext,
  useContext,
  useId,
  useMemo,
  useRef,
  type HTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
} from 'react';
import { cx } from '../utils/cx';
import type { Size } from '../utils/types';
import { useControllableState } from '../hooks/useControllableState';

export type TabsVariant = 'underline' | 'segmented';

interface TabsContextValue {
  value: string;
  setValue: (value: string) => void;
  baseId: string;
  variant: TabsVariant;
  size: Exclude<Size, 'lg'>;
}

const TabsContext = createContext<TabsContextValue | null>(null);

function useTabs(component: string): TabsContextValue {
  const context = useContext(TabsContext);
  if (!context) throw new Error(`<${component}> must be rendered inside <Tabs>.`);
  return context;
}

export interface TabsProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  value?: string;
  defaultValue: string;
  onValueChange?: (value: string) => void;
  variant?: TabsVariant;
  size?: Exclude<Size, 'lg'>;
  children: ReactNode;
}

/**
 * Tab set with automatic activation: Arrow keys move focus and select in one
 * step, which is the expected behaviour when panels are cheap to render.
 */
export function Tabs({
  value,
  defaultValue,
  onValueChange,
  variant = 'underline',
  size = 'md',
  className,
  children,
  ...rest
}: TabsProps) {
  const [current, setCurrent] = useControllableState(value, defaultValue, onValueChange);
  const baseId = `mors${useId()}`;
  const context = useMemo<TabsContextValue>(
    () => ({ value: current, setValue: setCurrent, baseId, variant, size }),
    [current, setCurrent, baseId, variant, size],
  );

  return (
    <TabsContext value={context}>
      <div className={cx('mors-tabs', `mors-tabs--${variant}`, className)} {...rest}>
        {children}
      </div>
    </TabsContext>
  );
}

export interface TabListProps extends HTMLAttributes<HTMLDivElement> {
  label?: string;
}

export function TabList({ label, className, children, ...rest }: TabListProps) {
  const { variant, size } = useTabs('TabList');
  const listRef = useRef<HTMLDivElement>(null);

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const keys = ['ArrowRight', 'ArrowLeft', 'Home', 'End'];
    if (!keys.includes(event.key)) return;

    const tabs = Array.from(
      listRef.current?.querySelectorAll<HTMLButtonElement>('[role="tab"]:not(:disabled)') ?? [],
    );
    if (tabs.length === 0) return;

    const index = tabs.indexOf(document.activeElement as HTMLButtonElement);
    const next =
      event.key === 'Home'
        ? 0
        : event.key === 'End'
          ? tabs.length - 1
          : (index + (event.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length;

    event.preventDefault();
    tabs[next]?.focus();
    tabs[next]?.click();
  };

  return (
    <div
      ref={listRef}
      role="tablist"
      aria-label={label}
      tabIndex={-1}
      className={cx('mors-tab-list', `mors-tab-list--${variant}`, size !== 'md' && `mors-tab-list--${size}`, className)}
      onKeyDown={onKeyDown}
      {...rest}
    >
      {children}
    </div>
  );
}

export interface TabProps extends Omit<HTMLAttributes<HTMLButtonElement>, 'value'> {
  value: string;
  disabled?: boolean;
  badge?: ReactNode;
}

export function Tab({ value, disabled, badge, className, children, ...rest }: TabProps) {
  const tabs = useTabs('Tab');
  const selected = tabs.value === value;

  return (
    <button
      type="button"
      role="tab"
      id={`${tabs.baseId}-tab-${value}`}
      aria-selected={selected}
      aria-controls={`${tabs.baseId}-panel-${value}`}
      tabIndex={selected ? 0 : -1}
      disabled={disabled}
      className={cx('mors-tab', selected && 'mors-tab--selected', className)}
      onClick={() => tabs.setValue(value)}
      {...rest}
    >
      {children}
      {badge && <span className="mors-tab-badge">{badge}</span>}
    </button>
  );
}

export interface TabPanelProps extends HTMLAttributes<HTMLDivElement> {
  value: string;
  /** Keeps the panel mounted while hidden, preserving its state. */
  keepMounted?: boolean;
}

export function TabPanel({ value, keepMounted = false, className, children, ...rest }: TabPanelProps) {
  const tabs = useTabs('TabPanel');
  const selected = tabs.value === value;
  if (!selected && !keepMounted) return null;

  return (
    <div
      role="tabpanel"
      id={`${tabs.baseId}-panel-${value}`}
      aria-labelledby={`${tabs.baseId}-tab-${value}`}
      hidden={!selected}
      tabIndex={0}
      className={cx('mors-tab-panel', className)}
      {...rest}
    >
      {children}
    </div>
  );
}
