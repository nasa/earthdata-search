import React from 'react'
import PropTypes from 'prop-types'
import { uniqueId } from 'lodash'

import './Skeleton.scss'

/**
 * Renders loading placeholder.
 * @param {string} props.className - An optional className to pass into the rendered element.
 * @param {object} props.containerStyle - CSS in JS style object to apply additional styles.
 * @param {array} props.shapes - An array of objects defining the individual skeleton shapes.
 */
export const Skeleton = ({
  className,
  containerStyle,
  shapes
}) => {
  const clippingPathId = uniqueId('skeleton_clipping_path_')

  const shapeElements = shapes.map((shape) => {
    let item = null
    const key = uniqueId('skeleton_key_')
    if (shape.shape === 'rectangle') {
      item = (
        <rect
          key={key}
          x={`${shape.x}`}
          y={`${shape.y}`}
          height={`${shape.height}`}
          width={`${shape.width}`}
          rx={`${shape.radius}`}
          ry={`${shape.radius}`}
        />
      )
    }
    return item
  })

  return (
    <div
      className={`skeleton ${className}`}
      style={{ ...containerStyle }}
    >
      <div
        className="skeleton__inner"
        style={
        {
          clipPath: `url(#${clippingPathId})`
        }
      }
      />
      <svg width="0" height="0">
        <defs>
          <clipPath id={clippingPathId}>
            {shapeElements}
          </clipPath>
        </defs>
      </svg>
    </div>
  )
}

Skeleton.defaultProps = {
  className: ''
}

Skeleton.propTypes = {
  className: PropTypes.string,
  containerStyle: PropTypes.shape({}).isRequired,
  shapes: PropTypes.arrayOf(PropTypes.shape({})).isRequired
}

export default Skeleton
