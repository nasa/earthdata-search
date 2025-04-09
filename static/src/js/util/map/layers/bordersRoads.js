import projectionCodes from '../../../constants/projectionCodes'
import gibsLayer from './gibsLayer'

/**
 * Builds the standard resolution Borders and Roads layer using OSM data from GIBS
 * @param {Object} params
 * @param {String} params.projectionCode The projection code for the layer
 * @param {String} params.visible The visibility flag for the layer
 */
const bordersRoads = ({
  projectionCode,
  visible
}) => gibsLayer({
  attributions: '&copy; OpenStreetMap contributors, Natural Earth',
  className: 'edsc-map__borders-roads-layer',
  format: 'image/png',
  layer: projectionCode === projectionCodes.geographic ? 'Reference_Features_15m' : 'Reference_Features',
  matrixSet: projectionCode === projectionCodes.geographic ? '15.625m' : '250m',
  opacity: 1,
  projectionCode,
  visible
})

export default bordersRoads
