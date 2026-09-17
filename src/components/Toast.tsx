import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { cx } from '../utils/cx';
import { Portal } from './Portal';
import { IconButton } from './Button';
import { Icon, type IconName } from './Icon';

export type ToastTone = 'neutral' | 'success' | 'warning' | 'danger' | 'info';

export type ToastPosition =
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right';

export interface ToastOptions {
  title: ReactNode;
  description?: ReactNode;
  tone?: ToastTone;
  /** Milliseconds before auto-dismiss; `0` keeps the toast until dismissed. */
  duration?: number;
  action?: { label: string; onClick: () => void };
}

export interface ToastRecord extends ToastOptions {
  id: string;
}

export interface ToastApi {
  toast: (options: ToastOptions) => string;
  dismiss: (id: string) => void;
  dismissAll: () => void;
}

const ToastContext = createContext<ToastApi | null>(null);

const TONE_ICON: Record<ToastTone, IconName> = {
  neutral: 'info',
  success: 'check-circle',
  warning: 'warning',
  danger: 'warning',
  info: 'info',
};

export interface ToastProviderProps {
  children: ReactNode;
  position?: ToastPosition;
  max?: number;
  defaultDuration?: number;
}

export function ToastProvider({
  children,
  position = 'bottom-right',
  max = 4,
  defaultDuration = 5000,
}: ToastProviderProps) {
  const [toasts, setToasts] = useState<ToastRecord[]>([]);
  const timers = useRef(new Map<string, ReturnType<typeof setTimeout>>());
  const counter = useRef(0);

  const dismiss = useCallback((id: string) => {
    const timer = timers.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timers.current.delete(id);
    }
    setToasts((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const dismissAll = useCallback(() => {
    for (const timer of timers.current.values()) clearTimeout(timer);
    timers.current.clear();
    setToasts([]);
  }, []);

  const toast = useCallback(
    (options: ToastOptions) => {
      counter.current += 1;
      const id = `mors-toast-${counter.current}`;
      const duration = options.duration ?? defaultDuration;

      setToasts((prev) => [...prev, { ...options, id }].slice(-max));
      if (duration > 0) {
        timers.current.set(
          id,
          setTimeout(() => dismiss(id), duration),
        );
      }
      return id;
    },
    [defaultDuration, dismiss, max],
  );

  const api = useMemo<ToastApi>(() => ({ toast, dismiss, dismissAll }), [toast, dismiss, dismissAll]);

  return (
    <ToastContext value={api}>
      {children}
      <Portal>
        <section
          className={cx('mors-toast-viewport', `mors-toast-viewport--${position}`)}
          aria-label="Notifications"
        >
          {toasts.map((item) => (
            <ToastItem key={item.id} toast={item} onDismiss={() => dismiss(item.id)} />
          ))}
        </section>
      </Portal>
    </ToastContext>
  );
}

function ToastItem({ toast, onDismiss }: { toast: ToastRecord; onDismiss: () => void }) {
  const tone = toast.tone ?? 'neutral';
  const assertive = tone === 'danger' || tone === 'warning';

  return (
    <div
      className={cx('mors-toast', `mors-toast--${tone}`)}
      role={assertive ? 'alert' : 'status'}
      aria-live={assertive ? 'assertive' : 'polite'}
    >
      <span className="mors-toast-icon">
        <Icon name={TONE_ICON[tone]} />
      </span>
      <div className="mors-toast-content">
        <p className="mors-toast-title">{toast.title}</p>
        {toast.description && <p className="mors-toast-description">{toast.description}</p>}
      </div>
      {toast.action && (
        <button
          type="button"
          className="mors-toast-action mors-focusable"
          onClick={() => {
            toast.action?.onClick();
            onDismiss();
          }}
        >
          {toast.action.label}
        </button>
      )}
      <IconButton
        className="mors-toast-close mors-close"
        label="Dismiss notification"
        icon={<Icon name="close" />}
        size="sm"
        variant="ghost"
        onClick={onDismiss}
      />
    </div>
  );
}

/** Throws when used outside a `ToastProvider`, which is always a wiring bug. */
export function useToast(): ToastApi {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used inside a <ToastProvider>.');
  return context;
}
