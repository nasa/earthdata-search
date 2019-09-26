import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import './Spinner.scss'

export const Dots = ({
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
      'spinner--inline': inline
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
  color: '',
  inline: false,
  size: ''
}

Dots.propTypes = {
  color: PropTypes.string,
  inline: PropTypes.bool,
  size: PropTypes.string
}

export const Spinner = ({
  color,
  inline,
  size,
  type
}) => {
  if (type === 'dots') return <Dots color={color} size={size} inline={inline} />
  return null
}

Spinner.defaultProps = {
  color: '',
  inline: false,
  size: ''
}

Spinner.propTypes = {
  color: PropTypes.string,
  inline: PropTypes.bool,
  size: PropTypes.string,
  type: PropTypes.string.isRequired
}

export default Spinner
