import { useId, useState, type FormEvent, type HTMLAttributes, type ReactNode } from 'react';
import { cx } from '../utils/cx';
import type { Size } from '../utils/types';
import { Icon } from './Icon';

export interface FieldIds {
  id: string;
  labelId: string;
  descriptionId: string;
  errorId: string;
}

export interface FieldShellProps {
  label?: ReactNode;
  description?: ReactNode;
  error?: ReactNode;
  size?: Size;
  block?: boolean;
}

export function useFieldIds(explicitId?: string): FieldIds {
  const auto = useId();
  const id = explicitId ?? `mors${auto}`;
  return {
    id,
    labelId: `${id}-label`,
    descriptionId: `${id}-description`,
    errorId: `${id}-error`,
  };
}

export function describedBy(
  ids: FieldIds,
  hasDescription: boolean,
  hasError: boolean,
  extra?: string,
): string | undefined {
  return [hasDescription && ids.descriptionId, hasError && ids.errorId, extra].filter(Boolean).join(' ') || undefined;
}

export const REQUIRED_ERROR = 'This field is required.';

/**
 * Turns the browser's native required tooltip into the library FieldError.
 * Call `onInvalid` from the control; `reportValue` clears the message once
 * the field has content again.
 */
export function useRequiredValidity(required: boolean | undefined, error: ReactNode | undefined) {
  const [missing, setMissing] = useState(false);
  const shown = error ?? (required && missing ? REQUIRED_ERROR : undefined);

  const onInvalid = (event: FormEvent<HTMLElement>) => {
    event.preventDefault();
    if (required) setMissing(true);
  };

  const reportValue = (value: string) => {
    if (missing && value.trim().length > 0) setMissing(false);
  };

  return { error: shown, onInvalid, reportValue };
}

export function useFieldControl(explicitId?: string, required?: boolean, error?: ReactNode) {
  const ids = useFieldIds(explicitId);
  const validity = useRequiredValidity(required, error);
  return { ids, validity };
}

export interface FieldErrorProps extends HTMLAttributes<HTMLParagraphElement> {
  children: ReactNode;
}

export function FieldError({ children, className, ...rest }: FieldErrorProps) {
  return (
    <p className={cx('mors-field-error', className)} role="alert" {...rest}>
      <Icon name="warning" className="mors-field-error-icon" />
      <span>{children}</span>
    </p>
  );
}

export interface FieldProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'>, FieldShellProps {
  ids: FieldIds;
  required?: boolean;
  /** `label` for real form controls, `span` for composite widgets. */
  labelElement?: 'label' | 'span';
  children: ReactNode;
}

export function Field({
  ids,
  label,
  description,
  error,
  required = false,
  size = 'md',
  labelElement = 'label',
  block = true,
  className,
  children,
  ...rest
}: FieldProps) {
  const LabelTag = labelElement;
  return (
    <div
      className={cx(
        'mors-field',
        size !== 'md' && `mors-field--${size}`,
        block && 'mors-field--block',
        error && 'mors-field--invalid',
        className,
      )}
      {...rest}
    >
      {label && (
        <LabelTag
          className="mors-field-label"
          {...(labelElement === 'label' ? { htmlFor: ids.id } : { id: ids.labelId })}
        >
          {label}
          {required && (
            <span className="mors-field-required" aria-hidden="true">
              *
            </span>
          )}
        </LabelTag>
      )}
      {children}
      {description && (
        <p className="mors-field-description" id={ids.descriptionId}>
          {description}
        </p>
      )}
      {error && <FieldError id={ids.errorId}>{error}</FieldError>}
    </div>
  );
}
