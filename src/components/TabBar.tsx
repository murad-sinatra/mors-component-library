import {
  createContext,
  useContext,
  useMemo,
  type AnchorHTMLAttributes,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type ReactNode,
} from 'react';
import { cx } from '../utils/cx';
import { useControllableState } from '../hooks/useControllableState';

interface TabBarContextValue {
  current: string;
  setCurrent: (value: string) => void;
}

const TabBarContext = createContext<TabBarContextValue | null>(null);

function useTabBar(): TabBarContextValue {
  const context = useContext(TabBarContext);
  if (!context) throw new Error('<TabBarItem> must be rendered inside <TabBar>.');
  return context;
}

export interface TabBarProps extends Omit<HTMLAttributes<HTMLElement>, 'onChange'> {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /** Show only below 768px. `always` keeps it on desktop too. */
  visibility?: 'mobile' | 'always';
  children?: ReactNode;
}

/**
 * Primary mobile navigation: three to five destinations, icon plus label,
 * optional badge, and safe-area padding. Distinct from Tabs (in-page) and
 * Navbar (top chrome).
 */
export function TabBar({
  value,
  defaultValue = '',
  onValueChange,
  visibility = 'mobile',
  className,
  children,
  ...rest
}: TabBarProps) {
  const [current, setCurrent] = useControllableState(value, defaultValue, onValueChange);
  const context = useMemo(() => ({ current, setCurrent }), [current, setCurrent]);

  return (
    <TabBarContext value={context}>
      <nav
        className={cx(
          'mors-tab-bar',
          visibility === 'mobile' && 'mors-tab-bar--mobile',
          className,
        )}
        {...rest}
      >
        {children}
      </nav>
    </TabBarContext>
  );
}

type TabBarItemShared = {
  value: string;
  icon: ReactNode;
  label: ReactNode;
  badge?: ReactNode;
};

export type TabBarItemProps = TabBarItemShared &
  (
    | ({ href: string } & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'children' | 'href'>)
    | ({ href?: undefined } & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'value'>)
  );

export function TabBarItem({ value, icon, label, badge, className, href, ...rest }: TabBarItemProps) {
  const bar = useTabBar();
  const selected = bar.current === value;
  const classNames = cx('mors-tab-bar-item', selected && 'mors-tab-bar-item--selected', className);

  const body = (
    <>
      <span className="mors-tab-bar-icon">
        {icon}
        {badge != null && <span className="mors-tab-bar-badge">{badge}</span>}
      </span>
      <span className="mors-tab-bar-label">{label}</span>
    </>
  );

  if (href) {
    const { onClick, ...linkRest } = rest as Omit<
      AnchorHTMLAttributes<HTMLAnchorElement>,
      'href' | 'children' | 'className'
    >;
    return (
      <a
        href={href}
        className={classNames}
        aria-current={selected ? 'page' : undefined}
        onClick={(event) => {
          onClick?.(event);
          if (!event.defaultPrevented) bar.setCurrent(value);
        }}
        {...linkRest}
      >
        {body}
      </a>
    );
  }

  const { onClick, ...buttonRest } = rest as Omit<
    ButtonHTMLAttributes<HTMLButtonElement>,
    'children' | 'className' | 'value'
  >;

  return (
    <button
      type="button"
      className={classNames}
      aria-current={selected ? 'page' : undefined}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) bar.setCurrent(value);
      }}
      {...buttonRest}
    >
      {body}
    </button>
  );
}
