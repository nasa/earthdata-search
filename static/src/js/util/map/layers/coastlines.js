import projectionCodes from '../../../constants/projectionCodes'
import gibsLayer from './gibsLayer'

/**
 * Builds the standard resolution Coastlines layer using OSM data from GIBS
 * @param {Object} params
 * @param {String} params.projectionCode The projection code for the layer
 * @param {String} params.visible The visibility flag for the layer
 */
const coastlines = ({
  projectionCode,
  visible
}) => gibsLayer({
  className: 'coastlines-layer',
  format: 'image/png',
  layer: projectionCode === projectionCodes.geographic ? 'Coastlines_15m' : 'Coastlines',
  matrixSet: projectionCode === projectionCodes.geographic ? '15.625m' : '250m',
  opacity: 1,
  projectionCode,
  visible
})

export default coastlines
