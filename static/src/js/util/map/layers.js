/* eslint-disable no-underscore-dangle, new-cap */
import L from 'leaflet'
import { castArray } from 'lodash'

// Is the granule coordinate system cartesian?
export function isCartesian(metadata = {}) {
  return metadata.coordinateSystem === 'CARTESIAN'
}

// Parse a spatial string into an array of LatLng points
export function parseSpatial(str) {
  if (!str) return null
  let newStr = str
  if (newStr instanceof Array) {
    [newStr] = str
  }

  let coords = newStr.split(' ')
  // Sometimes OpenSearch granules come back with a comma-delimited list of coords intead of a space-delimited list
  if (coords.length === 1) {
    coords = newStr.split(',')
  }

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
    polygons = metadataPolygons.map((p) => p.map((s) => parseSpatial(s)))
    return polygons
  }
  return polygons
}

// Pull lines out of metadata
export function getLines(metadata = {}) {
  let lines = []
  if ((metadata._lines == null) && (metadata.lines != null)) {
    lines = metadata.lines.map(parseSpatial)
  }

  const displayLines = []

  lines.forEach((line) => {
    let points = []

    const firstPoint = line[0]
    points.push(firstPoint)
    let { lat: prevLat, lng: prevLng } = firstPoint

    for (let i = 1; i < line.length; i += 1) {
      const point = line[i]
      const { lat, lng } = point

      if (lng > 170 && prevLng < -170) {
        // calculate intersect with antimeridian using y = mx + b formula
        const m = (lat - prevLat) / (lng - 360 - prevLng) // calculate slope or m
        const x = -180 - prevLng // distance from previous point to antimeridian
        const y = m * x + prevLat // prevLat is equal to b in formula

        points.push(L.latLng({ lat: y, lng: -180 }))
        displayLines.push(points)
        points = [L.latLng({ lat: y, lng: 180 }), point]
      } else if (lng < -170 && prevLng > 170) {
        const m = (lat - prevLat) / (lng + 360 - prevLng) // calculate slope or m
        const x = 180 - prevLng // distance from previous point to antimeridian
        const y = m * x + prevLat

        points.push(L.latLng({ lat: y, lng: 180 }))
        displayLines.push(points)
        points = [L.latLng({ lat: y, lng: -180 }), point]
      } else {
        points.push(point)
      }

      prevLat = lat
      prevLng = lng
    }

    if (points.length > 0) displayLines.push(points)
  })

  return displayLines
}

// Pull rectangles out of metadata
export function getRectangles(metadata = {}) {
  const rects = []
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

/**
 * Builds a feature group containing a spatial layer based on the the provided metadata
 * @param {Object} options Leaflet layer options
 * @param {Object} metadata Collection or granule metadata
 */
export const buildLayer = (options, metadata) => {
  const layer = new L.FeatureGroup()
  const points = getPoints(metadata)
  const polygons = getPolygons(metadata)
  const lines = getLines(metadata)
  const rectangles = getRectangles(metadata)
  const cartesian = isCartesian(metadata)

  if (points.length) {
    castArray(points).forEach((point) => {
      layer.addLayer(L.circleMarker(point, options))
    })
  }

  if (polygons.length) {
    castArray(polygons).forEach((polygon) => {
      let polyLayer
      if (cartesian) {
        polyLayer = new L.polygon(polygon)
        polyLayer._interpolationFn = 'cartesian'
      } else {
        polyLayer = new L.sphericalPolygon(polygon, options)
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

  if (lines.length) {
    castArray(lines).forEach((line) => {
      const lineLayer = L.polyline(line, options)
      if (cartesian) lineLayer._interpolationFn = 'cartesian'
      layer.addLayer(lineLayer)
    })
  }

  if (rectangles.length) {
    castArray(rectangles).forEach((rect) => {
      let shape
      if (cartesian) {
        shape = new L.polygon(rect, options)
        shape._interpolationFn = 'cartesian'
      } else {
        shape = new L.sphericalPolygon(rect, options)
      }
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
