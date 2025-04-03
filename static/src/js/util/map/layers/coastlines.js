import projections from '../projections'
import gibsLayer from './gibsLayer'

/**
 * Builds the standard resolution Coastlines layer using OSM data from GIBS
 * @param {Object} params
 * @param {String} params.projectionCode The projection code for the layer
 * @param {String} params.attributions Optional attributions for the layer
 * @param {String} params.visible The visibility flag for the layer
 */
const coastlines = ({
  projectionCode,
  attributions = null,
  visible
}) => gibsLayer({
  className: 'edsc-map-coastlines-layer',
  format: 'image/png',
  layer: projectionCode === projections.geographic ? 'Coastlines_15m' : 'Coastlines',
  matrixSet: projectionCode === projections.geographic ? '15.625m' : '250m',
  projectionCode,
  visible,
  opacity: 1,
  attributions
})

export default coastlines
