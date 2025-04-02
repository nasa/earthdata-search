import gibsLayer from './gibsLayer'

/**
 * Builds the standard resolution Coastlines layer using OSM data from GIBS
 * @param {Object} params
 * @param {String} params.projectionCode The projection code for the layer
 * @param {String} params.attributions Optional attributions for the layer
 */
const coastlines = ({
  projectionCode,
  attributions = null
}) => gibsLayer({
  className: 'edsc-map-coastlines-layer',
  format: 'image/png',
  layer: 'Coastlines_15m',
  matrixSet: '15.625m',
  projectionCode,
  visible: false,
  opacity: 1,
  attributions
})

export default coastlines
