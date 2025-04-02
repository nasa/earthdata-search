import TileLayer from 'ol/layer/Tile'
import { WMTS } from 'ol/source'
import { getTileGrid } from '../getTileGrid'

/**
 * Creates a generic GIBS layer with configurable parameters
 * @param {Object} params
 * @param {String} params.className CSS class name for the layer
 * @param {String} params.format Image format (image/png, image/jpeg, etc.)
 * @param {String} params.layer GIBS layer identifier
 * @param {String} params.matrixSet Matrix set identifier
 * @param {String} params.projectionCode The projection code for the layer
 * @param {String} params.time Optional time parameter for layers that require it
 * @param {Boolean} params.visible Whether the layer should be initially visible
 * @param {Number} params.opacity Layer opacity (0-1)
 * @param {String} params.attributions Layer attributions
 */
const gibsLayer = ({
  className,
  format = 'image/png',
  layer,
  matrixSet,
  projectionCode,
  time = null,
  visible = false,
  opacity = 1,
  attributions = null
}) => {
  let url = `https://gibs-{a-c}.earthdata.nasa.gov/wmts/${projectionCode}/best/wmts.cgi`
  if (time) {
    url = `${url}?TIME=${time}`
  }

  const tileLayer = new TileLayer({
    className,
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
    opacity,
    visible
  })

  return tileLayer
}

export default gibsLayer
