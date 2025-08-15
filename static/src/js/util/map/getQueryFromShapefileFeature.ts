import { Feature } from 'ol'
import { Point } from 'ol/geom'

import spatialTypes from '../../constants/spatialTypes'
import { Spatial, SpatialQueryType } from '../../types/sharedTypes'

// Coordinate types for spatial types
type Coordinate = [number, number] | [number, number, number]
type LineString = Coordinate[]
type Polygon = Coordinate[][]
type MultiPolygon = Coordinate[][][]
type CoordinateInput = Coordinate | LineString | Polygon | MultiPolygon

// Remove altitude from coordinate arrays recursively
const removeAltitudeFromCoordinates = (coordinates: CoordinateInput): CoordinateInput => {
  if (typeof coordinates[0] === 'number') {
    return (coordinates as Coordinate).slice(0, 2) as Coordinate
  }

  return (coordinates as (LineString | Polygon | MultiPolygon))
    .map(removeAltitudeFromCoordinates) as CoordinateInput
}

// Get a CMR spatial query from the given feature
const getQueryFromShapefileFeature = (feature: Feature): Spatial => {
  const geometry = feature.getGeometry()
  const {
    circleGeometry,
    geometryType,
    geographicCoordinates
  } = feature.getProperties()

  // Shapefiles can have altitude in their coordinates. This shows up as a 3rd value in each coordinate pair (e.g., [longitude, latitude, altitude]).
  // For CMR spatial queries, we only need the longitude and latitude values.
  let geographicCoordinatesWithoutAltitude = geographicCoordinates

  // Check for altitude in coordinates - handle different geometry structures
  const hasAltitude = () => {
    if (!geographicCoordinates || !geographicCoordinates[0]) return false

    // For MultiPolygon
    if (Array.isArray(geographicCoordinates[0][0][0])) {
      return geographicCoordinates[0][0][0].length === 3
    }

    // For Polygon, LineString
    if (Array.isArray(geographicCoordinates[0][0])) {
      return geographicCoordinates[0][0].length === 3
    }

    // For Point, MultiPoint
    return geographicCoordinates[0].length === 3
  }

  // Only run altitude detection for geometry types that use geographicCoordinates
  if (
    geometryType !== spatialTypes.CIRCLE
    && geometryType !== spatialTypes.POINT
    && hasAltitude()
  ) {
    geographicCoordinatesWithoutAltitude = removeAltitudeFromCoordinates(geographicCoordinates)
  }

  // Transformation functions for different geometry types
  const transformPolygonToString = (polygon: number[][][]): string => polygon[0].flat().join(',')
  const transformPointToString = (point: number[]): string => point.join(',')
  const transformLineToString = (line: number[][]): string => line.flat().join(',')

  // Handle multi-geometry types
  if (geometryType === spatialTypes.MULTI_POLYGON) {
    const polygons = geographicCoordinatesWithoutAltitude.map(transformPolygonToString)

    return {
      polygon: polygons
    }
  }

  if (geometryType === spatialTypes.MULTI_POINT) {
    const points = geographicCoordinatesWithoutAltitude.map(transformPointToString)

    return {
      point: points
    }
  }

  if (geometryType === spatialTypes.MULTI_LINE_STRING) {
    const lines = geographicCoordinatesWithoutAltitude.map(transformLineToString)

    return {
      line: lines
    }
  }

  // Handle single geometry types
  let queryType: SpatialQueryType = geometryType.toLowerCase()

  // Get the coordinates from the feature
  let flatCoordinates
  if (geometryType === spatialTypes.CIRCLE) {
    flatCoordinates = circleGeometry
  } else if (geometryType === spatialTypes.POINT) {
    flatCoordinates = (geometry as Point).getFlatCoordinates()
  } else if (geometryType === spatialTypes.LINE_STRING) {
    queryType = 'line'
    flatCoordinates = geographicCoordinatesWithoutAltitude
  } else {
    flatCoordinates = geographicCoordinatesWithoutAltitude[0].flat()
  }

  // Create the spatial query
  return {
    [queryType]: [flatCoordinates.join(',')]
  }
}

export default getQueryFromShapefileFeature
