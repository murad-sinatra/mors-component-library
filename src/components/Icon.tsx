import type { ReactNode, SVGProps } from 'react';
import { cx } from '../utils/cx';

/**
 * A small hand-rolled, stroke-based icon set. Keeping it in-tree avoids adding
 * an icon package (and its bundle weight) to a library whose only runtime
 * dependency should be React itself.
 */
export type IconName =
  | 'arrow-down'
  | 'arrow-right'
  | 'arrow-up'
  | 'bell'
  | 'calendar'
  | 'check'
  | 'check-circle'
  | 'chevron-down'
  | 'chevron-left'
  | 'chevron-right'
  | 'chevron-up'
  | 'close'
  | 'copy'
  | 'external'
  | 'filter'
  | 'info'
  | 'inbox'
  | 'menu'
  | 'minus'
  | 'more'
  | 'moon'
  | 'plus'
  | 'search'
  | 'sliders'
  | 'sort'
  | 'star'
  | 'sun'
  | 'trash'
  | 'upload'
  | 'user'
  | 'warning';

const PATHS: Record<IconName, ReactNode> = {
  'arrow-down': <path d="M12 5v14m0 0l-6-6m6 6l6-6" />,
  'arrow-right': <path d="M5 12h14m0 0l-6-6m6 6l-6 6" />,
  'arrow-up': <path d="M12 19V5m0 0l6 6m-6-6l-6 6" />,
  bell: <path d="M18 9a6 6 0 1 0-12 0c0 5-2 6-2 6h16s-2-1-2-6M10.5 20a2 2 0 0 0 3 0" />,
  calendar: (
    <>
      <rect x="3.5" y="5" width="17" height="15.5" rx="3.5" />
      <path d="M3.5 10h17M8.5 3.5v3m7-3v3" />
    </>
  ),
  check: <path d="M4.5 12.5l5 5 10-11" />,
  'check-circle': (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M8.5 12.5l2.5 2.5 4.5-5" />
    </>
  ),
  'chevron-down': <path d="M6 9.5l6 6 6-6" />,
  'chevron-left': <path d="M14.5 6l-6 6 6 6" />,
  'chevron-right': <path d="M9.5 6l6 6-6 6" />,
  'chevron-up': <path d="M6 14.5l6-6 6 6" />,
  close: <path d="M6.5 6.5l11 11m0-11l-11 11" />,
  copy: (
    <>
      <rect x="9" y="9" width="11" height="11" rx="2.5" />
      <path d="M15 6.5A2.5 2.5 0 0 0 12.5 4H6.5A2.5 2.5 0 0 0 4 6.5v6A2.5 2.5 0 0 0 6.5 15" />
    </>
  ),
  external: <path d="M14 4.5h5.5V10M19 5l-8 8M18 14v4a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4" />,
  filter: <path d="M4 6.5h16M7 12h10m-7 5.5h4" />,
  info: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 11v5.5M12 7.75h.01" />
    </>
  ),
  inbox: (
    <>
      <path d="M3.5 13.5L6 6a2 2 0 0 1 1.9-1.4h8.2A2 2 0 0 1 18 6l2.5 7.5" />
      <path d="M3.5 13.5h4l1.5 2.5h6l1.5-2.5h4v3.5a2.5 2.5 0 0 1-2.5 2.5H6a2.5 2.5 0 0 1-2.5-2.5z" />
    </>
  ),
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  minus: <path d="M5.5 12h13" />,
  more: (
    <>
      <circle cx="6" cy="12" r="1.4" fill="currentColor" stroke="none" />
      <circle cx="12" cy="12" r="1.4" fill="currentColor" stroke="none" />
      <circle cx="18" cy="12" r="1.4" fill="currentColor" stroke="none" />
    </>
  ),
  moon: <path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5z" />,
  plus: <path d="M12 5.5v13M5.5 12h13" />,
  search: (
    <>
      <circle cx="10.75" cy="10.75" r="6.25" />
      <path d="M15.5 15.5l4.5 4.5" />
    </>
  ),
  sliders: <path d="M4 8h10m3 0h3M4 16h4m3 0h9M14 5.5v5m-6 3v5" />,
  sort: <path d="M8 4.5v15m0 0l-3.5-3.5M8 19.5L11.5 16M16 19.5v-15m0 0L12.5 8M16 4.5L19.5 8" />,
  star: <path d="M12 4l2.5 5.2 5.5.8-4 3.9 1 5.6-5-2.8-5 2.8 1-5.6-4-3.9 5.5-.8z" />,
  sun: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 3v2m0 14v2M3 12h2m14 0h2M5.6 5.6l1.4 1.4m10 10l1.4 1.4m0-12.8l-1.4 1.4m-10 10L5.6 18.4" />
    </>
  ),
  trash: <path d="M4.5 7h15M9.5 7V5.5A1.5 1.5 0 0 1 11 4h2a1.5 1.5 0 0 1 1.5 1.5V7m-8 0l.8 11.2A2 2 0 0 0 9.3 20h5.4a2 2 0 0 0 2-1.8L17.5 7" />,
  upload: <path d="M12 16.5V4.5m0 0l-5 5m5-5l5 5M5 19.5h14" />,
  user: (
    <>
      <circle cx="12" cy="8.5" r="3.75" />
      <path d="M4.75 20c.9-3.7 3.8-5.75 7.25-5.75S18.35 16.3 19.25 20" />
    </>
  ),
  warning: (
    <>
      <path d="M12 4.75L20.5 19.25H3.5z" />
      <path d="M12 10v4.25M12 17h.01" />
    </>
  ),
};

export interface IconProps extends Omit<SVGProps<SVGSVGElement>, 'name' | 'children'> {
  name: IconName;
  /** Any CSS length. Defaults to `1em` so icons scale with surrounding text. */
  size?: number | string;
  /** Provide to expose the icon to assistive tech; omit for decorative icons. */
  label?: string;
}

export function Icon({ name, size, label, className, style, ...rest }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={cx('mors-icon', className)}
      style={size === undefined ? style : { width: size, height: size, ...style }}
      aria-hidden={label ? undefined : true}
      role={label ? 'img' : undefined}
      aria-label={label}
      focusable="false"
      {...rest}
    >
      {PATHS[name]}
    </svg>
  );
}
