import TileLayer from 'ol/layer/Tile'
import { WMTS } from 'ol/source'
import { getTileGrid } from '../getTileGrid'

/**
 * Creates a generic GIBS layer with configurable parameters
 * @param {Object} params
 * @param {String} params.attributions Layer attributions
 * @param {String} params.className CSS class name for the layer
 * @param {String} params.format Image format (image/png, image/jpeg, etc.)
 * @param {String} params.layer GIBS layer identifier
 * @param {String} params.matrixSet Matrix set identifier
 * @param {Number} params.opacity Layer opacity (0-1)
 * @param {String} params.projectionCode The projection code for the layer
 * @param {String} params.time Optional time parameter for layers that require it
 * @param {Boolean} params.visible Whether the layer should be initially visible
 */
const gibsLayer = ({
  attributions = null,
  className,
  format = 'image/png',
  layer,
  matrixSet,
  opacity = 1,
  projectionCode,
  time = null,
  visible = false
}) => {
  let url = `https://gibs-{a-c}.earthdata.nasa.gov/wmts/${projectionCode}/best/wmts.cgi`
  if (time) {
    url = `${url}?TIME=${time}`
  }

  const tileLayer = new TileLayer({
    className,
    opacity,
    source: new WMTS({
      attributions,
      crossOrigin: 'anonymous',
      format,
      interpolate: format === 'image/jpeg',
      layer,
      matrixSet,
      projection: projectionCode,
      tileGrid: getTileGrid(projectionCode, matrixSet),
      url,
      wrapX: false
    }),
    visible
  })

  return tileLayer
}

export default gibsLayer
