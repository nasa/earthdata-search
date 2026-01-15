import React from 'react'
import classNames from 'classnames'

/** An interface for the Dots component */
export interface DotsProps {
  /** A classname for the element */
  className?: string | null
  /** The color of the dots. Needs to match the one of the classes in Spinner.scss */
  color?: string
  /** A id for testing */
  dataTestId?: string | null
  /** Adds `inline-flex` so the Dots component can be displayed inline */
  inline?: boolean
  /** The size of the dots. Needs to match the one of the classes in Spinner.scss */
  size?: string
  /** An accessible label */
  label?: string
}

const Dots: React.FC<DotsProps> = ({
  className = null,
  color = '',
  dataTestId = null,
  inline = false,
  size = '',
  label = 'Loading...'
}) => {
  const classes = classNames([
    'spinner',
    'spinner--dots',
    {
      [`spinner--${color}`]: color,
      [`spinner--${size}`]: size,
      'spinner--inline': inline,
      [className as string]: className
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

export default Dots
