import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import {
  Button as Btn,
  Badge,
  OverlayTrigger,
  Tooltip
} from 'react-bootstrap'

import Spinner from '../Spinner/Spinner'
import EDSCIcon from '../EDSCIcon/EDSCIcon'

import './Button.scss'

export const Button = React.forwardRef(({
  as,
  badge,
  badgeVariant,
  bootstrapVariant,
  bootstrapSize,
  className,
  children,
  dataTestId,
  disabled,
  href,
  icon,
  iconPosition,
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
  type,
  variant
}, ref) => {
  const buttonClasses = classNames(
    'button',
    {
      [`button--${variant}`]: !!variant,
      'button--icon': !!icon,
      'button--icon-only': !!icon && children === null,
      'button--icon-right': !!icon && iconPosition === 'right',
      'button--badge': !!badge,
      'button--svg-icon': icon && typeof icon !== 'string'
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

  let asEl
  if (as === 'button' && href) {
    asEl = undefined
  }

  const button = (
    <Btn
      ref={ref}
      as={asEl}
      className={buttonClasses}
      variant={bootstrapVariant}
      size={bootstrapSize}
      onClick={onClick}
      href={href}
      title={title || label}
      role="button"
      label={label}
      aria-label={label}
      type={type}
      disabled={disabled || spinner}
      target={target}
      rel={rel}
      style={style}
      data-test-id={dataTestId}
    >
      {(!spinner && icon && iconPosition === 'left') && (
        <EDSCIcon
          className={iconClasses}
          icon={icon}
          size={iconSize}
        />
      )}
      <span className="button__contents">
        { spinner
          ? (
            <span>
              <Spinner type="dots" color="white" size="tiny" inline />
            </span>
          )
          : children}
      </span>
      {(!spinner && icon && iconPosition === 'right') && (
        <EDSCIcon
          className={iconClasses}
          icon={icon}
          size={iconSize}
        />
      )}
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
})

Button.defaultProps = {
  as: 'button',
  badge: null,
  badgeVariant: null,
  bootstrapSize: null,
  bootstrapVariant: null,
  disabled: false,
  dataTestId: undefined,
  children: null,
  className: null,
  href: null,
  icon: null,
  iconPosition: 'left',
  iconSize: null,
  onClick: null,
  overlayClass: null,
  spinner: false,
  style: null,
  target: null,
  title: null,
  tooltip: null,
  tooltipId: null,
  tooltipPlacement: null,
  type: 'button',
  variant: undefined
}

Button.propTypes = {
  as: PropTypes.string,
  badge: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.node
  ]),
  badgeVariant: PropTypes.string,
  bootstrapSize: PropTypes.string,
  bootstrapVariant: PropTypes.string,
  dataTestId: PropTypes.string,
  disabled: PropTypes.bool,
  className: PropTypes.string,
  children: PropTypes.node,
  href: PropTypes.string,
  icon: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  iconPosition: PropTypes.string,
  iconSize: PropTypes.string,
  label: PropTypes.string.isRequired,
  onClick: PropTypes.func,
  overlayClass: PropTypes.string,
  spinner: PropTypes.bool,
  style: PropTypes.shape({}),
  target: PropTypes.string,
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
