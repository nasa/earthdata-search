import moment from 'moment'
import gibsLayer from './gibsLayer'
import { ProjectionCode } from '../../../types/sharedTypes'

/**
 * Builds the Corrected Reflectance (True Color) layer
 * @param {Object} params
 * @param {String} params.projectionCode The projection code for the layer
 * @param {String} params.visible The visibility flag for the layer
 */
const correctedReflectance = ({
  projectionCode,
  visible
}: {
  /** The projection code for the layer */
  projectionCode: ProjectionCode
  /** The visibility flag for the layer */
  visible: boolean
}) => {
  // Return near time image so that the map is completely filled
  const yesterday = moment().subtract(1, 'days')
  const date = yesterday.format('YYYY-MM-DD')

  return gibsLayer({
    attributions: 'Terra / MODIS',
    className: 'true-color-layer',
    format: 'image/jpeg',
    layer: 'VIIRS_SNPP_CorrectedReflectance_TrueColor',
    matrixSet: '250m',
    projectionCode,
    time: date,
    visible
  })
}

export default correctedReflectance
