import { useState, type ReactNode } from 'react';
import { DialogFrame } from './internal/DialogFrame';

export type DrawerSide = 'left' | 'right' | 'top' | 'bottom';

export interface DrawerProps {
  open: boolean;
  onClose: () => void;
  side?: DrawerSide;
  /** Any CSS length: width for left/right, height for top/bottom. */
  size?: string;
  title?: ReactNode;
  description?: ReactNode;
  footer?: ReactNode;
  children?: ReactNode;
  ariaLabel?: string;
  closeOnScrimClick?: boolean;
  closeOnEscape?: boolean;
  showCloseButton?: boolean;
  className?: string;
}

/**
 * Edge-anchored panel sharing Modal's focus, scroll-lock and dismissal
 * behaviour. Left/right drawers become full-width sheets on small screens.
 */
export function Drawer({ side = 'right', size, className, open, ...rest }: DrawerProps) {
  const [exitSide, setExitSide] = useState(side);
  if (open && side !== exitSide) setExitSide(side);

  return (
    <DialogFrame
      open={open}
      block="mors-drawer"
      surfaceClassName={`mors-drawer--${exitSide}`}
      className={className}
      style={size ? { ['--mors-drawer-size' as string]: size } : undefined}
      transitionDuration={320}
      {...rest}
    />
  );
}
