/**
 * Converts NLP spatial data (GeoJSON) to search query format
 * @param {Object} nlpSpatial - NLP spatial data in GeoJSON format
 * @returns {Object} Spatial query object with polygon/point arrays
 */
export const convertNlpSpatialToQueryFormat = (nlpSpatial) => {
  if (!nlpSpatial || !nlpSpatial.type) return {}

  let spatialQuery = {}

  if (nlpSpatial.type === 'Polygon') {
    const coordinates = nlpSpatial.coordinates[0]
    const polygonString = coordinates.map((coord) => `${coord[0]},${coord[1]}`).join(',')
    spatialQuery = { polygon: [polygonString] }
  } else if (nlpSpatial.type === 'Point') {
    const [lon, lat] = nlpSpatial.coordinates
    spatialQuery = { point: [`${lat},${lon}`] }
  }

  return spatialQuery
}

/**
 * Converts NLP spatial data to FeatureCollection format for map rendering
 * @param {Object} nlpSpatial - NLP spatial data in GeoJSON format
 * @param {string} geoLocation - Human-readable location description
 * @returns {Object} FeatureCollection compatible with shapefile rendering
 */
export const convertNlpSpatialToFeatureCollection = (nlpSpatial, geoLocation = '') => {
  if (!nlpSpatial || !nlpSpatial.type) {
    return null
  }

  const spatialDataId = Date.now().toString()
  const shapefileName = geoLocation || 'Search Area'

  const feature = {
    type: 'Feature',
    geometry: nlpSpatial,
    properties: {
      edscId: '0',
      isNlpSpatial: true // Mark this as NLP-generated spatial data
    }
  }

  const featureCollection = {
    type: 'FeatureCollection',
    name: shapefileName,
    features: [feature],
    geoLocation,
    nlpSpatialId: spatialDataId
  }

  return featureCollection
}
