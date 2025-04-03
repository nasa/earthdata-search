import projections from '../projections'
import gibsLayer from './gibsLayer'

/**
 * Builds the standard resolution Borders and Roads layer using OSM data from GIBS
 * @param {Object} params
 * @param {String} params.projectionCode The projection code for the layer
 * @param {String} params.attributions Optional attributions for the layer
 * @param {String} params.visible The visibility flag for the layer
 */
const bordersRoads = ({
  projectionCode,
  attributions = null,
  visible
}) => gibsLayer({
  className: 'edsc-map-bordersRoads-layer',
  format: 'image/png',
  layer: projectionCode === projections.geographic ? 'Reference_Features_15m' : 'Reference_Features',
  matrixSet: projectionCode === projections.geographic ? '15.625m' : '250m',
  projectionCode,
  visible,
  opacity: 1,
  attributions
})

export default bordersRoads
