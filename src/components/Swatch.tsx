import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cx } from '../utils/cx';
import type { Size, Tone } from '../utils/types';
import { useControllableState } from '../hooks/useControllableState';
import { describedBy, Field, useFieldIds } from './Field';

export const SWATCH_TONES: readonly Tone[] = [
  'accent',
  'success',
  'warning',
  'danger',
  'info',
  'neutral',
];

const TONE_LABEL: Record<Tone, string> = {
  accent: 'Accent',
  success: 'Success',
  warning: 'Warning',
  danger: 'Danger',
  info: 'Info',
  neutral: 'Neutral',
};

export interface SwatchProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onClick'> {
  tone?: Tone;
  size?: Size;
  /** Draws the selected ring. Implied by SwatchGroup when this tone is active. */
  selected?: boolean;
  /** Accessible name. Defaults to the tone. Required for meaning when the swatch is a control. */
  label?: string;
  onClick?: () => void;
}

export function Swatch({
  tone = 'neutral',
  size = 'md',
  selected = false,
  label,
  onClick,
  disabled,
  className,
  type = 'button',
  ...rest
}: SwatchProps) {
  const classNames = cx(
    'mors-swatch',
    `mors-swatch--${tone}`,
    size !== 'md' && `mors-swatch--${size}`,
    selected && 'mors-swatch--selected',
    className,
  );
  const name = label ?? TONE_LABEL[tone];

  if (!onClick) {
    return <span className={classNames} aria-hidden="true" />;
  }

  return (
    <button
      type={type}
      className={classNames}
      aria-label={name}
      aria-pressed={selected}
      disabled={disabled}
      onClick={onClick}
      {...rest}
    />
  );
}

export interface SwatchGroupProps {
  value?: Tone;
  defaultValue?: Tone;
  onChange?: (tone: Tone) => void;
  /** Subset of tones to offer. Defaults to every semantic tone. */
  tones?: readonly Tone[];
  label?: ReactNode;
  description?: ReactNode;
  error?: ReactNode;
  size?: Size;
  block?: boolean;
  disabled?: boolean;
  required?: boolean;
  id?: string;
  className?: string;
}

export function SwatchGroup({
  value,
  defaultValue = 'accent',
  onChange,
  tones = SWATCH_TONES,
  label,
  description,
  error,
  size = 'md',
  block = true,
  disabled = false,
  required = false,
  id,
  className,
}: SwatchGroupProps) {
  const ids = useFieldIds(id);
  const [selected, setSelected] = useControllableState(value, defaultValue, onChange);
  const swatchSize = size === 'lg' ? 'lg' : 'md';

  return (
    <Field
      ids={ids}
      label={label}
      description={description}
      error={error}
      required={required}
      size={size}
      labelElement="span"
      block={block}
      className={className}
    >
      <div
        id={ids.id}
        role="group"
        aria-labelledby={label ? ids.labelId : undefined}
        aria-describedby={describedBy(ids, Boolean(description), Boolean(error))}
        className="mors-swatch-group"
      >
        {tones.map((tone) => (
          <Swatch
            key={tone}
            tone={tone}
            size={swatchSize}
            selected={selected === tone}
            disabled={disabled}
            onClick={() => setSelected(tone)}
          />
        ))}
      </div>
    </Field>
  );
}
