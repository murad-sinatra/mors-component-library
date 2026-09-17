import type { HTMLAttributes, ReactNode } from 'react';
import { cx } from '../utils/cx';
import { Icon, type IconName } from './Icon';
import { IconButton } from './Button';

export type AlertTone = 'info' | 'success' | 'warning' | 'danger' | 'neutral';

const TONE_ICON: Record<AlertTone, IconName> = {
  info: 'info',
  success: 'check-circle',
  warning: 'warning',
  danger: 'warning',
  neutral: 'info',
};

export interface AlertProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  tone?: AlertTone;
  variant?: 'soft' | 'outline';
  title?: ReactNode;
  icon?: ReactNode | null;
  actions?: ReactNode;
  onDismiss?: () => void;
  dismissLabel?: string;
}

export function Alert({
  tone = 'info',
  variant = 'soft',
  title,
  icon,
  actions,
  onDismiss,
  dismissLabel = 'Dismiss',
  className,
  children,
  ...rest
}: AlertProps) {
  const assertive = tone === 'danger' || tone === 'warning';
  return (
    <div
      className={cx('mors-alert', `mors-alert--${tone}`, `mors-alert--${variant}`, className)}
      role={assertive ? 'alert' : 'status'}
      {...rest}
    >
      {icon !== null && (
        <span className="mors-alert-icon">{icon ?? <Icon name={TONE_ICON[tone]} />}</span>
      )}
      <div className="mors-alert-content">
        {title && <p className="mors-alert-title">{title}</p>}
        {children && <div className="mors-alert-body">{children}</div>}
        {actions && <div className="mors-alert-actions">{actions}</div>}
      </div>
      {onDismiss && (
        <IconButton
          className="mors-alert-dismiss"
          label={dismissLabel}
          icon={<Icon name="close" />}
          size="sm"
          variant="ghost"
          onClick={onDismiss}
        />
      )}
    </div>
  );
}
