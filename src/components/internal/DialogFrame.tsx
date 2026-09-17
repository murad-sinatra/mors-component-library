import { useId, useMemo, useRef, type CSSProperties, type ReactNode } from 'react';
import { cx } from '../../utils/cx';
import { useDismiss } from '../../hooks/useDismiss';
import { useFocusTrap } from '../../hooks/useFocusTrap';
import { usePresence } from '../../hooks/usePresence';
import { useScrollLock } from '../../hooks/useScrollLock';
import { Portal } from '../Portal';
import { IconButton } from '../Button';
import { Icon } from '../Icon';

export interface DialogFrameProps {
  open: boolean;
  onClose: () => void;
  /** BEM block for the surface, e.g. `mors-modal`. */
  block: string;
  surfaceClassName?: string;
  className?: string;
  style?: CSSProperties;
  role?: 'dialog' | 'alertdialog';
  title?: ReactNode;
  description?: ReactNode;
  footer?: ReactNode;
  children?: ReactNode;
  /** Required when no visible `title` is provided. */
  ariaLabel?: string;
  closeOnScrimClick?: boolean;
  closeOnEscape?: boolean;
  showCloseButton?: boolean;
  closeLabel?: string;
  /** Must match the CSS exit transition, in ms. */
  transitionDuration?: number;
  container?: Element | null;
}

/**
 * Shared modal-surface behaviour for Modal and Drawer: portal, scrim, focus
 * trap, scroll lock, escape/scrim dismissal, presence animation and the
 * dialog/label aria wiring.
 */
export function DialogFrame({
  open,
  onClose,
  block,
  surfaceClassName,
  className,
  style,
  role = 'dialog',
  title,
  description,
  footer,
  children,
  ariaLabel,
  closeOnScrimClick = true,
  closeOnEscape = true,
  showCloseButton = true,
  closeLabel = 'Close',
  transitionDuration = 260,
  container,
}: DialogFrameProps) {
  const surfaceRef = useRef<HTMLDivElement>(null);
  const refs = useMemo(() => [surfaceRef], [surfaceRef]);
  const baseId = useId();
  const titleId = `mors${baseId}-title`;
  const descriptionId = `mors${baseId}-description`;
  const { mounted, state } = usePresence(open, transitionDuration);

  useScrollLock(open);
  useFocusTrap(surfaceRef, open && mounted);
  useDismiss({
    enabled: open,
    onDismiss: onClose,
    refs,
    closeOnEscape,
    closeOnOutsidePointer: false,
  });

  if (!mounted) return null;

  return (
    <Portal container={container}>
      <div className={cx('mors-overlay', `${block}-overlay`, className)} data-state={state}>
        <div
          className="mors-scrim"
          data-state={state}
          onClick={closeOnScrimClick ? onClose : undefined}
        />
        <div
          ref={surfaceRef}
          className={cx(block, surfaceClassName)}
          style={style}
          data-state={state}
          role={role}
          aria-modal="true"
          aria-label={title ? undefined : ariaLabel}
          aria-labelledby={title ? titleId : undefined}
          aria-describedby={description ? descriptionId : undefined}
          tabIndex={-1}
        >
          {(title || description || showCloseButton) && (
            <header className={`${block}-header`}>
              <div className={`${block}-heading`}>
                {title && (
                  <h2 className={`${block}-title`} id={titleId}>
                    {title}
                  </h2>
                )}
                {description && (
                  <p className={`${block}-description`} id={descriptionId}>
                    {description}
                  </p>
                )}
              </div>
              {showCloseButton && (
                <IconButton
                  className={`${block}-close mors-close`}
                  label={closeLabel}
                  icon={<Icon name="close" />}
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                />
              )}
            </header>
          )}
          {children != null && <div className={`${block}-body`}>{children}</div>}
          {footer && <footer className={`${block}-footer`}>{footer}</footer>}
        </div>
      </div>
    </Portal>
  );
}
