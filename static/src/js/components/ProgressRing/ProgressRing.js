import React from 'react'
import PropTypes from 'prop-types'

import './ProgressRing.scss'

/**
 * Renders ProgressRing.
 * @param {String} className - An optional classname.
 * @param {Number} progress - The current progress as a number between 0 and 100.
 * @param {Number} strokeWidth - The stroke width.
 * @param {Number} width - The prop passed into the component.
 */
export const ProgressRing = ({
  className,
  progress,
  strokeWidth,
  width
}) => {
  // Calculate the radius for the current width and stroke width
  const radius = (width / 2) - strokeWidth

  const circumference = (radius * 2) * Math.PI

  // Calculate the offset to be used on the stroke
  const offset = circumference - ((progress / 100) * circumference)

  // Set the styles for the progress circle
  const circleStyles = {
    strokeDasharray: `${circumference} ${circumference}`,
    strokeDashoffset: offset
  }

  const classNames = `progress-ring${className ? ` ${className}` : ''}`

  return (
    <span className={classNames}>
      <svg
        className="progress-ring__ring"
        height={width}
        width={width}
      >
        <circle
          className="progress-ring__circle-back"
          strokeWidth={strokeWidth}
          fill="transparent"
          r={radius}
          cx={width / 2}
          cy={width / 2}
        />
        <circle
          style={circleStyles}
          className="progress-ring__progress"
          strokeWidth={strokeWidth}
          fill="transparent"
          r={radius}
          cx={width / 2}
          cy={width / 2}
        />
      </svg>
    </span>
  )
}
ProgressRing.defaultProps = {
  className: '',
  progress: 0,
  width: 16,
  strokeWidth: 3
}

ProgressRing.propTypes = {
  className: PropTypes.string,
  progress: PropTypes.number,
  width: PropTypes.number,
  strokeWidth: PropTypes.number
}

export default ProgressRing
