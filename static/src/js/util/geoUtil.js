import L from 'leaflet'

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
// const NORTH_POLE = 1 // = 0001
// const SOUTH_POLE = 2 // = 0010
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
  for (let i = 0, end1 = len, asc1 = end1 >= 0; asc1 ? i < end1 : i > end1; asc1 ? i += 1 : i -= 1) {
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

// Ensures that latlngs is counterclockwise around its smallest area
// This is an in-place operation modifying the original list.
export const makeCounterClockwise = (latlngs) => {
  const area = calculateArea(latlngs)
  if (area > 2 * Math.PI) {
    latlngs.reverse()
  }

  return latlngs
}
