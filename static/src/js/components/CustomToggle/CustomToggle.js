/* eslint-disable react/jsx-props-no-spreading */
import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import EDSCIcon from '../EDSCIcon/EDSCIcon'

import './CustomToggle.scss'

/**
 * Renders CustomToggle.
 * @param {Object} props - The props passed into the component.
 * @param {Nose} props.children - The children components
 * @param {String} props.className - String to use as the class name
 * @param {Function} props.handleOpen - Callback to fire when the toggle is opened
 * @param {Function} props.handleClose - Callback to fire when the toggle is closed
 * @param {String} props.icon - The optional icon name
 * @param {Function} props.onClick - Callback to fire on click
 * @param {Boolean} props.openOnHover - Flag designating if the menu should be opened on hover
 * @param {String} props.title - A string to use for the button title
 */
export const CustomToggle = React.forwardRef(({
  children,
  className,
  handleOpen,
  handleClose,
  icon,
  onClick,
  openOnHover,
  title,
  ...props
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

  // Default the event handlers to the onClick
  let buttonEventHandlers = { onClick: (e) => handleClick(e) }

  // If openOnHover is set and the handler functions are defined, set the event handlers
  if (
    openOnHover
    && typeof handleOpen === 'function'
    && typeof handleClose === 'function'
  ) {
    buttonEventHandlers = {
      onMouseIn: (e) => handleOpen(e),
      onMouseOut: (e) => handleClose(e)
    }
  }

  return (
    <button
      className={buttonClasses}
      type="button"
      ref={ref}
      title={title}
      {...buttonEventHandlers}
      {...props}
    >
      {icon && (
        <EDSCIcon
          size="0.875rem"
          icon={icon}
          className="custom-toggle__icon"
        />
      )}
      {children}
    </button>
  )
})

CustomToggle.defaultProps = {
  children: null,
  className: null,
  icon: null,
  openOnHover: false,
  handleClose: null,
  handleOpen: null,
  onClick: null
}

CustomToggle.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  handleClose: PropTypes.func,
  handleOpen: PropTypes.func,
  icon: PropTypes.func,
  onClick: PropTypes.func,
  openOnHover: PropTypes.bool,
  title: PropTypes.string.isRequired
}

export default CustomToggle
