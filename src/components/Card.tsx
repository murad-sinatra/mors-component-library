import type { HTMLAttributes, ReactNode } from 'react';
import { cx } from '../utils/cx';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  elevation?: 'flat' | 'raised' | 'floating';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hover?: boolean;
  interactive?: boolean;
}

export function Card({
  elevation = 'raised',
  padding = 'md',
  hover = false,
  interactive = false,
  className,
  children,
  ...rest
}: CardProps) {
  return (
    <div
      className={cx(
        'mors-card',
        `mors-card--${elevation}`,
        padding !== 'md' && `mors-card--padding-${padding}`,
        (hover || interactive) && 'mors-card--hover',
        interactive && 'mors-card--interactive',
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
}

export interface CardHeaderProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  title?: ReactNode;
  subtitle?: ReactNode;
  actions?: ReactNode;
}

export function CardHeader({
  title,
  subtitle,
  actions,
  className,
  children,
  ...rest
}: CardHeaderProps) {
  return (
    <div className={cx('mors-card-header', className)} {...rest}>
      <div className="mors-card-heading">
        {title && <h3 className="mors-card-title">{title}</h3>}
        {subtitle && <p className="mors-card-subtitle">{subtitle}</p>}
        {children}
      </div>
      {actions && <div className="mors-card-actions">{actions}</div>}
    </div>
  );
}

export function CardBody({ className, children, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cx('mors-card-body', className)} {...rest}>
      {children}
    </div>
  );
}

export function CardFooter({ className, children, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cx('mors-card-footer', className)} {...rest}>
      {children}
    </div>
  );
}

export interface CardMediaProps extends HTMLAttributes<HTMLDivElement> {
  ratio?: string;
}

export function CardMedia({ ratio = '16 / 9', className, style, children, ...rest }: CardMediaProps) {
  return (
    <div
      className={cx('mors-card-media', className)}
      style={{ aspectRatio: ratio, ...style }}
      {...rest}
    >
      {children}
    </div>
  );
}
