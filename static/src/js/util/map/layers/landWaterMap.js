import vectorTileLayer from './vectorTileLayer'
import landWaterMapStyleConfig from './landWaterMap.json'
import projections from '../projections'
import gibsLayer from './gibsLayer'

/**
 * Builds the land-water map layer
 * @param {Object} params
 * @param {String} params.attributions
 * @param {String} params.projectionCode
 * @param {String} params.visible
 */
const landWaterMap = async ({
  attributions,
  projectionCode,
  visible
}) => {
  if (projectionCode === projections.geographic) {
    return vectorTileLayer({
      attributions,
      projectionCode,
      style: landWaterMapStyleConfig,
      visible
    })
  }

  if (projectionCode === projections.arctic) {
    return gibsLayer({
      className: 'edsc-map-landwater-layer',
      format: 'image/png',
      layer: 'OSM_Land_Water_Map',
      matrixSet: '250m',
      projectionCode,
      visible,
      opacity: 1,
      attributions
    })
  }

  return gibsLayer({
    className: 'edsc-map-landwater-layer',
    format: 'image/png',
    layer: 'SCAR_Land_Water_Map',
    matrixSet: '250m',
    projectionCode,
    visible,
    opacity: 1,
    attributions
  })
}

export default landWaterMap
