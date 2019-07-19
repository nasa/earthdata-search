import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import {
  Button as Btn,
  Badge,
  OverlayTrigger,
  Tooltip
} from 'react-bootstrap'

import './Button.scss'

export const Button = ({
  badge,
  badgeVariant,
  bootstrapVariant,
  bootstrapSize,
  className,
  children,
  disabled,
  href,
  icon,
  label,
  onClick,
  overlayClass,
  title,
  tooltip,
  tooltipPlacement,
  tooltipId,
  type,
  variant
}) => {
  const buttonClasses = classNames(
    'button',
    {
      [`button--${variant}`]: !!variant,
      'button--icon': !!icon,
      'button--badge': !!badge
    },
    className
  )

  let iconClasses

  if (icon) {
    iconClasses = classNames(
      'button__icon',
      children ? 'button__icon--push' : null,
      icon ? `fa fa-${icon}` : null
    )
  }

  let badgeClasses

  if (badge) {
    badgeClasses = classNames(
      'button__badge'
    )
  }

  const button = (
    <Btn
      className={buttonClasses}
      variant={bootstrapVariant}
      size={bootstrapSize}
      onClick={onClick}
      href={href}
      title={title}
      role="button"
      aria-label={label}
      type={type}
      disabled={disabled}
    >
      {icon && <i className={iconClasses} /> }
      <span className="button__contents">
        { children }
      </span>
      {badge && (
        <>
          <Badge
            className={badgeClasses}
            variant={badgeVariant === null ? 'secondary' : badgeVariant}
          >
            {badge}
          </Badge>
        </>
      )}
    </Btn>
  )

  if (tooltip && tooltipId) {
    return (
      <OverlayTrigger
        placement={tooltipPlacement || 'top'}
        overlay={(
          <Tooltip id={tooltipId} className={overlayClass}>{tooltip}</Tooltip>
        )}
      >
        {button}
      </OverlayTrigger>
    )
  }

  return button
}

Button.defaultProps = {
  badge: null,
  badgeVariant: null,
  bootstrapSize: null,
  bootstrapVariant: null,
  disabled: false,
  children: null,
  className: null,
  href: null,
  icon: null,
  onClick: null,
  overlayClass: null,
  popover: null,
  popoverId: null,
  title: null,
  tooltip: null,
  tooltipId: null,
  tooltipPlacement: null,
  type: 'button',
  variant: null
}

Button.propTypes = {
  badge: PropTypes.string,
  badgeVariant: PropTypes.string,
  bootstrapSize: PropTypes.string,
  bootstrapVariant: PropTypes.string,
  disabled: PropTypes.bool,
  className: PropTypes.string,
  children: PropTypes.node,
  href: PropTypes.string,
  icon: PropTypes.string,
  label: PropTypes.string.isRequired,
  onClick: PropTypes.func,
  overlayClass: PropTypes.string,
  title: PropTypes.string,
  tooltip: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.node
  ]),
  tooltipPlacement: PropTypes.string,
  tooltipId: PropTypes.string,
  type: PropTypes.string,
  variant: PropTypes.string
}

export default Button
