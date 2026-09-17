import type { ReactNode } from 'react';
import { Button } from './Button';
import { Modal } from './Modal';

export interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  /** Called when the confirm control is pressed. You close the dialog. */
  onConfirm: () => void;
  title: ReactNode;
  description?: ReactNode;
  confirmLabel?: ReactNode;
  cancelLabel?: ReactNode;
  /** Destructive confirmations use the danger button and block scrim dismissal. */
  tone?: 'default' | 'danger';
  loading?: boolean;
  children?: ReactNode;
}

/**
 * A ready-made `alertdialog` on top of Modal: title, description, cancel and
 * confirm. Use `tone="danger"` for irreversible actions.
 */
export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  tone = 'default',
  loading = false,
  children,
}: ConfirmDialogProps) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      role="alertdialog"
      size="sm"
      title={title}
      description={description}
      closeOnScrimClick={tone !== 'danger' && !loading}
      closeOnEscape={!loading}
      showCloseButton={false}
      footer={
        <>
          <Button variant="ghost" onClick={onClose} disabled={loading}>
            {cancelLabel}
          </Button>
          <Button
            variant={tone === 'danger' ? 'destructive' : 'primary'}
            loading={loading}
            onClick={onConfirm}
          >
            {confirmLabel}
          </Button>
        </>
      }
    >
      {children}
    </Modal>
  );
}
