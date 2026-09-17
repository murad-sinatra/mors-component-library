import { useState, type HTMLAttributes, type ImgHTMLAttributes } from 'react';
import { cx } from '../utils/cx';

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export interface AvatarProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'children'> {
  name: string;
  src?: string;
  size?: AvatarSize;
  shape?: 'circle' | 'rounded';
  status?: 'online' | 'busy' | 'offline';
  imgProps?: ImgHTMLAttributes<HTMLImageElement>;
}

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).slice(0, 2);
  return parts.map((part) => part.charAt(0).toUpperCase()).join('') || '?';
}

export function Avatar({
  name,
  src,
  size = 'md',
  shape = 'circle',
  status,
  imgProps,
  className,
  ...rest
}: AvatarProps) {
  const [failed, setFailed] = useState(false);
  const showImage = Boolean(src) && !failed;

  return (
    <span
      className={cx('mors-avatar', size !== 'md' && `mors-avatar--${size}`, shape !== 'circle' && `mors-avatar--${shape}`, className)}
      {...rest}
    >
      {showImage ? (
        <img
          className="mors-avatar-image"
          src={src}
          alt={name}
          loading="lazy"
          onError={() => setFailed(true)}
          {...imgProps}
        />
      ) : (
        <span aria-hidden="true">{initials(name)}</span>
      )}
      {!showImage && <span className="mors-visually-hidden">{name}</span>}
      {status && (
        <span
          className={cx('mors-avatar-status', `mors-avatar-status--${status}`)}
          role="img"
          aria-label={`${name} is ${status}`}
        />
      )}
    </span>
  );
}

export interface AvatarGroupProps extends HTMLAttributes<HTMLDivElement> {
  max?: number;
  size?: AvatarSize;
  people: readonly { name: string; src?: string }[];
}

export function AvatarGroup({ people, max = 4, size = 'md', className, ...rest }: AvatarGroupProps) {
  const visible = people.slice(0, max);
  const overflow = people.length - visible.length;

  return (
    <div className={cx('mors-avatar-group', className)} {...rest}>
      {visible.map((person) => (
        <Avatar key={person.name} name={person.name} src={person.src} size={size} />
      ))}
      {overflow > 0 && (
        <span className={cx('mors-avatar', size !== 'md' && `mors-avatar--${size}`, 'mors-avatar--overflow')}>
          <span aria-hidden="true">+{overflow}</span>
          <span className="mors-visually-hidden">{overflow} more people</span>
        </span>
      )}
    </div>
  );
}
