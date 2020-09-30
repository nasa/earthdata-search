import { isClockwiseLatLng } from '../../../static/src/js/util/map/granules'

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

  let result = pointString.match(/[^,]+,[^,]+/g)

  // If the point string contains more than 4 values, its a polygon and we
  // need to consider the direction of the points because OGC requires the
  // parameters to be counter clockwise
  if (pointParts.length > 4) {
    const latLngs = result.map((point) => {
      const [lngString, latString] = point.split(',')
      return {
        lat: parseFloat(latString),
        lng: parseFloat(lngString)
      }
    })

    // If the polygon was drawn clockwise, we need to reverse
    if (isClockwiseLatLng(latLngs)) {
      result = result.reverse()
    }
  }

  return result.map((point) => {
    const [lngString, latString] = point.split(',')

    return [
      parseFloat(lngString.trim()),
      parseFloat(latString.trim())
    ]
  })
}
