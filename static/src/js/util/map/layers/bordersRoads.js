import gibsLayer from './gibsLayer'

/**
 * Builds the standard resolution Borders and Roads layer using OSM data from GIBS
 * @param {Object} params
 * @param {String} params.projectionCode The projection code for the layer
 * @param {String} params.attributions Optional attributions for the layer
 */
const bordersRoads = ({
  projectionCode,
  attributions = null
}) => gibsLayer({
  className: 'edsc-map-bordersRoads-layer',
  format: 'image/png',
  layer: 'Reference_Features_15m',
  matrixSet: '15.625m',
  projectionCode,
  visible: false,
  opacity: 1,
  attributions
})

export default bordersRoads
