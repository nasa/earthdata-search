import L from 'leaflet'
import { castArray } from 'lodash'

// Is the granule coordinate system cartesian?
export function isCartesian(metadata = {}) {
  return metadata.coordinate_system === 'CARTESIAN'
}

// Parse a spatial string into an array of LatLng points
export function parseSpatial(str) {
  if (!str) return null
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

// Pull points out of metadata
export function getPoints(metadata = {}) {
  let points = []
  // eslint-disable-next-line no-underscore-dangle
  if ((metadata._points == null) && (metadata.points != null)) {
    const merged = []
    points = merged.concat(...metadata.points.map(parseSpatial))
  }
  return points
}

// Pull polygons out of metadata
export function getPolygons(metadata = {}) {
  const { polygons: metadataPolygons } = metadata
  let polygons = []
  if (metadataPolygons && metadataPolygons !== null) {
    polygons = metadataPolygons.map(p => p.map(s => parseSpatial(s)))
    return polygons
  }
  return polygons
}

// Pull lines out of metadata
export function getLines(metadata = {}) {
  let lines = []
  // eslint-disable-next-line no-underscore-dangle
  if ((metadata._lines == null) && (metadata.lines != null)) {
    lines = metadata.lines.map(parseSpatial)
  }
  return lines
}

// Pull rectangles out of metadata
export function getRectangles(metadata = {}) {
  const rects = []
  // eslint-disable-next-line no-underscore-dangle
  if ((metadata._rects == null) && (metadata.boxes != null)) {
    const { boxes = [] } = metadata

    if (boxes) {
      boxes.map(parseSpatial).forEach((rect) => {
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
  }
  return rects
}

export const buildLayer = (options, metadata) => {
  const layer = new L.FeatureGroup()
  const points = getPoints(metadata)
  const polygons = getPolygons(metadata)
  const lines = getLines(metadata)
  const rectangles = getRectangles(metadata)
  const cartesian = isCartesian(metadata)

  if (points) {
    castArray(points).forEach((point) => {
      layer.addLayer(L.circleMarker(point, options))
    })
  }

  if (polygons) {
    castArray(polygons).forEach((polygon) => {
      let polyLayer
      if (cartesian) {
        polyLayer = L.polygon(polygon)
        // eslint-disable-next-line no-underscore-dangle
        polyLayer._interpolationFn = 'cartesian'
      } else {
        polyLayer = L.polygon(polygon, options)
      }
      layer.addLayer(polyLayer)

      const bounds = L.latLngBounds(polygon)
      if (
        bounds.getNorth() - bounds.getSouth() < 0.5
        && bounds.getWest() - bounds.getEast() < 0.5
      ) {
        layer.addLayer(L.marker(bounds.getCenter()))
      }
    })
  }

  if (lines) {
    castArray(lines).forEach((line) => {
      const lineLayer = L.polyline(line, options)
      // eslint-disable-next-line no-underscore-dangle
      if (cartesian) lineLayer._interpolationFn = 'cartesian'
    })
  }

  if (rectangles) {
    castArray(rectangles).forEach((rect) => {
      const shape = L.polygon(rect, options)
      // eslint-disable-next-line no-underscore-dangle
      shape._interpolationFn = 'cartesian'
      layer.addLayer(shape)

      const bounds = L.latLngBounds(rect)
      if (
        bounds.getNorth() - bounds.getSouth() < 0.5
        && bounds.getWest() - bounds.getEast() < 0.5
      ) {
        layer.addLayer(L.marker(bounds.getCenter()))
      }
    })
  }

  return layer
}

export default buildLayer
