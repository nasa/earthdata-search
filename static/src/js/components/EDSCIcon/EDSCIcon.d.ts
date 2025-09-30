import * as React from 'react'

/** An interface for the EDSCIcon component */
export interface EDSCIconProps {
  /** An accessible label */
  ariaLabel?: string;
  /** The children */
  children?: React.ReactNode;
  /** A class name for the element */
  className?: string;
  /** An optional icon context */
  context?: object;
  /** An icon element. This is unknown due to the complexity of type required to support our icon libraries. */
  icon?: unknown;
  /** Allows the icon to be displayed inline-flex */
  inlineFlex?: boolean;
  /** The size of the icon. Should be set in px */
  size?: string;
  /** An HTML title */
  title?: string;
  /** The variant. This should match a variant class name from EDSCIcon.scss */
  variant?: string;
}

declare const EDSCIcon: React.ForwardRefExoticComponent<
  EDSCIconProps & React.RefAttributes<unknown>
>

export default EDSCIcon
