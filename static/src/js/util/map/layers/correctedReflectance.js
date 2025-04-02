import moment from 'moment'
import gibsLayer from './gibsLayer'

/**
 * Builds the Corrected Reflectance (True Color) layer
 * @param {Object} params
 * @param {String} params.projectionCode The projection code for the layer
 * @param {String} params.attributions Optional attributions for the layer
 */
const correctedReflectance = ({
  projectionCode,
  attributions = null
}) => {
  // Return near time image so that the map is completely filled
  const yesterday = moment().subtract(1, 'days')
  const date = yesterday.format('YYYY-MM-DD')

  return gibsLayer({
    className: 'edsc-map-base-layer',
    format: 'image/jpeg',
    layer: 'VIIRS_SNPP_CorrectedReflectance_TrueColor',
    matrixSet: '250m',
    projectionCode,
    time: date,
    visible: false,
    attributions
  })
}

export default correctedReflectance
