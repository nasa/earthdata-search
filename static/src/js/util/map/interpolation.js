/* eslint-disable no-underscore-dangle */
import L from 'leaflet'
import { gcInterpolate } from './geo'

// Cartesian interpolation.  Averages lat and lng
const interpolateCartesian = (ll0, ll1) => L.latLng(
  (ll0.lat + ll1.lat) / 2,
  (ll0.lng + ll1.lng) / 2
)

// Geodetic interpolation.  Finds great circle path between the given points.
// See geoutil.gcInterpolate
const interpolateGeodetic = (ll0, ll1) => gcInterpolate(ll0, ll1)

// Given a path defined by latLngs, a projection defined by proj, and an interpolation
// function that takes two pionts and returns their midpoint, finds a set of projected
// (x, y) points defining the path between the points in the given projection
const projectLatLngPath = (latLngs, proj, interpolateFn, tolerance = 1, maxDepth = 10) => {
  let newLatLngs = latLngs
  let ll
  if (newLatLngs.length === 0) { return [] }

  newLatLngs = newLatLngs.concat()

  const points = ((() => {
    const result = []
    newLatLngs.forEach((ll) => result.push(proj(ll)))
    return result
  })())
  // for ll in latLngs
  //  if Math.abs(ll.lat) == 90
  //    console.log ll.toString(), '->', proj(ll).toString()

  const interpolatedLatLngs = [newLatLngs.shift()]
  const interpolatedPoints = [points.shift()]

  let depth0 = 0
  let depth1 = 0

  // let maxDepthReached = false

  while (newLatLngs.length > 0) {
    const ll0 = interpolatedLatLngs[interpolatedLatLngs.length - 1]
    const p0 = interpolatedPoints[interpolatedPoints.length - 1]

    const ll1 = newLatLngs[0]
    const p1 = points[0]

    ll = interpolateFn(ll0, ll1)
    const p = proj(ll)
    const depth = Math.max(depth0, depth1) + 1

    // if depth == 1
    //  console.log '0:', ll0.toString(), '->', p0.toString()
    //  console.log 'M:', ll.toString(), '->', p.toString()
    //  console.log '1:', ll1.toString(), '->', p1.toString()

    const d = L.LineUtil.pointToSegmentDistance(p, p0, p1)
    if ((d < tolerance) || (depth >= maxDepth)) {
      // if (depth >= maxDepth) { maxDepthReached = true }
      interpolatedLatLngs.push(ll, newLatLngs.shift())
      interpolatedPoints.push(p, points.shift())
      depth0 = depth1
      depth1 = Math.max(0, depth1 - 2)
    } else {
      newLatLngs.unshift(ll)
      points.unshift(p)
      depth1 += 1
    }
  }

  // if (maxDepthReached && config.debug) {
  //   console.log('Max interpolation depth reached.') //  Interpolated shape has #{interpolatedPoints.length} points."
  // }

  return interpolatedPoints
}

const projectPath = (map, latlngs, fn = 'geodetic', tolerance = 1, maxDepth = 10) => {
  let newFn = fn
  if (newFn === 'geodetic') { newFn = interpolateGeodetic }
  if (newFn === 'cartesian') { newFn = interpolateCartesian }

  const proj = (ll) => {
    let newLl = ll
    // Avoid weird precision problems near infinity by clamping to a high min/max pixel value
    const MAX_RES = 10000000

    // Fix problems where 90 degrees projects to NaN in our south polar projection
    if (newLl.lat === 90) {
      newLl = L.latLng(89.999, newLl.lng)
    }

    const result = map.latLngToLayerPoint.call(map, newLl)
    result.x = Math.max(Math.min(result.x, MAX_RES), -MAX_RES)
    result.y = Math.max(Math.min(result.y, MAX_RES), -MAX_RES)
    return result
  }

  return projectLatLngPath(latlngs, proj, newFn, tolerance, maxDepth)
}

// Overrides the default projectLatLngs in Polyline to project and interpolate the
// path instead of just projecting it
// https://github.com/Leaflet/Leaflet/blob/v1.3.4/src/layer/vector/Polyline.js#L217
function projectLatlngs(latlngs, result, projectedBounds) {
  const flat = latlngs[0] instanceof L.LatLng

  if (latlngs[0] !== latlngs[latlngs.length - 1]) {
    // the first and last latlngs don't match, make them match
    latlngs.push(latlngs[0])
  }

  let ring
  if (flat) {
    ring = []
    // Instead of looping through latlngs and finding the layer points,
    // use projectPath to interpolate the latlngs into the "great circle"
    // path between the two points. returns layer points so we don't have
    // to do that conversion like the original method
    const path = projectPath(this._map, latlngs, this._interpolationFn)
    path.forEach((point, index) => {
      ring[index] = point
      projectedBounds.extend(point)
    })
    result.push(ring)
  } else {
    latlngs.forEach((latlng) => {
      this._projectLatlngs(latlng, result, projectedBounds)
    })
  }
}

// Override methods
L.Polygon.prototype._projectLatlngs = projectLatlngs

// Give shapes an appropriate interpolation function.  Polygons use geodetic, rectangles cartesian
L.Polyline.prototype._interpolationFn = interpolateGeodetic
L.Rectangle.prototype._interpolationFn = interpolateCartesian

export default projectPath
