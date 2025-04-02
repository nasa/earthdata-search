import vectorTileLayer from './vectorTileLayer'
import { getApplicationConfig } from '../../../../../../sharedUtils/config'

const { placeLabelsStyleUrl } = getApplicationConfig()

/**
 * Builds the place labels layer
 * @param {Object} params
 * @param {String} params.attributions
 * @param {String} params.projectionCode
 */
const placeLabels = async ({
  attributions,
  projectionCode
}) => vectorTileLayer({
  attributions,
  projectionCode,
  style: placeLabelsStyleUrl,
  zIndex: 5,
  visible: false
})

export default placeLabels
