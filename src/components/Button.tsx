import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode, Ref } from 'react';
import { cx } from '../utils/cx';
import type { Size } from '../utils/types';
import { Spinner } from './Spinner';

export type ButtonVariant = 'primary' | 'secondary' | 'subtle' | 'ghost' | 'destructive' | 'link';

export interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'ref'> {
  variant?: ButtonVariant;
  size?: Size;
  block?: boolean;
  pill?: boolean;
  loading?: boolean;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  ref?: Ref<HTMLButtonElement>;
}

export function Button({
  variant = 'primary',
  size = 'md',
  block = false,
  pill = true,
  loading = false,
  startIcon,
  endIcon,
  className,
  children,
  disabled,
  type = 'button',
  ref,
  ...rest
}: ButtonProps) {
  return (
    <button
      ref={ref}
      type={type}
      className={cx(
        'mors-button',
        `mors-button--${variant}`,
        `mors-button--${size}`,
        block && 'mors-button--block',
        pill && 'mors-button--pill',
        loading && 'mors-is-loading',
        className,
      )}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...rest}
    >
      {loading && <Spinner className="mors-button-spinner" size={size === 'lg' ? 'md' : 'sm'} />}
      {startIcon && <span className="mors-button-affix">{startIcon}</span>}
      <span className="mors-button-label">{children}</span>
      {endIcon && <span className="mors-button-affix">{endIcon}</span>}
    </button>
  );
}

export interface IconButtonProps extends Omit<ButtonProps, 'startIcon' | 'endIcon' | 'block'> {
  /** Required: icon-only controls have no visible text to name them. */
  label: string;
  icon: ReactNode;
}

export function IconButton({
  label,
  icon,
  variant = 'ghost',
  size = 'md',
  pill = true,
  className,
  ref,
  ...rest
}: IconButtonProps) {
  return (
    <Button
      ref={ref}
      variant={variant}
      size={size}
      pill={pill}
      aria-label={label}
      className={cx('mors-icon-button', className)}
      {...rest}
    >
      {icon}
    </Button>
  );
}

export interface ButtonGroupProps extends HTMLAttributes<HTMLDivElement> {
  /** `attached` welds buttons into one segmented control; `spaced` keeps a gap. */
  variant?: 'attached' | 'spaced';
  orientation?: 'horizontal' | 'vertical';
  /** Announce the group to assistive tech, e.g. "Text alignment". */
  label?: string;
}

export function ButtonGroup({
  variant = 'attached',
  orientation = 'horizontal',
  label,
  className,
  children,
  ...rest
}: ButtonGroupProps) {
  return (
    <div
      role="group"
      aria-label={label}
      className={cx(
        'mors-button-group',
        `mors-button-group--${variant}`,
        `mors-button-group--${orientation}`,
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
}
