import vectorTileLayer from './vectorTileLayer'
import landWaterMapStyleConfig from './landWaterMap.json'

/**
 * Builds the land-water map layer
 * @param {Object} params
 * @param {String} params.attributions
 * @param {String} params.projectionCode
 */
const landWaterMap = async ({
  attributions,
  projectionCode
}) => vectorTileLayer({
  attributions,
  projectionCode,
  style: landWaterMapStyleConfig,
  visible: false
})

export default landWaterMap
