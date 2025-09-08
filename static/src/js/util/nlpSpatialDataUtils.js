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
