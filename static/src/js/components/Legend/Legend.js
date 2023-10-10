import React, {
  useEffect,
  useRef,
  useState
} from 'react'
import PropTypes from 'prop-types'
import hexToRgba from 'hex-to-rgba'
import classNames from 'classnames'

import './Legend.scss'

/**
 * Renders supported html entities when they are provided by the colormaps endpoint.
 * @param {String} string - String that may contain an html entity.
 * @returns {String}
 */
const replaceSupportedHtmlEntities = (string) => {
  const supportedHtmlEntitiesToFragmentsMap = {
    '&#60;': <>&#60;</>, // Less-than
    '&#61;': <>&#61;</>, // Greater-than
    '&#8804;': <>&#8804;</>, // Less-than or equal to
    '&#8805;': <>&#8805;</> // Greater-than or equal to
  }

  let returnValue = string

  Object.keys(supportedHtmlEntitiesToFragmentsMap).forEach((entity) => {
    if (string.includes(entity)) {
      returnValue = (
        <>
          {supportedHtmlEntitiesToFragmentsMap[entity]}
          {` ${string.replace(entity, '')}`}
        </>
      )
    }
  })

  return returnValue
}

/**
 * Renders a legend on the map when a colormap is present
 * @param {Object} props - The props passed into the component.
 * @param {Object} props.colorMap - The colormap information.
 */
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
    <div className={legendClassNames} data-testid="legend">
      <canvas
        ref={barRef}
        className="legend__bar"
        onMouseMove={(event) => onMouseMove(event)}
        onMouseLeave={(event) => onMouseLeave(event)}
      />
      <div className="legend__meta">
        {
          isFocused
            ? (
              <div className="legend__focus">
                <span
                  className="legend__focus-label-color"
                  style={{ backgroundColor: focusColor }}
                  data-testid="legend-label-color"
                />
                <span
                  className="legend__focus-label"
                  data-testid="legend-label"
                >
                  {replaceSupportedHtmlEntities(focusLabel)}
                </span>
              </div>
            )
            : (
              <div className="legend__labels">
                {
                  minLabel && (
                    <span
                      className="legend__label legend__label--min"
                      data-testid="legend-label-min"
                    >
                      {replaceSupportedHtmlEntities(minLabel)}
                    </span>
                  )
                }
                {
                  maxLabel && (
                    <span
                      className="legend__label legend__label--max"
                      data-testid="legend-label-max"
                    >
                      {replaceSupportedHtmlEntities(maxLabel)}
                    </span>
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
