import vectorTileLayer from './vectorTileLayer'
import landWaterMapStyleConfig from './landWaterMap.json'

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
}) => vectorTileLayer({
  attributions,
  projectionCode,
  style: landWaterMapStyleConfig,
  visible
})

export default landWaterMap
