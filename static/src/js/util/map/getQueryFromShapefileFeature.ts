import { Feature } from 'ol'
import { Point } from 'ol/geom'

import spatialTypes from '../../constants/spatialTypes'
import { SpatialQueryType } from '../../types/sharedTypes'

// Get a CMR spatial query from the given feature
const getQueryFromShapefileFeature = (feature: Feature) => {
  const geometry = feature.getGeometry()
  const {
    circleGeometry,
    geometryType,
    geographicCoordinates
  } = feature.getProperties()

  // Shapefiles can have altitude in their coordinates. This shows up as a 3rd value in each coordinate pair (e.g., [longitude, latitude, altitude]).
  // For CMR spatial queries, we only need the longitude and latitude values.
  let geographicCoordinatesWithoutAltitude = geographicCoordinates
  if (
    geographicCoordinates
    && geographicCoordinates[0] // Array of coordinates
    && geographicCoordinates[0][0] // First coordinate
    && geographicCoordinates[0][0].length === 3 // If the coordinate has 3 values (longitude, latitude, altitude)
  ) {
    geographicCoordinatesWithoutAltitude = geographicCoordinates.map(
      (coords: number[][]) => coords.map(
        (coord: number[]) => coord.slice(0, 2)
      )
    )
  }

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
