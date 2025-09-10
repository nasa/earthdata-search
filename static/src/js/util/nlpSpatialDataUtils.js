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
