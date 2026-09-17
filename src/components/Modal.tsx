import type { ReactNode } from 'react';
import { DialogFrame } from './internal/DialogFrame';

export type ModalSize = 'sm' | 'md' | 'lg' | 'xl';

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: ReactNode;
  description?: ReactNode;
  footer?: ReactNode;
  children?: ReactNode;
  size?: ModalSize;
  role?: 'dialog' | 'alertdialog';
  ariaLabel?: string;
  closeOnScrimClick?: boolean;
  closeOnEscape?: boolean;
  showCloseButton?: boolean;
  className?: string;
}

/**
 * Add `data-mors-autofocus` to a child to choose the initially focused element.
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
