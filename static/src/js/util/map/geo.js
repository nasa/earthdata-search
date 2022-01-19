/* eslint-disable no-bitwise */
import L from 'leaflet'

import Arc from './arc'
import Coordinate from './coordinate'

// Avoid leaflet dependency
const latLng = (typeof L !== 'undefined' && L !== null)
  ? (a, b, c) => L.latLng(a, b, c)
  : function latLng(a) {
    if (a.constructor === Array) {
      if (a.length === 2) {
        return { lat: +a[0], lng: +a[1] }
      }
      return null
    }
    if ((a == null)) {
      return a
    }
    if ((a != null) && (a.lat != null) && (a.lng != null)) {
      return a
    }
    return null
  }

// A small number for dealing with near-0
const EPSILON = 0.00000001
const NORTH_POLE = 1 // = 0001
const SOUTH_POLE = 2 // = 0010
const DEG_TO_RAD = Math.PI / 180
const RAD_TO_DEG = 180 / Math.PI

// Given two points, returns their midpoint along the shortest great circle between them.  The
// two points may not be antipodal, since such a midpoint would be undefined
export const gcInterpolate = (point1, point2) => {
  let p1 = point1
  let p2 = point2

  if (Math.abs(p1.lat) === Math.abs(p2.lat) && Math.abs(p2.lat) === 90) {
    return p1
  }

  if (p2.lng < p1.lng) {
    [p1, p2] = [p2, p1]
  }

  const lat1 = p1.lat * DEG_TO_RAD
  const lon1 = p1.lng * DEG_TO_RAD
  const lat2 = p2.lat * DEG_TO_RAD
  const lon2 = p2.lng * DEG_TO_RAD

  // http://williams.best.vwh.net/avform.htm#Dist
  const d = 2 * Math.asin(Math.sqrt((Math.sin((lat1 - lat2) / 2) ** 2)
    + Math.cos(lat1) * Math.cos(lat2) * (Math.sin((lon1 - lon2) / 2) ** 2)))

  // http://williams.best.vwh.net/avform.htm#Intermediate
  // This is a special case where f = 1/2 and therefore A = B, allowing us
  // to simplify a few expressions
  const AB = Math.sin(d / 2) / Math.sin(d)
  const x = AB * (Math.cos(lat1) * Math.cos(lon1) + Math.cos(lat2) * Math.cos(lon2))
  const y = AB * (Math.cos(lat1) * Math.sin(lon1) + Math.cos(lat2) * Math.sin(lon2))
  const z = AB * (Math.sin(lat1) + Math.sin(lat2))
  const lat = RAD_TO_DEG * Math.atan2(z, Math.sqrt((x * x) + (y * y)))
  let lon = RAD_TO_DEG * Math.atan2(y, x)

  // Guard against the points being the same or antipodal
  if (Number.isNaN(lat) || Number.isNaN(lon)) {
    return p1
  }

  while (lon < p1.lng - EPSILON) {
    lon += 360
  }

  while (lon > p2.lng + EPSILON) {
    lon -= 360
  }

  return latLng(lat, lon)
}

// Determines the initial course direction from latlng1 setting off toward latlng2
const course = (latlng1, latlng2) => {
  // http://williams.best.vwh.net/avform.htm#Crs
  const {
    sin,
    cos,
    atan2,
    PI
  } = Math

  // const c1 = Coordinate.fromLatLng(latlng1)
  // const c2 = Coordinate.fromLatLng(latlng1)

  const lat1 = latlng1.lat * DEG_TO_RAD
  const lng1 = latlng1.lng * DEG_TO_RAD

  const lat2 = latlng2.lat * DEG_TO_RAD
  const lng2 = latlng2.lng * DEG_TO_RAD

  if (lat1 > ((PI / 2) - EPSILON)) {
    return PI
  }
  if (lat1 < ((-PI / 2) + EPSILON)) {
    return 2 * PI
  }

  const numer = sin(lng1 - lng2) * cos(lat2)
  const denom = (cos(lat1) * sin(lat2)) - (sin(lat1) * cos(lat2) * cos(lng1 - lng2))
  let result = atan2(numer, denom) % (2 * PI)

  if (result < 0) {
    result += 2 * PI
  }

  return result
}

// Determines the difference between the given angles in the interval (-180, 180)
// See: http://www.element84.com/determining-if-a-spherical-polygon-contains-a-pole.html
const angleDelta = (a1, a2) => {
  let newA2 = a2
  if (a2 < a1) {
    newA2 += 360
  }

  const leftTurnAmount = newA2 - a1

  if (leftTurnAmount === 180) {
    return 0
  } if (leftTurnAmount > 180) {
    return leftTurnAmount - 360
  }
  return leftTurnAmount
}

// Returns a positive number if the angles rotate counterclockwise, a negative number
// if the angles rotate clockwise, or 0 if they do not rotate
const rotationDirection = (angles) => {
  // Sum all adjacent angle deltas.  The sum gives us the number we need to return
  let delta = 0
  const len = angles.length

  for (let i = 0, end = len, asc = end >= 0; asc ? i < end : i > end; asc ? i += 1 : i -= 1) {
    const a1 = angles[i]
    const a2 = angles[(i + 1) % len]
    delta += angleDelta(a1, a2)
  }

  if (Math.abs(delta) < EPSILON) { delta = 0 }

  return delta
}

// Returns a number indicating which pole(s) the given latlngs cross
// North Pole: (containsPole(...) & NORTH_POLE) != 0
// South Pole: (containsPole(...) & SOUTH_POLE) != 0
// Any Pole: containsPole(...) != 0
// Neither Pole: containsPole(...) == 0
const containsPole = (latlngs) => {
  let newLatLngs = latlngs
  if (newLatLngs.length < 3) { return false }

  // http://blog.element84.com/determining-if-a-spherical-polygon-contains-a-pole.html

  // Add second point to the end per the algorithm
  newLatLngs = ((() => {
    const result = []
    newLatLngs.forEach((latlng) => result.push(latLng(latlng)))
    return result
  })())
  newLatLngs.push(newLatLngs[1])

  let delta = 0
  const len = newLatLngs.length
  for (let i = 0, end = len, asc = end >= 0; asc ? i < end : i > end; asc ? i += 1 : i -= 1) {
    const latlng0 = newLatLngs[((i - 1) + len) % len]
    const latlng1 = newLatLngs[i]
    const latlng2 = newLatLngs[(i + 1) % len]

    const prev = (course(latlng1, latlng0) + Math.PI) % (2 * Math.PI)
    const initial = course(latlng1, latlng2)
    const final = (course(latlng2, latlng1) + Math.PI) % (2 * Math.PI)

    let delta0 = initial - prev
    if (delta0 > Math.PI) { delta0 -= 2 * Math.PI }
    if (delta0 < -Math.PI) { delta0 += 2 * Math.PI }
    if (Math.abs(Math.PI - Math.abs(delta0)) < EPSILON) {
      delta0 = 0
    }

    let delta1 = final - initial
    if (delta1 > Math.PI) { delta1 -= 2 * Math.PI }
    if (delta1 < -Math.PI) { delta1 += 2 * Math.PI }
    if (Math.abs(Math.PI - Math.abs(delta1)) < EPSILON) {
      delta1 = 0
    }

    delta += delta0 + delta1
  }

  // clean up the added point after calculating 'delta'
  newLatLngs.pop()

  delta *= RAD_TO_DEG

  if (delta < (-360 + EPSILON)) {
    return NORTH_POLE | SOUTH_POLE
  } if (delta < EPSILON) {
    const angles = ((() => {
      const result1 = []
      newLatLngs.forEach((latlng) => result1.push(latlng.lng))
      return result1
    })())
    const dir = rotationDirection(angles)

    if (dir > 0) {
      return NORTH_POLE
    } if (dir < 0) {
      return SOUTH_POLE
    }
    // if (config.debug) {
    //   console.warn('Rotation direction is NONE despite containing a pole')
    // }
    return 0
  }
  return 0
}

// Calculates the area within the given latlngs
export const calculateArea = (origLatlngs) => {
  if (origLatlngs.length < 3) {
    return 0
  }

  // This algorithm is an approximation to area.  For some polygons, particularly large and narrow
  // ones, it will produce incorrect results causing us to think they have clockwise points when
  // their points are counterclockwise.
  // The algorithm to deal with this exactly is complex and slow (see PDF below).  For our purposes,
  // we want to eliminate cases that may cause real problems.  Below, we add the midpoint for long
  // arcs to our list of latlngs.  Doing so means we'll see fewer problems but we'll be doing
  // more calculations.
  // If polygons still cause problems, interpolate more :)
  // Example of a problematic polygon before interpolation:
  // http://edsc.dev/search/collections?polygon=-38.53125%2C37.125%2C-60.75%2C56.109375%2C1.6875%2C0.28125%2C-38.53125%2C37.125&m=15.5390625!10.8984375!2!1!0!
  // Example of a problematic polygon after interpolation:
  // http://edsc.dev/search/collections?polygon=-38.53125%2C37.125%2C-60.75%2C56.109375%2C-11.390625%2C-4.5%2C-38.53125%2C37.125&m=15.5390625!10.8984375!2!1!0!
  const latlngs = []
  const origlen = origLatlngs.length
  for (let i = 0, end = origlen, asc = end >= 0; asc ? i < end : i > end; asc ? i += 1 : i -= 1) {
    const latlngA = origLatlngs[i]
    const latlngB = origLatlngs[(i + 1) % origlen]
    latlngs.push(latlngA)
    if ((Math.abs(latlngA.lat - latlngB.lat) > 20) || (Math.abs(latlngA.lng - latlngB.lng) > 20)) {
      latlngs.push(gcInterpolate(latlngA, latlngB))
    }
  }

  // http://trs-new.jpl.nasa.gov/dspace/bitstream/2014/40409/3/JPL%20Pub%2007-3%20%20w%20Errata.pdf
  // Page 7
  const { PI } = Math
  let crossesMeridian = false
  let sum = 0
  const len = latlngs.length
  for (
    let i = 0, end1 = len, asc1 = end1 >= 0;
    asc1 ? i < end1 : i > end1;
    asc1 ? i += 1 : i -= 1
  ) {
    const latlngA = latlngs[i]
    const latlngB = latlngs[(i + 1) % len]
    const latlngC = latlngs[(i + 2) % len]
    const thetaA = latlngA.lng * DEG_TO_RAD
    let thetaB = latlngB.lng * DEG_TO_RAD
    let thetaC = latlngC.lng * DEG_TO_RAD
    const phiB = latlngB.lat * DEG_TO_RAD

    if (Math.abs(thetaB - thetaA) > PI) {
      crossesMeridian = !crossesMeridian
      if (thetaB > thetaA) {
        thetaB -= 2 * PI
      } else {
        thetaB += 2 * PI
      }
    }

    if (Math.abs(thetaC - thetaB) > PI) {
      crossesMeridian = !crossesMeridian
      if (thetaC > thetaB) {
        thetaC -= 2 * PI
      } else {
        thetaC += 2 * PI
      }
    }
    sum += (thetaC - thetaA) * Math.sin(phiB)
  }

  if (crossesMeridian) {
    sum = (4 * PI) + sum
  }

  let area = -sum / 2
  if (area < 0) {
    area = (4 * PI) + area
  }

  return area
}

const convertLatLngs = (latlngs) => {
  const result = []
  // for (const original of latlngs) {
  latlngs.forEach((original) => {
    let lat
    let lng
    if (original.constructor === Array) {
      [lat, lng] = Array.from(original)
    } else {
      ({
        lat,
        lng
      } = original)
    }
    while (lng > 180) {
      lng -= 360
    }
    while (lng < -180) {
      lng += 360
    }
    result.push(latLng(lat, lng))
  })

  return result
}

// eslint-disable-next-line no-underscore-dangle
function __guard__(value, transform) {
  return (typeof value !== 'undefined' && value !== null) ? transform(value) : undefined
}

// Helper which delegates out to Arc to figure out where the great circle
// arc between latlng0 and latlng1 crosses the antimeridian.  Will either
// return the point of the crossing or null if the arc does not cross.
const antimeridianCrossing = (latlng0, latlng1) => {
  const arc = new Arc(Coordinate.fromLatLng(latlng0),
    Coordinate.fromLatLng(latlng1))
  return __guard__(arc.antimeridianCrossing(), (x) => x.toLatLng())
}

// Ensures that latlngs is counterclockwise around its smallest area
// This is an in-place operation modifying the original list.
export const makeCounterClockwise = (latlngs) => {
  const area = calculateArea(latlngs)
  if (area > 2 * Math.PI) {
    latlngs.reverse()
  }

  return latlngs
}

// Given a list of latlngs constituting a polygon, returns an object:
// {interiors: [...], boundaries: [...]}
//
// When the interiors are drawn as filled un-stroked leaflet polygons and the
// boundaries are drawn as leaflet strokes (polylines), the displayed area
// is equivalent to how ECHO interprets the original latlngs.
//
// This is where all the magic happens.
//
// Problem:
// There are two ways to interpret the "interior" of a polygon on a globe, because a
// polygon divides the globe into two parts.  In ECHO, a list of points in a polygon
// proceeds counterclockwise around its interior.  Leaflet, on the other hand, ignores
// the problem entirely; the interior is whatever svg happens to draw for a set of
// projected points, which may or may not be completely different if you switch map
// projections.
//
// This method takes an ECHO polygon, normalizes its points, slices it along the meridian,
// and adds points for the poles to ensure that Leaflet renders the ECHO interpretation
// of the polygon in all projections.
//
// It is, necessarily, a hack.
export const dividePolygon = (latlngs) => {
  let newLatLngs = latlngs
  let i
  let lat
  let lng
  let asc
  let end
  let j
  const interiors = []
  let boundaries = []
  const holes = []

  // Handle a list containing holes
  if (
    newLatLngs
    && newLatLngs[0]
    && (newLatLngs[0].constructor === Array)
    && (typeof newLatLngs[0][0] !== 'number')
  ) {
    newLatLngs.slice(1).forEach((hole) => {
      holes.push(makeCounterClockwise(convertLatLngs(hole)))
    })
    // eslint-disable-next-line prefer-destructuring
    newLatLngs = newLatLngs[0]
  }

  // Ensure we're dealing with normalized latlng objects
  newLatLngs = convertLatLngs(newLatLngs)

  // Ensure the exterior points are counterclockwise around their smallest area
  newLatLngs = makeCounterClockwise(newLatLngs)

  // We will have to add points to accommodate the poles later
  const containedPoles = containsPole(newLatLngs)
  const containsNorthPole = (containedPoles & NORTH_POLE) !== 0
  const containsSouthPole = (containedPoles & SOUTH_POLE) !== 0

  // The maximum and minimum latitudes we cross the antimeridian
  let maxCrossingLat = -95
  let minCrossingLat = 95

  // Eventually we're going to want to split the polygon into multiple
  // sub-polygons across the antimerdian.  So, a square crossing the
  // antimeridian would have a tall rectangle in the eastern hemisphere
  // and a tall rectangle in the western hemisphere, which individually
  // can be drawn correctly by Leaflet.

  // The following loop iterates across the original polygon.  Anywhere
  // the polygon crosses the antimeridian, we ensure there two points,
  // one at [crossing_lat, -180] and the other at [crossing_lon, 180]
  const split = []
  const len = newLatLngs.length
  for (i = 0, end = len, asc = end >= 0; asc ? i < end : i > end; asc ? i += 1 : i -= 1) {
    const latlng1 = newLatLngs[i]
    const latlng2 = newLatLngs[(i + 1) % len]

    const crossing = antimeridianCrossing(latlng1, latlng2)

    split.push(latlng1)

    let extras = []
    if (crossing != null) {
      ({
        lat
      } = crossing)
      if (latlng1.lng < latlng2.lng) {
        extras = [
          [lat, -180],
          [lat, 180]
        ]
      } else {
        extras = [
          [lat, 180],
          [lat, -180]
        ]
      }
    } else if ((latlng1.lng === 180) && (latlng2.lng < 0)) {
      extras = [
        [latlng1.lat, -180]
      ]
    } else if ((latlng1.lng === -180) && (latlng2.lng > 0)) {
      extras = [
        [latlng1.lat, 180]
      ]
    } else if ((latlng2.lng === 180) && (latlng1.lng < 0)) {
      extras = [
        [latlng2.lat, -180]
      ]
    } else if ((latlng2.lng === -180) && (latlng1.lng > 0)) {
      extras = [
        [latlng2.lat, 180]
      ]
    }

    // for (const extra of extras) {
    // eslint-disable-next-line no-loop-func
    extras.forEach((extra) => {
      [lat, lng] = Array.from(extra)
      split.push(latLng(lat, lng))
      maxCrossingLat = Math.max(lat, maxCrossingLat)
      minCrossingLat = Math.min(lat, minCrossingLat)
    })
  }

  // Did we insert anything?
  const hasInsertions = newLatLngs.length < split.length

  let interior = []
  let boundary = []
  const interiorStack = []
  let dir = null

  if (hasInsertions) {
    // Rearrange the split array so that its beginning and end contain separate polygons
    if ((Math.abs(split[0].lng) !== 180) || (Math.abs(split[split.length - 1].lng) !== 180)) {
      while (Math.abs(split[0].lng) !== 180) {
        split.push(split.shift())
      }
      split.push(split.shift())
    }
  }

  // We now take the expanded array created by inserting points at the antimeridian and
  // use it to create boundary and interior polygons
  for (j = 0, i = j; j < split.length; j += 1, i = j) {
    const latlng = split[i]
    interior.push(latlng)
    boundary.push(latlng)

    const next = split[(i + 1) % split.length]

    // If we're at the antimeridian
    if ((interior.length > 2) && (Math.abs(latlng.lng) === 180) && (Math.abs(next.lng) === 180)) {
      // We've reached the end of our current boundary
      let inc
      boundaries.push(boundary)
      boundary = []

      // If we contain the North pole, then we insert points at the northernmost
      // antimeridian crossing which run along the top of the map in the default
      // projection. and join it to its corresponding point on the other side
      // of the map, ensuring that the pole will be filled-in.
      let hasPole = false
      if (containsNorthPole && (latlng.lat === maxCrossingLat)) {
        hasPole = true;
        ({
          lng
        } = latlng)

        // We need a few points along the top of the map or polar projections screw up
        inc = lng < 0 ? 90 : -90
        for (i = 0; i <= 4; i += 1) {
          interior.push(latLng(90, lng + (i * inc)))
        }
      }

      // Similarly for the South Pole
      if (containsSouthPole && (latlng.lat === minCrossingLat)) {
        hasPole = true;
        ({
          lng
        } = latlng)
        inc = lng < 0 ? 90 : -90
        for (i = 0; i <= 4; i += 1) {
          interior.push(latLng(-90, lng + (i * inc)))
        }
      }

      // If we needed to insert points at the antimeridian, and
      // If we joined the east and west side of the polygon by going across the pole
      // above, we want to keep adding to our current interior shape.  Otherwise,
      // we're stopping the interior at the antimeridian and adding it to our list.
      if (hasInsertions && !hasPole) {
        if (!dir || (dir === (latlng.lng - next.lng))) {
          // We're crossing in the same direction we crossed last time, so the shape isn't complete
          interiorStack.push(interior)
          interior = []
          dir = latlng.lng - next.lng
        } else {
          // We're crossing back in the opposite direction, so the shape is complete
          interiors.push(interior)
          const left = interiorStack.pop()
          interior = left != null ? left : []
        }
      }
    }
  }

  // Close any remaining boundaries or interiors
  if (boundary.length > 0) {
    boundaries.push(boundary)
  }
  if (interior.length > 0) {
    interiors.push(interior)
  }
  // for (interior of interiorStack) {
  interiorStack.forEach((interior) => interiors.push(interior))

  // Special case: If we contain both poles but do not have an edge crossing the meridian
  // as dealt with above, reverse our drawing.
  if (containsNorthPole && containsSouthPole && !hasInsertions) {
    interior = []
    for (i = 0; i <= 4; i += 1) {
      interior.push(latLng(90, -180 + (i * 90)))
    }
    for (i = 0; i <= 4; i += 1) {
      interior.push(latLng(-90, 180 - (i * 90)))
    }
    interiors.unshift(interior)
  }

  // If we didn't need to insert points at the antimeridian, boundries should match interiors
  if (!hasInsertions) boundaries = interiors

  return {
    interiors,
    boundaries
  }
}

// Takes an array of lat/lon pairs and returns array of objects with lat/lon keys
// input: ['10,0','20,10']
// output: [{ lat: 0, lng: 10 }, { lat: 10, lng: 20 }]
export const getShape = (points) => points.map((pointStr) => L.latLng(pointStr.split(',').reverse()))

// Splits a string of points on every other comma
// input: '10,0,20,10'
// output: ['10,0','20,10']
export const splitListOfPoints = (points) => points.match(/[^,]+,[^,]+/g)
