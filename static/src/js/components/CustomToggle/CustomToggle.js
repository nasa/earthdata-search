import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import EDSCIcon from '../EDSCIcon/EDSCIcon'

import './CustomToggle.scss'

export const CustomToggle = React.forwardRef(({
  children,
  className,
  icon,
  onClick,
  title
}, ref) => {
  const handleClick = (e) => {
    e.preventDefault()

    onClick(e)
  }

  const buttonClasses = classNames(
    'custom-toggle',
    {
      'custom-toggle--icon': icon
    },
    className
  )

  let iconClasses

  if (icon) {
    iconClasses = 'custom-toggle__icon'
  }

  return (
    <button
      className={buttonClasses}
      type="button"
      ref={ref}
      title={title}
      onClick={handleClick}
    >
      {icon && <EDSCIcon icon={icon} className={iconClasses} />}
      {children}
    </button>
  )
})

CustomToggle.defaultProps = {
  children: null,
  className: null,
  icon: null
}

CustomToggle.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  icon: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  onClick: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired
}

export default CustomToggle
