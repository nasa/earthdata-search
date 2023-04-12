import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import './Spinner.scss'

export const Dots = ({
  className,
  color,
  dataTestId,
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
    <div className={classes} data-testid={dataTestId}>
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
  dataTestId,
  inline,
  size,
  type
}) => {
  if (type === 'dots') {
    return (
      <Dots
        className={className}
        dataTestId={dataTestId}
        color={color}
        size={size}
        inline={inline}
      />
    )
  }
  return null
}

Spinner.defaultProps = {
  className: null,
  dataTestId: null,
  color: '',
  inline: false,
  size: ''
}

Spinner.propTypes = {
  className: PropTypes.string,
  dataTestId: PropTypes.string,
  color: PropTypes.string,
  inline: PropTypes.bool,
  size: PropTypes.string,
  type: PropTypes.string.isRequired
}

export default Spinner
