/**
 * Convert a comma separated string into an object representing a shape
 * @param {String} pointString A comma separated string representing a list of points
 */
export const pointStringToLatLng = (pointString) => {
  const pointParts = pointString.split(',')

  if (pointParts.length <= 3) {
    const [lngString, latString, radius] = pointString.split(',')

    // Use lat and lng keys over a 2 item array in the event we need to also add radius for a circle
    const point = {
      lat: parseFloat(latString.trim()),
      lng: parseFloat(lngString.trim())
    }

    if (radius) {
      return {
        ...point,
        radius: parseFloat(radius.trim())
      }
    }

    return point
  }

  const result = pointString.match(/[^,]+,[^,]+/g)

  // OGC requires the parameters be reversed
  return result.reverse().map((point) => {
    const [lngString, latString] = point.split(',')

    return [
      parseFloat(latString.trim()),
      parseFloat(lngString.trim())
    ]
  })
}
