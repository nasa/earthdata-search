import React from 'react'
import PropTypes from 'prop-types'
import { Button as Btn, Badge } from 'react-bootstrap'
import classNames from 'classnames'

import './Button.scss'

export const Button = ({
  badge,
  badgeVariant,
  bootstrapVariant,
  className,
  children,
  href,
  icon,
  onClick,
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
      icon ? `fa fa-${icon}` : null
    )
  }

  let badgeClasses

  if (badge) {
    badgeClasses = classNames(
      'button__badge'
    )
  }

  return (
    <Btn
      className={buttonClasses}
      variant={bootstrapVariant}
      onClick={onClick}
      href={href}
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
}

Button.defaultProps = {
  badge: null,
  badgeVariant: null,
  bootstrapVariant: null,
  className: null,
  href: null,
  icon: null,
  onClick: null,
  variant: null
}

Button.propTypes = {
  badge: PropTypes.string,
  badgeVariant: PropTypes.string,
  bootstrapVariant: PropTypes.string,
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
  href: PropTypes.string,
  icon: PropTypes.string,
  onClick: PropTypes.func,
  variant: PropTypes.string
}

export default Button
