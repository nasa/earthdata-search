import React from 'react'
import PropTypes from 'prop-types'
import {
  uniqueId,
  mapValues,
  isString,
  isNumber
} from 'lodash-es'
import classNames from 'classnames'

import './Skeleton.scss'

const normalizeSizeValues = (obj) => mapValues(obj, (value) => {
  if (isNumber(value)) return `${value / 16}rem`
  if (isString(value) && value.indexOf('px') > -1) return `${parseInt(value, 10) / 16}rem`

  return value
})

/**
 * Renders loading placeholder.
 * @param {string} props.className - An optional className to pass into the rendered element.
 * @param {object} props.containerStyle - CSS in JS style object to apply additional styles.
 * @param {array} props.shapes - An array of objects defining the individual skeleton shapes.
 */
export const Skeleton = ({
  className,
  dataTestId,
  containerStyle,
  shapes,
  variant
}) => {
  const shapeElements = shapes.map((shape, i) => {
    let item = null
    const key = uniqueId('skeleton_key_')
    const styles = normalizeSizeValues(shape)

    if (styles.shape === 'rectangle') {
      item = (
        <div
          key={key}
          className={`skeleton__item skeleton__item-${i}`}
          data-testid={styles['data-testid']}
          style={
            {
              top: styles.top,
              left: styles.left,
              right: styles.right,
              width: styles.width,
              height: styles.height,
              borderRadius: styles.radius
            }
          }
        >
          <span className="skeleton__item-inner" />
        </div>
      )
    }

    return item
  })

  const normalizedStyles = normalizeSizeValues(containerStyle)

  const classes = classNames([
    'skeleton',
    {
      [`skeleton--${variant}`]: variant,
      [className]: className
    }
  ])

  return (
    <div
      className={classes}
      data-testid={dataTestId}
      style={{ ...normalizedStyles }}
    >
      <div
        className="skeleton__inner"
      >
        {shapeElements}
      </div>
    </div>
  )
}

Skeleton.defaultProps = {
  className: '',
  dataTestId: undefined,
  variant: null
}

Skeleton.propTypes = {
  className: PropTypes.string,
  dataTestId: PropTypes.string,
  containerStyle: PropTypes.shape({}).isRequired,
  shapes: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  variant: PropTypes.string
}

export default Skeleton
