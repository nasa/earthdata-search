import spatialTypes from '../../constants/spatialTypes'

// Get a CMR spatial query from the given feature
const getQueryFromShapefileFeature = (feature) => {
  const geometry = feature.getGeometry()
  const {
    geometryType,
    geographicCoordinates
  } = feature.getProperties()

  let queryType = geometryType.toLowerCase()

  // Get the coordinates from the feature
  let flatCoordinates
  if (geometryType === spatialTypes.CIRCLE) {
    flatCoordinates = feature.get('circleGeometry')
  } else if (geometryType === spatialTypes.POINT) {
    flatCoordinates = geometry.getFlatCoordinates()
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
