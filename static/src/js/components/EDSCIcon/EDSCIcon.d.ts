import * as React from 'react'

/** An interface for the EDSCIcon component */
export interface EDSCIconProps {
  ariaLabel?: string | null;
  children?: React.ReactNode;
  className?: string | null;
  context?: object | null;
  icon?: unknown | null;
  inlineFlex?: boolean;
  size?: string;
  title?: string | null;
  variant?: string | null;
  [key: string]: unknown; // Allows arbitrary additional props
}

declare const EDSCIcon: React.ForwardRefExoticComponent<
  EDSCIconProps & React.RefAttributes<unknown>
>

export default EDSCIcon
