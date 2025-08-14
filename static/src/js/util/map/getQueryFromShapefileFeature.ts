import { Feature } from 'ol'
import { Point } from 'ol/geom'

import spatialTypes from '../../constants/spatialTypes'
import { Spatial, SpatialQueryType } from '../../types/sharedTypes'

// Remove altitude from coordinate arrays for different types
const removeAltitudeFromCoordinates = (
  coordinates: number[] | number[][] | number[][][]
): number[] | number[][] | number[][][] => {
  if (!coordinates) return coordinates

  // Handle different coordinate structures
  if (Array.isArray(coordinates[0])) {
    if (Array.isArray(coordinates[0][0])) {
      // Handle MultiPolygon shapes
      return (coordinates as number[][][]).map(
        (coord) => removeAltitudeFromCoordinates(coord) as number[][]
      )
    }

    // Handle Polygon, MultiPoint, LineString, and MultiLineString
    return (coordinates as number[][]).map((coord: number[]) => coord.slice(0, 2))
  }

  // Handle Point
  return (coordinates as number[]).slice(0, 2)
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

  // Handle multi-geometry types
  if (geometryType === spatialTypes.MULTI_POLYGON) {
    const polygons = geographicCoordinatesWithoutAltitude.map((polygon: number[][][]) => polygon[0].flat().join(','))

    return {
      polygon: polygons
    }
  }

  if (geometryType === spatialTypes.MULTI_POINT) {
    const points = geographicCoordinatesWithoutAltitude.map((point: number[]) => point.join(','))

    return {
      point: points
    }
  }

  if (geometryType === spatialTypes.MULTI_LINE_STRING) {
    const lines = geographicCoordinatesWithoutAltitude.map((line: number[][]) => line.flat().join(','))

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
