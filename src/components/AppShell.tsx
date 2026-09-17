import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type HTMLAttributes,
  type MouseEvent,
  type ReactNode,
} from 'react';
import { cx } from '../utils/cx';
import { useControllableState } from '../hooks/useControllableState';
import { IconButton, type IconButtonProps } from './Button';
import { Icon } from './Icon';

const NARROW = '(max-width: 768px)';

function useNarrow(): boolean {
  const [narrow, setNarrow] = useState(
    () => typeof window !== 'undefined' && window.matchMedia?.(NARROW).matches === true,
  );

  useEffect(() => {
    const media = window.matchMedia?.(NARROW);
    if (!media) return;
    const onChange = () => setNarrow(media.matches);
    media.addEventListener('change', onChange);
    setNarrow(media.matches);
    return () => media.removeEventListener('change', onChange);
  }, []);

  return narrow;
}

interface AppShellContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
  overlay: boolean;
}

const AppShellContext = createContext<AppShellContextValue | null>(null);

export function useAppShell(): AppShellContextValue {
  const context = useContext(AppShellContext);
  if (!context) throw new Error('<AppShellTrigger> must be rendered inside <AppShell>.');
  return context;
}

export interface AppShellProps extends HTMLAttributes<HTMLDivElement> {
  header?: ReactNode;
  sidebar?: ReactNode;
  tabBar?: ReactNode;
  children?: ReactNode;
  /** Mobile overlay. Ignored at 769px and up, where the sidebar is in-flow. */
  sidebarOpen?: boolean;
  defaultSidebarOpen?: boolean;
  onSidebarOpenChange?: (open: boolean) => void;
}

/**
 * Application frame: optional sidebar, header, main and tab bar. Below 768px
 * the sidebar becomes an overlay (controlled by `sidebarOpen`); the tab bar
 * sits on the bottom with safe-area padding.
 */
export function AppShell({
  header,
  sidebar,
  tabBar,
  children,
  sidebarOpen,
  defaultSidebarOpen = false,
  onSidebarOpenChange,
  className,
  ...rest
}: AppShellProps) {
  const narrow = useNarrow();
  const [open, setOpen] = useControllableState(sidebarOpen, defaultSidebarOpen, onSidebarOpenChange);
  const overlay = Boolean(sidebar) && narrow;

  const context = useMemo<AppShellContextValue>(
    () => ({ open, setOpen, overlay }),
    [open, setOpen, overlay],
  );

  return (
    <AppShellContext value={context}>
      <div
        className={cx(
          'mors-app-shell',
          sidebar && 'mors-app-shell--with-sidebar',
          tabBar && 'mors-app-shell--with-tabbar',
          overlay && open && 'mors-app-shell--sidebar-open',
          className,
        )}
        {...rest}
      >
        {sidebar && <div className="mors-app-shell-sidebar">{sidebar}</div>}
        {overlay && open && (
          <button
            type="button"
            className="mors-app-shell-scrim"
            aria-label="Close navigation"
            onClick={() => setOpen(false)}
          />
        )}
        {header && <div className="mors-app-shell-header">{header}</div>}
        <div className="mors-app-shell-main">{children}</div>
        {tabBar && <div className="mors-app-shell-tabbar">{tabBar}</div>}
      </div>
    </AppShellContext>
  );
}

export interface AppShellTriggerProps extends Omit<IconButtonProps, 'icon' | 'label'> {
  label?: string;
  icon?: ReactNode;
}

/** Menu control for the mobile sidebar overlay. Hidden at 769px and up. */
export function AppShellTrigger({
  label,
  icon,
  size = 'sm',
  className,
  onClick,
  ...rest
}: AppShellTriggerProps) {
  const { open, setOpen, overlay } = useAppShell();

  return (
    <IconButton
      {...rest}
      size={size}
      className={cx('mors-app-shell-trigger', className)}
      label={label ?? (open ? 'Close navigation' : 'Open navigation')}
      icon={icon ?? <Icon name={open ? 'close' : 'menu'} />}
      aria-expanded={overlay ? open : undefined}
      onClick={(event: MouseEvent<HTMLButtonElement>) => {
        onClick?.(event);
        if (event.defaultPrevented) return;
        setOpen(!open);
      }}
    />
  );
}
