import React, { useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import hexToRgba from 'hex-to-rgba'

import './Legend.scss'
import classNames from 'classnames'

export const Legend = ({
  colorMap = {}
}) => {
  const barRef = useRef()

  const [isFocused, setIsFocused] = useState(false)
  const [focusColor, setFocusColor] = useState(null)
  const [focusLabel, setFocusLabel] = useState(null)
  const [colormapIsRendered, setColormapIsRendered] = useState(false)

  useEffect(() => {
    if (barRef.current && colorMap.scale) {
      const { scale = {} } = colorMap
      const { colors = [], labels = [] } = scale

      // Create a canvas element to display the colormap.
      const canvas = barRef.current.getContext('2d')
      const cellWidth = barRef.current.width / labels.length
      const { height } = barRef.current
      const fillWidth = Math.ceil(cellWidth)

      // Set the color for each step in the map.
      colors.forEach((color, i) => {
        canvas.fillStyle = hexToRgba(color)
        canvas.fillRect(Math.floor(i * cellWidth), 0, fillWidth, height)
      })

      setColormapIsRendered(true)
    }
  }, [barRef.current, colorMap])

  // If no colormap is available, hide the legend.
  if (!colorMap || !colorMap.scale) return null

  const { scale = {} } = colorMap
  const { labels = [], colors = [] } = scale
  const minLabel = labels[0]
  const maxLabel = labels[labels.length - 1]

  /**
   * Resets the focus state when a users mouse leaves the colormap.
   * @param {Object} event The event object.
   */
  const onMouseMove = (event) => {
    const { offsetX } = event.nativeEvent
    const numEntries = labels.length

    // Determine the cell width in px using the number of colormap entries.
    const cellWidth = barRef.current.clientWidth / numEntries

    // Determine the current index based on the x offset and cell width. The .min and .max are
    // used to make sure the index is bounded as a user moves out of the colormap.
    const actualIndex = Math.floor(offsetX / cellWidth)
    const maxBoundedIndex = Math.min(numEntries - 1, actualIndex)
    const minMaxBoundedIndex = Math.max(maxBoundedIndex, 0)

    // Set the focus state visible as well as the label and color.
    setFocusLabel(labels[minMaxBoundedIndex])
    setFocusColor(hexToRgba(colors[minMaxBoundedIndex]))
    setIsFocused(true)
  }

  /**
   * Resets the focus state when a users mouse leaves the colormap
   */
  const onMouseLeave = () => {
    // Reset the focus state values.
    setFocusColor(null)
    setFocusLabel(null)
    setIsFocused(false)
  }

  const legendClassNames = classNames([
    'legend',
    {
      'legend--is-colormap-rendered': colormapIsRendered
    }
  ])

  return (
    <div className={legendClassNames}>
      <canvas
        ref={barRef}
        className="legend__bar"
        onMouseMove={(e) => onMouseMove(e)}
        onMouseLeave={(e) => onMouseLeave(e)}
      />
      <div className="legend__meta">
        {
          isFocused
            ? (
              <div className="legend__focus">
                <span className="legend__focus-label-color" style={{ backgroundColor: focusColor }} />
                <span
                  className="legend__focus-label"
                  // eslint-disable-next-line react/no-danger
                  dangerouslySetInnerHTML={{ __html: focusLabel }}
                />
              </div>
            )
            : (
              <div className="legend__labels">
                {
                  minLabel && (
                    <span
                      className="legend__label legend__label--min"
                      // eslint-disable-next-line react/no-danger
                      dangerouslySetInnerHTML={{ __html: minLabel }}
                    />
                  )
                }
                {
                  maxLabel && (
                    <span
                      className="legend__label legend__label--max"
                      // eslint-disable-next-line react/no-danger
                      dangerouslySetInnerHTML={{ __html: maxLabel }}
                    />
                  )
                }
              </div>
            )
        }
      </div>
    </div>
  )
}

Legend.defaultProps = {
  colorMap: null
}

Legend.propTypes = {
  colorMap: PropTypes.shape({})
}

export default Legend
