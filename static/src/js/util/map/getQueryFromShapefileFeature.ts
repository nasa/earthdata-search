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

  let queryType: SpatialQueryType = geometryType.toLowerCase()

  // Get the coordinates from the feature
  let flatCoordinates
  if (geometryType === spatialTypes.CIRCLE) {
    flatCoordinates = circleGeometry
  } else if (geometryType === spatialTypes.POINT) {
    flatCoordinates = (geometry as Point).getFlatCoordinates()
  } else if (geometryType === spatialTypes.LINE_STRING) {
    queryType = 'line'
    flatCoordinates = geographicCoordinates
  } else {
    flatCoordinates = geographicCoordinates[0].flat()
  }

  // Create the spatial query
  return {
    [queryType]: [flatCoordinates.join(',')]
  }
}

export default getQueryFromShapefileFeature
