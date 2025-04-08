import vectorTileLayer from './vectorTileLayer'
import { getApplicationConfig } from '../../../../../../sharedUtils/config'

const { placeLabelsStyleUrl } = getApplicationConfig()

/**
 * Builds the place labels layer
 * @param {Object} params
 * @param {String} params.attributions
 * @param {String} params.projectionCode
 * @param {String} params.visible
 */
const placeLabels = async ({
  attributions,
  projectionCode,
  visible
}) => vectorTileLayer({
  attributions,
  projectionCode,
  style: placeLabelsStyleUrl,
  zIndex: 5,
  visible
})

export default placeLabels
