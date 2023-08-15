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

  const spatialVal = boundingBox || circle || line || point || polygon

  if (spatialVal) {
    const splitStr = spatialVal[0].split(',')

    if (boundingBox) {
      return `SW: (${splitStr[1]}, ${splitStr[0]}) NE: (${splitStr[3]}, ${splitStr[2]})`
    }
    if (circle) { return `Center: (${splitStr[1]}, ${splitStr[0]}) Radius (m): ${splitStr[2]})` }
    if (point) { return `Point: (${splitStr[1]}, ${splitStr[0]})` }
    if (line) { return `Start: (${splitStr[1]}, ${splitStr[0]}) End: (${splitStr[3]}, ${splitStr[2]})` }
    if (polygon) { return `${(polygon[0].split(',').length / 2) - 1} Points` }
  }
  return ''
}

export default createSpatialDisplay
