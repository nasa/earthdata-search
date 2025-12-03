import { castArray } from 'lodash-es'
import normalizeSpatial from '../map/normalizeSpatial'

const degrees = (value) => {
  if (value % 1 !== 0) {
    return `${value}\xB0`
  }

  return `${parseFloat(value).toFixed(1)}\xB0`
}

// Parse metadata for spatial information to populate minimap label
export const buildSpatial = (json) => {
  const { spatialExtent } = json
  if (!spatialExtent) return undefined

  const spatialList = []

  const { horizontalSpatialDomain } = spatialExtent
  if (horizontalSpatialDomain) {
    const { geometry } = horizontalSpatialDomain
    if (geometry.points || geometry.boundingRectangles || geometry.gpolygons || geometry.lines) {
      if (geometry.points) {
        const points = castArray(geometry.points)

        points.forEach((point) => {
          const { latitude, longitude } = point

          spatialList.push(`Point: (${degrees(latitude)}, ${degrees(longitude)})\n`)
        })
      }

      if (geometry.boundingRectangles) {
        const boxes = castArray(geometry.boundingRectangles)

        boxes.forEach((box) => {
          const north = box.northBoundingCoordinate
          const south = box.southBoundingCoordinate
          const east = box.eastBoundingCoordinate
          const west = box.westBoundingCoordinate

          spatialList.push(`Bounding Rectangle: (${degrees(north)}, ${degrees(west)}, ${degrees(south)}, ${degrees(east)})\n`)
        })
      }

      if (geometry.gpolygons) {
        const polygons = castArray(geometry.gpolygons)
        let string = 'Polygon: ('

        polygons.forEach((polygon) => {
          const points = castArray(polygon.boundary.points)

          points.forEach((point, i) => {
            const { latitude, longitude } = point

            string += `(${degrees(latitude)}, ${degrees(longitude)})${i + 1 < points.length ? ', ' : ''}`
          })

          string += ')\n'

          spatialList.push(string)
        })
      }

      if (geometry.lines) {
        const lines = castArray(geometry.lines)

        lines.forEach((line) => {
          const latitude1 = line.points[0].latitude
          const longitude1 = line.points[0].longitude
          const latitude2 = line.points[1].latitude
          const longitude2 = line.points[1].longitude

          spatialList.push(`Line: ((${degrees(latitude1)}, ${degrees(longitude1)}), (${degrees(latitude2)}, ${degrees(longitude2)}))\n`)
        })
      }
    } else {
      spatialList.push('Not Available')
    }
  } else {
    spatialList.push('Not Available')
  }

  return spatialList
}

// Parses collection metadata and returns an array of GeoJSON features
export const getCollectionGeoFeatures = (collectionMetadata) => {
  const collectionGeoFeatures = []

  const {
    boxes,
    coordinateSystem,
    lines,
    points,
    polygons
  } = collectionMetadata

  if (boxes) {
    const boxFeatures = normalizeSpatial({
      boxes,
      coordinateSystem
    })
    collectionGeoFeatures.push(boxFeatures)
  }

  if (lines) {
    const linesFeatures = normalizeSpatial({
      coordinateSystem,
      lines
    })
    collectionGeoFeatures.push(linesFeatures)
  }

  if (points) {
    const pointsFeatures = normalizeSpatial({
      coordinateSystem,
      points
    })
    collectionGeoFeatures.push(pointsFeatures)
  }

  if (polygons) {
    const polygonsFeatures = normalizeSpatial({
      coordinateSystem,
      polygons
    })
    collectionGeoFeatures.push(polygonsFeatures)
  }

  return collectionGeoFeatures
}

export default buildSpatial
