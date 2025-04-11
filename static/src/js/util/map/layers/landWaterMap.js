import vectorTileLayer from './vectorTileLayer'
import landWaterMapStyleConfig from './landWaterMap.json'
import projectionCodes from '../../../constants/projectionCodes'
import gibsLayer from './gibsLayer'

/**
 * Builds the land-water map layer
 * @param {Object} params
 * @param {String} params.projectionCode
 * @param {String} params.visible
 */
const landWaterMap = async ({
  projectionCode,
  visible
}) => {
  if (projectionCode === projectionCodes.geographic) {
    // https://www.arcgis.com/home/item.html?id=a70340a048224752915ddbed9d2101a7
    return vectorTileLayer({
      attributions: 'Sources: Esri, TomTom, Garmin, FAO, NOAA, USGS, © OpenStreetMap contributors, and the GIS User Community',
      className: 'land-water-layer',
      projectionCode,
      style: landWaterMapStyleConfig,
      visible
    })
  }

  if (projectionCode === projectionCodes.arctic) {
    return gibsLayer({
      attributions: '&copy; OpenStreetMap contributors',
      className: 'land-water-layer',
      format: 'image/png',
      layer: 'OSM_Land_Water_Map',
      matrixSet: '250m',
      opacity: 1,
      projectionCode,
      visible
    })
  }

  return gibsLayer({
    attributions: '&copy; OpenStreetMap contributors',
    className: 'land-water-layer',
    format: 'image/png',
    layer: 'SCAR_Land_Water_Map',
    matrixSet: '250m',
    opacity: 1,
    projectionCode,
    visible
  })
}

export default landWaterMap
