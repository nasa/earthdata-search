import React, {
  MouseEvent,
  useEffect,
  useRef,
  useState
} from 'react'
import hexToRgba from 'hex-to-rgba'
import classNames from 'classnames'
import './ColorMap.scss'

/**
 * Renders supported html entities when they are provided by the colormaps endpoint.
 * @param {String} input - String that may contain an html entity.
 * @returns {React.ReactNode}
 */
const replaceSupportedHtmlEntities = (input: string): React.ReactNode | string => {
  const supportedHtmlEntitiesToFragmentsMap = {
    '&#60;': <>&#60;</>, // Less-than
    '&#61;': <>&#61;</>, // Greater-than
    '&#8804;': <>&#8804;</>, // Less-than or equal to
    '&#8805;': <>&#8805;</> // Greater-than or equal to
  }

  let returnValue: React.ReactNode | string = input

  Object.keys(supportedHtmlEntitiesToFragmentsMap).forEach((entity) => {
    if (input.includes(entity)) {
      returnValue = (
        <>
          {
            supportedHtmlEntitiesToFragmentsMap[
              entity as keyof typeof supportedHtmlEntitiesToFragmentsMap
            ]
          }
          {` ${input.replace(entity, '')}`}
        </>
      )
    }
  })

  return returnValue
}

type ColormapScale = {
  /** The scale object contains colors and labels */
  scale: {
    /** The colors in the colormap */
    colors: string[]
    /** The labels in the colormap */
    labels: string[]
  },
  /** The classes object is not used */
  classes?: undefined
}
type ColormapClasses = {
  /** The scale object is not used */
  scale?: undefined
  /** The classes object contains colors and labels */
  classes: {
    /** The colors in the colormap */
    colors: string[]
    /** The labels in the colormap */
    labels: string[]
  }
}

/** Colormap can have the scale or the classes object */
export type Colormap = ColormapScale | ColormapClasses

interface ColorMapProps {
  /** The colormap information */
  colorMap: Colormap
}

/**
 * Renders a colormap visualization
 * @param {Object} props - The props passed into the component.
 * @param {Object} props.colorMap - The colormap information.
 */
export const ColorMap: React.FC<ColorMapProps> = ({
  colorMap
}) => {
  if (!colorMap || Object.keys(colorMap).length === 0) {
    return null
  }

  const { scale, classes } = colorMap

  const colormapData = scale || classes

  const barRef = useRef<HTMLCanvasElement>(null)

  const [isFocused, setIsFocused] = useState(false)
  const [focusColor, setFocusColor] = useState<string | null>(null)
  const [focusLabel, setFocusLabel] = useState<string | null>(null)
  const [colormapIsRendered, setColormapIsRendered] = useState(false)

  useEffect(() => {
    if (barRef.current) {
      const {
        colors = [],
        labels = []
      } = colormapData

      // Create a canvas element to display the colormap.
      const canvas = barRef.current.getContext('2d')
      const cellWidth = barRef.current.width / labels.length
      const { height } = barRef.current
      const fillWidth = Math.ceil(cellWidth)

      // Ensure canvas context is not null before proceeding.
      if (canvas) {
        // Set the color for each step in the map.
        colors.forEach((color: string, index: number) => {
          canvas.fillStyle = hexToRgba(color)
          canvas.fillRect(Math.floor(index * cellWidth), 0, fillWidth, height)
        })
      }

      setColormapIsRendered(true)
    }
  }, [barRef.current, colorMap])

  const {
    colors = [],
    labels = []
  } = colormapData

  let minLabel
  let maxLabel

  const qualitative = classes && Object.keys(classes).length > 0
  const hoverPrompt = 'Hover for class names'
  if (qualitative) {
    minLabel = hoverPrompt
    maxLabel = null
  } else {
    [minLabel] = labels
    maxLabel = labels[labels.length - 1]
  }

  /**
   * Resets the focus state when a users mouse leaves the colormap.
   * @param {Object} event The event object.
   */
  const onMouseMove = (event: MouseEvent) => {
    const { offsetX } = event.nativeEvent
    const numEntries = labels.length

    // Determine the cell width in px using the number of colormap entries.
    const cellWidth = barRef.current ? barRef.current.clientWidth / numEntries : 0

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

  const colormapClassNames = classNames([
    'colormap',
    {
      'colormap--is-colormap-rendered': colormapIsRendered
    }
  ])

  return (
    <div className={colormapClassNames}>
      <canvas
        ref={barRef}
        className="colormap__bar"
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
      />
      <div className="colormap__meta">
        {
          isFocused
            ? (
              <div className="colormap__focus">
                <span
                  className="colormap__focus-label"
                  data-testid="legend-label"
                >
                  {replaceSupportedHtmlEntities(focusLabel || '')}
                </span>
              </div>
            )
            : (
              <div className="colormap__labels">
                {
                  minLabel && (
                    <span
                      className={`colormap__label colormap__label--min ${qualitative ? 'colormap__hover-prompt' : ''}`}
                      data-testid="legend-label-min"
                    >
                      {replaceSupportedHtmlEntities(minLabel || '')}
                    </span>
                  )
                }
                {
                  maxLabel && (
                    <span
                      className="colormap__label colormap__label--max"
                      data-testid="legend-label-max"
                    >
                      {replaceSupportedHtmlEntities(maxLabel || '')}
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

export default ColorMap
