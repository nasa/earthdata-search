/* eslint-disable no-underscore-dangle */
import L from 'leaflet'
import projections from './projections'

function pairs(array) {
  const len = array.length

  const results = []
  for (let i = 0; i < len; i += 1) {
    results.push([array[i], array[(i + 1) % len]])
  }
  return results
}

// Is a given path clockwise?
export function isClockwise(path) {
  let sum = 0
  pairs(path).forEach(([p0, p1]) => {
    sum += (p1.x - p0.x) * (p1.y + p0.y)
  })
  return sum > 0
}

export function addPath(ctx, path) {
  let { poly } = path
  const { line } = path

  if ((poly != null) || (line != null)) {
    if (poly == null) { poly = line }
    const len = poly.length
    if (len < 2) { return }

    ctx.moveTo(poly[0].x, poly[0].y)
    poly.slice(1).forEach(p => ctx.lineTo(p.x, p.y))
    if (line == null) { ctx.closePath() }
  }
}

// Is the granule coordinate system cartesian?
export function isCartesian(granule) {
  return granule.coordinate_system === 'CARTESIAN'
}

// Parse a spatial string into an array of LatLng points
export function parseSpatial(str) {
  let newStr = str
  if (newStr instanceof Array) {
    [newStr] = str
  }
  const coords = newStr.split(' ')
  const len = coords.length - 1
  return (() => {
    const result = []
    for (let i = 0, end = len; i < end; i += 2) {
      result.push(new L.LatLng(coords[i], coords[i + 1]))
    }
    return result
  })()
}

// Pull points out of granule metadata
export function getPoints(granule) {
  let points = []
  if ((granule._points == null) && (granule.points != null)) {
    const merged = []
    points = merged.concat(...granule.points.map(parseSpatial))
  }
  return points
}

// Pull polygons out of granule metadata
export function getPolygons(granule) {
  const { polygons: granulePolygons } = granule
  let polygons = []
  if (granulePolygons && granulePolygons !== null) {
    polygons = granulePolygons.map(p => p.map(s => parseSpatial(s)))
    return polygons
  }
  return polygons
}

// Pull lines out of granule metadata
export function getLines(granule) {
  let lines = []
  if ((granule._lines == null) && (granule.lines != null)) {
    lines = granule.lines.map(parseSpatial)
  }
  return lines
}

// Pull rectangles out of granule metadata
export function getRectangles(granule) {
  const rects = []
  if ((granule._rects == null) && (granule.boxes != null)) {
    granule.boxes.map(parseSpatial).forEach((rect) => {
      let divided
      if (rect[0].lng > rect[1].lng) {
        divided = [
          [rect[0], L.latLng(rect[1].lat, 180)],
          [L.latLng(rect[0].lat, -180), rect[1]]
        ]
      } else {
        divided = [rect]
      }

      divided.forEach((box) => {
        rects.push([L.latLng(box[0].lat, box[0].lng), L.latLng(box[0].lat, box[1].lng),
          L.latLng(box[1].lat, box[1].lng), L.latLng(box[1].lat, box[0].lng),
          L.latLng(box[0].lat, box[0].lng)
        ])
      })
    })
  }
  return rects
}

// Translate project types into 'epsg####' strings
export function getlprojection(options) {
  if (options.geo) {
    return projections.geographic
  }
  if (options.arctic) {
    return projections.arctic
  }
  if (options.antarctic) {
    return projections.antarctic
  }
  return ''
}
