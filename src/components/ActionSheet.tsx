import {
  createContext,
  useContext,
  type ButtonHTMLAttributes,
  type ReactNode,
  useId,
  useMemo,
  useRef,
} from 'react';
import { cx } from '../utils/cx';
import { useDismiss } from '../hooks/useDismiss';
import { useFocusTrap } from '../hooks/useFocusTrap';
import { usePresence } from '../hooks/usePresence';
import { useScrollLock } from '../hooks/useScrollLock';
import { Portal } from './Portal';

const ActionSheetContext = createContext<{ close: () => void } | null>(null);

export interface ActionSheetProps {
  open: boolean;
  onClose: () => void;
  title?: ReactNode;
  cancelLabel?: ReactNode;
  children?: ReactNode;
  ariaLabel?: string;
  className?: string;
}

/**
 * iOS-style choice list from the bottom of the screen. Destructive actions
 * belong last. Cancel is a separate control under the group.
 */
export function ActionSheet({
  open,
  onClose,
  title,
  cancelLabel = 'Cancel',
  children,
  ariaLabel,
  className,
}: ActionSheetProps) {
  const surfaceRef = useRef<HTMLDivElement>(null);
  const refs = useMemo(() => [surfaceRef], [surfaceRef]);
  const titleId = `mors${useId()}-action-title`;
  const { mounted, state } = usePresence(open, 320);
  const closeApi = useMemo(() => ({ close: onClose }), [onClose]);

  useScrollLock(open);
  useFocusTrap(surfaceRef, open && mounted);
  useDismiss({
    enabled: open,
    onDismiss: onClose,
    refs,
    closeOnOutsidePointer: false,
  });

  if (!mounted) return null;

  return (
    <Portal>
      <div className={cx('mors-overlay', 'mors-action-sheet-overlay', className)} data-state={state}>
        <div className="mors-scrim" data-state={state} onClick={onClose} />
        <div
          ref={surfaceRef}
          className="mors-action-sheet"
          data-state={state}
          role="dialog"
          aria-modal="true"
          aria-label={title ? undefined : ariaLabel}
          aria-labelledby={title ? titleId : undefined}
          tabIndex={-1}
        >
          <div className="mors-action-sheet-group">
            {title && (
              <p className="mors-action-sheet-title" id={titleId}>
                {title}
              </p>
            )}
            <ActionSheetContext value={closeApi}>{children}</ActionSheetContext>
          </div>
          <button type="button" className="mors-action-sheet-cancel" onClick={onClose}>
            {cancelLabel}
          </button>
        </div>
      </div>
    </Portal>
  );
}

export interface ActionSheetItemProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onSelect'> {
  tone?: 'default' | 'danger';
  onSelect?: () => void;
}

export function ActionSheetItem({
  tone = 'default',
  onSelect,
  className,
  children,
  disabled,
  onClick,
  ...rest
}: ActionSheetItemProps) {
  const sheet = useContext(ActionSheetContext);
  return (
    <button
      type="button"
      className={cx(
        'mors-action-sheet-item',
        tone === 'danger' && 'mors-action-sheet-item--danger',
        className,
      )}
      disabled={disabled}
      onClick={(event) => {
        onClick?.(event);
        if (disabled || event.defaultPrevented) return;
        onSelect?.();
        sheet?.close();
      }}
      {...rest}
    >
      {children}
    </button>
  );
}
