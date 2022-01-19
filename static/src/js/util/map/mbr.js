import Arc from './arc'
import Coordinate from './coordinate'
import { dividePolygon, splitListOfPoints, getShape } from './geo'

const circularMax = (lng0, lng1) => {
  const [left, right] = Array.from(lng0 < lng1 ? [lng0, lng1] : [lng1, lng0])
  if ((right - left) < 180) {
    return right
  }
  return left
}

const circularMin = (lng0, lng1) => {
  if (circularMax(lng0, lng1) === lng1) {
    return lng0
  }
  return lng1
}

const findSimpleMbr = (latlngs) => {
  let minLat = 91
  let maxLat = -91
  let minLng = 181
  let maxLng = -181

  const coords = (latlngs.map((latlng) => Coordinate.fromLatLng(latlng)))

  const len = coords.length
  const latLngsWithInflections = []
  coords.forEach((coord, i) => {
    latLngsWithInflections.push(coord.toLatLng())
    const next = coords[(i + 1) % len]
    const inflection = new Arc(coord, next).inflection()
    if (inflection) {
      const latLng = inflection.toLatLng()
      if (Math.abs(latLng.lat) !== 90) {
        // Has an inflection point, and it's not at the pole (which is handled
        // separately for MBRs)
        latLngsWithInflections.push(latLng)
      }
    }
  })

  const first = latLngsWithInflections[0]
  maxLat = first.lat
  minLat = maxLat
  maxLng = first.lng
  minLng = maxLng

  latLngsWithInflections.slice(1).forEach(({ lat, lng }) => {
    minLat = Math.min(minLat, lat)
    maxLat = Math.max(maxLat, lat)
    if (Math.abs(lat) !== 90) {
      minLng = circularMin(minLng, lng)
      maxLng = circularMax(maxLng, lng)
    } else {
      minLng = Math.min(minLng, lng)
      maxLng = Math.max(maxLng, lng)
    }
  })

  return [minLat, minLng, maxLat, maxLng]
}

// Returns the distance of lng0 from the interval, a negative number
// if it's outside and below the interval, a positive if it's outside
// and above, and 0 if it's within the interval
const distance = (lng0, min, max) => {
  let newLng0 = lng0
  let newMin = min
  let newMax = max

  newMin += 720
  while (newMax < newMin) { newMax += 360 }
  const mid = newMin + ((newMax - newMin) / 2)
  while (newLng0 < (mid - 180)) { newLng0 += 360 }

  if (newLng0 < newMin) {
    return newMin - newLng0
  } if (newLng0 > newMax) {
    return newLng0 - newMax
  }
  return 0
}

export const mergeMbrs = (mbrs) => {
  const first = mbrs[0]
  const rest = mbrs.slice(1)
  let minLat = first[0]
  let minLng = first[1]
  let maxLat = first[2]
  let maxLng = first[3]

  rest.forEach(([lat0, lng0, lat1, lng1]) => {
    minLat = Math.min(minLat, lat0)
    maxLat = Math.max(maxLat, lat1)

    const lng0Distance = distance(lng0, minLng, maxLng)
    const lng1Distance = distance(lng1, minLng, maxLng)
    const maxLngDistance = distance(maxLng, lng0, lng1)

    if ((lng0Distance === 0) || (lng1Distance === 0) || (maxLngDistance === 0)) {
      // If the ranges overlap
      minLng = circularMin(minLng, lng0)
      maxLng = circularMax(maxLng, lng1)
    } else {
      // If the ranges are disjoint
      // eslint-disable-next-line no-lonely-if
      if (lng0Distance < lng1Distance) {
        // Both points are on the same side
        if (lng0Distance < 0) {
          minLng = lng0
        } else {
          maxLng = lng1
        }
      } else {
        // The maximum point and minimum point are on opposite sides of the interval
        // eslint-disable-next-line no-lonely-if
        if (Math.abs(lng0Distance - 360) < Math.abs(lng1Distance + 360)) {
          // It's closer to extend to the minimum
          minLng = lng0
        } else {
          maxLng = lng1
        }
      }
    }
  })

  return {
    swLat: minLat,
    swLng: minLng,
    neLat: maxLat,
    neLng: maxLng
  }
}

export const divideMbr = (mbr) => {
  const [minLat, minLng, maxLat, maxLng] = Array.from(mbr)
  if (maxLng < minLng) {
    return [[minLat, -180, maxLat, maxLng],
      [minLat, minLng, maxLat, 180]]
  } if (minLng === maxLng) {
    return [[minLat, -180, maxLat, 180]]
  }
  return [mbr]
}

const EPSILON = 0.00000001
const CIRCUMFERENCE = 40075017

// Find the MBR of a circle:
// https://github.com/emartinez-usgs/Leaflet/commit/b2542b6470dfc3576387331bfeb57f0dbdab970c?branch=b2542b6470dfc3576387331bfeb57f0dbdab970c&diff=unified#diff-e63d205690b47d6a456c0d77565b55c5R37
// Earth circumference (40075017m) is hardcoded in this formula which isn't good for leaflet, but works for EDSC

// Find the difference in latitude for the circle radius
const getLatRadius = (radius) => (radius / CIRCUMFERENCE) * 360

// Find the difference in longitude for the circle radius
const getLngRadius = (lat, radius) => getLatRadius(radius) / Math.cos((Math.PI / 180) * lat)

/**
 * Finds the minimum bounding rectangle for the given spatial coordinates
 * @param {Object} spatial Spatial object containing boundingBox, circle, point or polygon spatial
 * @returns {Object} { swLat, swLng, neLat, neLng }
 */
export const mbr = (spatial) => {
  const {
    boundingBox,
    circle,
    point,
    polygon
  } = spatial

  if (point) {
    const { lat, lng } = getShape([point])[0]
    return {
      swLat: lat - EPSILON,
      swLng: lng - EPSILON,
      neLat: lat + EPSILON,
      neLng: lng + EPSILON
    }
  }

  if (circle) {
    const [lng, lat, radius] = circle.split(',').map((num) => parseFloat(num, 10))

    // Find the difference in the lat and lng
    const lngRadius = getLngRadius(lat, radius)
    const latRadius = (radius / CIRCUMFERENCE) * 360

    // Subtract the lat/lng difference from the center point to get the southwest point
    const swLat = lat - latRadius
    const swLng = lng - lngRadius

    // Add the lat/lng difference from the center point to get the northeast point
    const neLat = lat + latRadius
    const neLng = lng + lngRadius

    return {
      swLat,
      swLng,
      neLat,
      neLng
    }
  }

  if (boundingBox) {
    const points = splitListOfPoints(boundingBox)
    const [sw, ne] = getShape(points)
    return {
      swLat: sw.lat,
      swLng: sw.lng,
      neLat: ne.lat,
      neLng: ne.lng
    }
  }

  if (polygon) {
    const points = splitListOfPoints(polygon)
    if (points[0] === points[points.length - 1]) points.pop()

    const { interiors } = dividePolygon(getShape(points))
    const mbrs = (interiors.map((lls) => findSimpleMbr(lls)))
    return mergeMbrs(mbrs)
  }

  return undefined
}
