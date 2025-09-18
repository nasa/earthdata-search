import { Feature } from 'ol'

import removeAltitudeFromSpatial from './removeAltitudeFromSpatial'

import type { Spatial } from '../../types/sharedTypes'
import transformSpatialToQuery from './transformSpatialToQuery'

// Get a CMR spatial query from the given feature
const getQueryFromShapefileFeature = (feature: Feature): Spatial => {
  const {
    circleGeometry,
    geometryType,
    geographicCoordinates
  } = feature.getProperties()

  // Shapefiles can have altitude in their coordinates. This shows up as a 3rd value in each coordinate pair (e.g., [longitude, latitude, altitude]).
  // For CMR spatial queries, we only need the longitude and latitude values.
  const geographicCoordinatesWithoutAltitude = removeAltitudeFromSpatial(geographicCoordinates)

  // Transform the spatial data to a spatial query object
  return transformSpatialToQuery(geometryType, geographicCoordinatesWithoutAltitude, circleGeometry)
}

export default getQueryFromShapefileFeature
