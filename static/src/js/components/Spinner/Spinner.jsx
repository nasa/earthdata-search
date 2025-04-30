import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import './Spinner.scss'

export const Dots = ({
  className,
  color,
  dataTestId,
  inline,
  size,
  label
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
    <div
      className={classes}
      data-testid={dataTestId}
      role="status"
      aria-label={label}
    >
      <div className="spinner__inner" />
      <div className="spinner__inner" />
      <div className="spinner__inner" />
    </div>
  )
}

Dots.defaultProps = {
  className: null,
  dataTestId: null,
  color: '',
  inline: false,
  size: '',
  label: 'Loading...'
}

Dots.propTypes = {
  className: PropTypes.string,
  dataTestId: PropTypes.string,
  color: PropTypes.string,
  inline: PropTypes.bool,
  size: PropTypes.string,
  label: PropTypes.string
}

export const Spinner = ({
  className,
  color,
  dataTestId,
  inline,
  size,
  type,
  label
}) => {
  if (type === 'dots') {
    return (
      <Dots
        className={className}
        dataTestId={dataTestId}
        color={color}
        size={size}
        inline={inline}
        label={label}
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
  size: '',
  label: 'Loading...'
}

Spinner.propTypes = {
  className: PropTypes.string,
  dataTestId: PropTypes.string,
  color: PropTypes.string,
  inline: PropTypes.bool,
  size: PropTypes.string,
  type: PropTypes.string.isRequired,
  label: PropTypes.string
}

export default Spinner
