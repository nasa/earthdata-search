import React, {
  forwardRef,
  ReactNode,
  CSSProperties
} from 'react'
import classNames from 'classnames'
import type {
  BadgeProps as BSBadgeProps,
  ButtonProps as BSButtonProps,
  OverlayTriggerProps as BSOverlayTriggerProps
} from 'react-bootstrap'
import Btn from 'react-bootstrap/Button'
import Badge from 'react-bootstrap/Badge'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
// @ts-expect-error: This file does not have types
import { ArrowLineRight } from '@edsc/earthdata-react-icons/horizon-design-system/hds/ui'

import Spinner from '../Spinner/Spinner'
import EDSCIcon from '../EDSCIcon/EDSCIcon'

import renderTooltip from '../../util/renderTooltip'

import './Button.scss'

/**
 * Props for the Button component.
 */
export interface ButtonProps {
  /** The HTML element or component to render as the button. */
  as?: string | React.ComponentType<unknown> | undefined
  /** ARIA label for accessibility. */
  ariaLabel?: string
  /** Badge content to display on the button. */
  badge?: string | ReactNode
  /** Bootstrap variant for the badge. */
  badgeVariant?: BSBadgeProps['bg'],
  /** Bootstrap variant for the button. */
  bootstrapVariant?: BSButtonProps['variant']
  /** Bootstrap size for the button. */
  bootstrapSize?: BSButtonProps['size'],
  /** Additional class names for styling. */
  className?: string
  /** Button content, including text or other elements. */
  children?: ReactNode
  /** Test ID for testing purposes. */
  dataTestId?: string
  /** Whether the button is displayed on a dark background */
  dark?: boolean
  /** Whether the button is disabled. */
  disabled?: boolean
  /** Whether the button is a download link. */
  download?: boolean
  /** URL to navigate to if the button is a link. */
  href?: string
  /** Icon to display in the button. */
  icon?: string | (() => void)
  /** Position of the icon ('left' or 'right'). */
  iconPosition?: 'left' | 'right'
  /** Size of the icon. */
  iconSize?: string
  /** Button label (used for accessibility). */
  label?: string
  /** Click event handler. */
  onClick?: () => void
  /** CSS class for the tooltip overlay. */
  overlayClass?: string
  /** Whether to display a loading spinner. */
  spinner?: boolean
  /** Inline styles for the button. */
  style?: CSSProperties
  /** The target attribute (e.g., '_blank' for new tab). */
  target?: string
  /** Tooltip title or button title. */
  title?: string
  /** Tooltip content. */
  tooltip?: string | ReactNode
  /** Placement of the tooltip (e.g., 'top', 'bottom'). */
  tooltipPlacement?: BSOverlayTriggerProps['placement'],
  /** Unique ID for the tooltip. */
  tooltipId?: string
  /** Tooltip keyboard shortcut. */
  tooltipKeyboardShortcut?: string
  /** The button type attribute. */
  type?: BSButtonProps['type']
  /** Custom variant for the button styling. */
  variant?: 'naked' | 'full' | 'link' | 'hds-primary'
}

type BootstrapButtonProps = React.ComponentProps<typeof Btn>

/**
 * A button component with various styling options.
*/
export const Button = forwardRef<ButtonProps, BootstrapButtonProps>(({
  as = 'button',
  ariaLabel,
  badge,
  badgeVariant = 'secondary',
  bootstrapVariant = '', // An empty string is used as a default to prevent defaulting to a primary button
  bootstrapSize,
  className,
  children,
  dataTestId,
  dark = false,
  disabled = false,
  download,
  href,
  icon,
  iconPosition = 'left',
  iconSize,
  label,
  onClick,
  overlayClass,
  spinner,
  style,
  target,
  title,
  tooltip,
  tooltipPlacement,
  tooltipId,
  tooltipKeyboardShortcut,
  type = 'button',
  variant
}, ref) => {
  const buttonClasses = classNames(
    'button',
    {
      [`button--${variant}`]: !!variant,
      'button--dark': dark,
      'button--icon': !!icon,
      'button--icon-only': !!icon && children === null,
      'button--icon-right': !!icon && iconPosition === 'right',
      'button--badge': !!badge,
      'button--svg-icon': icon && typeof icon !== 'string',
      link: variant === 'link'
    },
    className
  )

  let iconClasses

  if (icon) {
    iconClasses = classNames(
      'button__icon',
      children ? 'button__icon--push' : null,
      typeof icon === 'string' && icon.includes('edsc') ? icon : null
    )
  }

  let badgeClasses

  if (badge) {
    badgeClasses = classNames(
      'button__badge'
    )
  }

  let rel
  if (target && target === '_blank') {
    rel = 'noopener nofollow'
  }

  let asEl = as
  if (as === 'button' && href) {
    asEl = undefined
  }

  let componentVariant = bootstrapVariant

  if (!bootstrapVariant && variant === 'hds-primary') {
    componentVariant = 'naked'
  }

  let hdsPrimaryIconSize = '10'

  if (bootstrapSize === 'sm') {
    hdsPrimaryIconSize = '8'
  }

  if (bootstrapSize === 'lg') {
    hdsPrimaryIconSize = '12'
  }

  const childrenClasses = classNames(
    'button__contents'
  )

  const button = (
    <Btn
      ref={ref}
      as={asEl}
      className={buttonClasses}
      variant={componentVariant}
      size={bootstrapSize}
      onClick={onClick}
      href={href}
      title={title || label}
      role="button"
      label={label}
      aria-label={ariaLabel || label}
      type={type}
      disabled={disabled || spinner}
      target={target}
      rel={rel}
      style={style}
      data-testid={dataTestId}
      download={download}
    >
      {
        (!spinner && icon && iconPosition === 'left') && (
          <EDSCIcon
            className={iconClasses}
            icon={icon}
            size={iconSize}
          />
        )
      }
      {
        spinner
          ? (
            <span className="button__contents">
              <span className="d-inline-flex">
                <Spinner type="dots" color="white" size="tiny" inline />
              </span>
            </span>
          )
          : (
            <span className={childrenClasses}>
              {children}
            </span>
          )
      }
      {
        (!spinner && icon && iconPosition === 'right') && (
          <EDSCIcon
            className={iconClasses}
            icon={icon}
            size={iconSize}
          />
        )
      }
      {
        badge && (
          <Badge
            className={badgeClasses}
            bg={badgeVariant}
          >
            {badge}
          </Badge>
        )
      }
      {
        variant === 'hds-primary' && (
          <EDSCIcon
            className="button__hds-primary-icon"
            icon={ArrowLineRight}
            size={hdsPrimaryIconSize}
          />
        )
      }
    </Btn>
  )

  if (tooltip && tooltipId) {
    let tooltipContent = tooltip

    if (tooltipKeyboardShortcut) {
      tooltipContent = (
        <span className="text-nowrap">
          {tooltip}
          {
            tooltipKeyboardShortcut && (
              <span className="keyboard-shortcut ms-1">
                {tooltipKeyboardShortcut}
              </span>
            )
          }
        </span>
      )
    }

    return (
      <OverlayTrigger
        placement={tooltipPlacement || 'top'}
        delay={
          {
            show: 250,
            hide: 0
          }
        }
        overlay={
          (tooltipProps) => renderTooltip({
            children: tooltipContent,
            className: overlayClass,
            id: tooltipId,
            ...tooltipProps
          })
        }
      >
        {button}
      </OverlayTrigger>
    )
  }

  return button
})

Button.displayName = 'Button'

export default Button
