import { useId, type HTMLAttributes, type ReactNode } from 'react';
import { cx } from '../utils/cx';
import type { Size } from '../utils/types';

export interface FieldIds {
  id: string;
  descriptionId: string;
  errorId: string;
}

/** Generates the id trio every labelled control needs for aria wiring. */
export function useFieldIds(explicitId?: string): FieldIds {
  const auto = useId();
  const id = explicitId ?? `mors${auto}`;
  return { id, descriptionId: `${id}-description`, errorId: `${id}-error` };
}

/** Joins the ids a control should point `aria-describedby` at. */
export function describedBy(
  ids: FieldIds,
  hasDescription: boolean,
  hasError: boolean,
  extra?: string,
): string | undefined {
  const parts = [
    hasDescription ? ids.descriptionId : null,
    hasError ? ids.errorId : null,
    extra ?? null,
  ].filter(Boolean);
  return parts.length > 0 ? parts.join(' ') : undefined;
}

export interface FieldProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  ids: FieldIds;
  label?: ReactNode;
  description?: ReactNode;
  /** When present the field renders in its invalid state. */
  error?: ReactNode;
  required?: boolean;
  size?: Size;
  /** `label` for real form controls, `span` for composite widgets. */
  labelElement?: 'label' | 'span';
  block?: boolean;
  children: ReactNode;
}

/**
 * Shared layout for labelled controls: label, control slot, description and
 * error message. Keeping this in one place means the aria relationships and
 * spacing rhythm are identical across every form component.
 */
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
        `mors-field--${size}`,
        block && 'mors-field--block',
        error && 'mors-field--invalid',
        className,
      )}
      {...rest}
    >
      {label && (
        <LabelTag
          className="mors-field-label"
          {...(labelElement === 'label' ? { htmlFor: ids.id } : { id: `${ids.id}-label` })}
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
      {error && (
        <p className="mors-field-error" id={ids.errorId}>
          {error}
        </p>
      )}
    </div>
  );
}
