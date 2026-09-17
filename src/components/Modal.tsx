import type { ReactNode } from 'react';
import { DialogFrame } from './internal/DialogFrame';

export type ModalSize = 'sm' | 'md' | 'lg' | 'xl';

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: ReactNode;
  description?: ReactNode;
  /** Action row pinned to the bottom of the surface. */
  footer?: ReactNode;
  children?: ReactNode;
  size?: ModalSize;
  /** Use `alertdialog` for destructive confirmations. */
  role?: 'dialog' | 'alertdialog';
  /** Required when there is no visible `title`. */
  ariaLabel?: string;
  closeOnScrimClick?: boolean;
  closeOnEscape?: boolean;
  showCloseButton?: boolean;
  className?: string;
}

/**
 * Centred modal dialog. Focus is trapped while open, the page behind is locked,
 * and focus returns to the trigger on close. Add `data-mors-autofocus` to a
 * child to choose the initially focused element.
 */
export function Modal({ size = 'md', className, ...rest }: ModalProps) {
  return (
    <DialogFrame
      block="mors-modal"
      surfaceClassName={`mors-modal--${size}`}
      className={className}
      {...rest}
    />
  );
}
