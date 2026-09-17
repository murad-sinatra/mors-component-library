import {
  createContext,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
} from 'react';
import { cx } from '../utils/cx';
import { useDismiss } from '../hooks/useDismiss';
import { useFocusTrap } from '../hooks/useFocusTrap';
import { usePresence } from '../hooks/usePresence';
import { useScrollLock } from '../hooks/useScrollLock';
import { Portal } from './Portal';
import { Icon } from './Icon';
import { Kbd } from './Kbd';

interface CommandContextValue {
  query: string;
  setQuery: (query: string) => void;
  close: () => void;
}

const CommandContext = createContext<CommandContextValue | null>(null);

function useCommand(): CommandContextValue {
  const context = useContext(CommandContext);
  if (!context) throw new Error('Command parts must be rendered inside <CommandPalette>.');
  return context;
}

export interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
  placeholder?: string;
  children?: ReactNode;
  ariaLabel?: string;
  className?: string;
}

/**
 * Jump-to overlay. Filter by typing; arrows move, Enter runs the highlighted
 * command, Escape closes. Wire your own ⌘K to toggle `open`.
 */
export function CommandPalette({
  open,
  onClose,
  placeholder = 'Jump to…',
  children,
  ariaLabel = 'Command palette',
  className,
}: CommandPaletteProps) {
  const surfaceRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const refs = useMemo(() => [surfaceRef], [surfaceRef]);
  const { mounted, state } = usePresence(open, 160);
  const inputId = `mors${useId()}-command`;
  const [query, setQuery] = useState('');

  useScrollLock(open);
  useFocusTrap(surfaceRef, open && mounted);
  useDismiss({
    enabled: open,
    onDismiss: onClose,
    refs,
    closeOnOutsidePointer: false,
  });

  useEffect(() => {
    if (open) setQuery('');
  }, [open]);

  const items = () =>
    Array.from(listRef.current?.querySelectorAll<HTMLButtonElement>('[data-mors-command-item]') ?? []);

  const onListKey = (event: KeyboardEvent<HTMLDivElement>) => {
    const all = items();
    if (all.length === 0) return;
    const current = all.indexOf(document.activeElement as HTMLButtonElement);

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      all[(current + 1 + all.length) % all.length]?.focus();
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      if (current <= 0) inputRef.current?.focus();
      else all[current - 1]?.focus();
    }
  };

  const commandApi = useMemo(() => ({ query, setQuery, close: onClose }), [query, onClose]);

  if (!mounted) return null;

  return (
    <Portal>
      <div className={cx('mors-overlay', 'mors-command-overlay', className)} data-state={state}>
        <div className="mors-scrim" data-state={state} onClick={onClose} />
        <div
          ref={surfaceRef}
          className="mors-command"
          data-state={state}
          role="dialog"
          aria-modal="true"
          aria-label={ariaLabel}
          tabIndex={-1}
        >
          <CommandContext value={commandApi}>
            <div className="mors-command-search">
              <Icon name="search" className="mors-command-search-icon" />
              <input
                ref={inputRef}
                id={inputId}
                className="mors-command-input"
                placeholder={placeholder}
                value={query}
                data-mors-autofocus
                autoComplete="off"
                spellCheck={false}
                onChange={(event) => setQuery(event.currentTarget.value)}
                onKeyDown={(event) => {
                  if (event.key === 'ArrowDown') {
                    event.preventDefault();
                    items()[0]?.focus();
                  }
                }}
              />
              <Kbd keys={['esc']} />
            </div>
            <div ref={listRef} className="mors-command-list" tabIndex={-1} onKeyDown={onListKey}>
              {children}
              <CommandEmpty />
            </div>
          </CommandContext>
        </div>
      </div>
    </Portal>
  );
}

export interface CommandGroupProps extends HTMLAttributes<HTMLDivElement> {
  heading?: ReactNode;
}

export function CommandGroup({ heading, className, children, ...rest }: CommandGroupProps) {
  return (
    <div className={cx('mors-command-group', className)} {...rest}>
      {heading && <p className="mors-command-heading">{heading}</p>}
      {children}
    </div>
  );
}

export interface CommandItemProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onSelect'> {
  icon?: ReactNode;
  shortcut?: ReactNode;
  keywords?: readonly string[];
  onSelect?: () => void;
}

export function CommandItem({
  icon,
  shortcut,
  keywords,
  onSelect,
  className,
  children,
  disabled,
  onClick,
  ...rest
}: CommandItemProps) {
  const command = useCommand();
  const haystack = [String(children), ...(keywords ?? [])].join(' ').toLowerCase();
  const visible = !command.query.trim() || haystack.includes(command.query.trim().toLowerCase());
  if (!visible) return null;

  return (
    <button
      type="button"
      data-mors-command-item=""
      className={cx('mors-command-item', className)}
      disabled={disabled}
      onClick={(event) => {
        onClick?.(event);
        if (disabled || event.defaultPrevented) return;
        onSelect?.();
        command.close();
      }}
      {...rest}
    >
      {icon && <span className="mors-command-item-icon">{icon}</span>}
      <span className="mors-command-item-label">{children}</span>
      {shortcut && <span className="mors-command-item-shortcut">{shortcut}</span>}
    </button>
  );
}

export function CommandEmpty({ children = 'No results' }: { children?: ReactNode }) {
  return <p className="mors-command-empty">{children}</p>;
}
