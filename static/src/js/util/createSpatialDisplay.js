import SpatialDisplay from '../components/SpatialDisplay/SpatialDisplay'

/**
 * Returns a string displaying the spatial information.
 * @param {Object} spatial Object that holds the different spatial areas.
 * @returns {String} Returns a string formatting the spatial areas into human readable values.
 */
export const createSpatialDisplay = (spatial) => {
  const {
    boundingBox,
    circle,
    line,
    point,
    polygon
  } = spatial

  const sDisplay = new SpatialDisplay()

  const selectedShape = boundingBox || circle || line || point || polygon

  if (selectedShape) {
    if (boundingBox) {
      const splitStr = sDisplay.transformBoundingBoxCoordinates(selectedShape[0])
      return `SW: (${splitStr[0]}) NE: (${splitStr[1]})`
    }

    if (circle) {
      const splitStr = sDisplay.transformCircleCoordinates(selectedShape[0])
      return `Center: (${splitStr[0]}) Radius (m): ${splitStr[1]})`
    }

    if (point) {
      return `Point: (${sDisplay.transformSingleCoordinate(selectedShape[0])})`
    }

    if (line) {
      const splitStr = sDisplay.transformBoundingBoxCoordinates(selectedShape[0])
      return `Start: (${splitStr[0]}) End: (${splitStr[1]})`
    }

    if (polygon) {
      const splitStr = selectedShape[0].split(',')
      const pointArray = splitStr.length
      const pointCount = (pointArray / 2) - 1
      return `${pointCount} Points`
    }
  }
  return ''
}

export default createSpatialDisplay
