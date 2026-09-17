import {
  Children,
  isValidElement,
  type HTMLAttributes,
  type ReactElement,
  type ReactNode,
} from 'react';
import { cx } from '../utils/cx';
import { Icon } from './Icon';

export interface StepsProps extends HTMLAttributes<HTMLOListElement> {
  /** 0-based index of the current step. */
  current: number;
  orientation?: 'horizontal' | 'vertical';
  children: ReactNode;
}

export interface StepProps extends Omit<HTMLAttributes<HTMLLIElement>, 'title'> {
  title: ReactNode;
  description?: ReactNode;
}

/**
 * Linear process indicator for onboarding, checkout and wizards. Current,
 * complete and upcoming states are exposed to assistive tech.
 */
export function Steps({
  current,
  orientation = 'horizontal',
  className,
  children,
  ...rest
}: StepsProps) {
  const items = Children.toArray(children).filter(isValidElement) as ReactElement<StepProps>[];

  return (
    <ol
      className={cx('mors-steps', `mors-steps--${orientation}`, className)}
      {...rest}
    >
      {items.map((child, index) => {
        const complete = index < current;
        const active = index === current;
        const { title, description, className: itemClass, ...itemRest } = child.props;

        return (
          <li
            key={child.key ?? index}
            className={cx(
              'mors-step',
              complete && 'mors-step--complete',
              active && 'mors-step--current',
              itemClass,
            )}
            aria-current={active ? 'step' : undefined}
            {...itemRest}
          >
            <span className="mors-step-index" aria-hidden="true">
              {complete ? <Icon name="check" /> : index + 1}
            </span>
            <span className="mors-step-copy">
              <span className="mors-step-title">{title}</span>
              {description && <span className="mors-step-description">{description}</span>}
            </span>
          </li>
        );
      })}
    </ol>
  );
}

export function Step(_props: StepProps) {
  return null;
}
