import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import './Spinner.scss'

export const Dots = ({
  className,
  color,
  inline,
  size
}) => {
  const classes = classNames([
    'spinner',
    'spinner--dots',
    {
      [`spinner--${color}`]: color,
      [`spinner--${size}`]: size,
      'spinner--inline': inline,
      [className]: className
    }
  ])

  return (
    <div className={classes}>
      <div className="spinner__inner" />
      <div className="spinner__inner" />
      <div className="spinner__inner" />
    </div>
  )
}

Dots.defaultProps = {
  className: null,
  color: '',
  inline: false,
  size: ''
}

Dots.propTypes = {
  className: PropTypes.string,
  color: PropTypes.string,
  inline: PropTypes.bool,
  size: PropTypes.string
}

export const Spinner = ({
  className,
  color,
  inline,
  size,
  type
}) => {
  if (type === 'dots') return <Dots color={color} size={size} inline={inline} className={className} />
  return null
}

Spinner.defaultProps = {
  className: null,
  color: '',
  inline: false,
  size: ''
}

Spinner.propTypes = {
  className: PropTypes.string,
  color: PropTypes.string,
  inline: PropTypes.bool,
  size: PropTypes.string,
  type: PropTypes.string.isRequired
}

export default Spinner
