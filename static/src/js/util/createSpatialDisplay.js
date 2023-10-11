/**
   * Turns '1,2' into '2,1' for leaflet
   * @param {String} coordinateString A single coordinate representing a point on a map
   */
export const transformSingleCoordinate = (coordinateString) => {
  if (!coordinateString) return ''

  return coordinateString.split(',').reverse().join(',').replace(/\s/g, '')
}

/**
   * Turns '1,2,3,4' into ['2,1', '4,3'] for leaflet
   * @param {String} boundingBoxCoordinates A set of two points representing a bounding box
   */
// Returns empty strings by default as input fields cannot be set to undefined
export const transformBoundingBoxCoordinates = (boundingBoxCoordinates) => (
  boundingBoxCoordinates
    ? boundingBoxCoordinates
      .match(/[^,]+,[^,]+/g)
      .map((pointStr) => transformSingleCoordinate(pointStr))
    : ['', ''])

/**
   * Turns '1,2,3' into ['2,1', '3'] for leaflet
   * @param {String} circleCoordinates A center point and radius
   */
export const transformCircleCoordinates = (circleCoordinates) => {
  if (!circleCoordinates) return ['', '']

  const points = circleCoordinates.split(',')

  const [
    lat = '',
    lng = '',
    radius = ''
  ] = points

  if (lat && lng) {
    const coordinate = [lat, lng]

    return [transformSingleCoordinate(coordinate.join(',')), radius]
  }

  return ['', '']
}

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

  const selectedShape = boundingBox || circle || line || point || polygon

  if (selectedShape) {
    if (boundingBox) {
      const splitStr = transformBoundingBoxCoordinates(selectedShape[0])
      console.log(splitStr)

      return `SW: (${splitStr[0]}) NE: (${splitStr[1]})`
    }

    if (circle) {
      const splitStr = transformCircleCoordinates(selectedShape[0])

      return `Center: (${splitStr[0]}) Radius (m): ${splitStr[1]})`
    }

    if (point) {
      return `Point: (${transformSingleCoordinate(selectedShape[0])})`
    }

    if (line) {
      const splitStr = transformBoundingBoxCoordinates(selectedShape[0])

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
