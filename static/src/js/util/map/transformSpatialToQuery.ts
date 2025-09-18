import spatialTypes from '../../constants/spatialTypes'

import type {
  Circle,
  Line,
  MultiLine,
  MultiPoint,
  MultiPolygon,
  Point,
  Polygon,
  SpatialCoordinates
} from '../../types/sharedTypes'

/** Transform a Line geometry to a CMR query string */
const transformLineToString = (line: Line): string => line.flat().join(',')

/** Transform a Point geometry to a CMR query string */
const transformPointToString = (point: Point): string => point.join(',')

/** Transform a Polygon geometry to a CMR query string */
const transformPolygonToString = (polygon: Polygon): string => polygon[0].flat().join(',')

/**
 * Transform spatial data to a spatial query object
 * @param geometryType The type of geometry being transformed
 * @param spatial The spatial coordinates to transform
 * @param circleGeometry The circle geometry, if the geometry type is a circle
 * @returns The spatial query object
 */
const transformSpatialToQuery = (
  geometryType: string,
  spatial: SpatialCoordinates,
  circleGeometry: Circle | [] = []
) => {
  switch (geometryType) {
    case spatialTypes.CIRCLE: {
      const [, radius] = circleGeometry

      return {
        circle: [`${transformPointToString(spatial as Point)},${radius}`]
      }
    }

    case spatialTypes.LINE_STRING:
      return {
        line: [transformLineToString(spatial as Line)]
      }
    case spatialTypes.MULTI_LINE_STRING:
      return {
        line: (spatial as MultiLine).map(transformLineToString)
      }
    case spatialTypes.POINT:
      return {
        point: [transformPointToString(spatial as Point)]
      }
    case spatialTypes.MULTI_POINT:
      return {
        point: (spatial as MultiPoint).map(transformPointToString)
      }
    case spatialTypes.POLYGON:
      return {
        polygon: [transformPolygonToString(spatial as Polygon)]
      }
    case spatialTypes.MULTI_POLYGON:
      return {
        polygon: (spatial as MultiPolygon).map(transformPolygonToString)
      }
    default:
      return {}
  }
}

export default transformSpatialToQuery
