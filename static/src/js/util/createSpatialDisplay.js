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
    const splitStr = selectedShape[0].split(',')

    if (boundingBox) { return `SW: (${splitStr[1]}, ${splitStr[0]}) NE: (${splitStr[3]}, ${splitStr[2]})` }
    if (circle) { return `Center: (${splitStr[1]}, ${splitStr[0]}) Radius (m): ${splitStr[2]})` }
    if (point) { return `Point: (${splitStr[1]}, ${splitStr[0]})` }
    if (line) { return `Start: (${splitStr[1]}, ${splitStr[0]}) End: (${splitStr[3]}, ${splitStr[2]})` }
    if (polygon) {
      const pointArray = splitStr.length
      const pointCount = (pointArray / 2) - 1
      return `${pointCount} Points`
    }
  }
  return ''
}

export default createSpatialDisplay
