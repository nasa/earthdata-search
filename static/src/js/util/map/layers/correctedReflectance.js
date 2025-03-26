import TileLayer from 'ol/layer/Tile'
import { WMTS } from 'ol/source'
import moment from 'moment'
import { getTileGrid } from '../getTileGrid'

/**
 * Builds the Corrected Reflectance (True Color) layer
 * @param {Object} params
 * @param {String} params.attributions Attribution for the layer
 * @param {String} params.projectionCode The projection code for the layer
 * @param {String} params.date The date for the imagery in YYYY-MM-DD format (defaults to yesterday)
 */
const correctedReflectance = ({
  projectionCode
}) => {
  const projection = projectionCode
  const yesterday = moment().subtract(1, 'days')
  const date = yesterday.format('YYYY-MM-DD')

  const layer = new TileLayer({
    className: 'edsc-map-base-layer',
    source: new WMTS({
      crossOrigin: 'anonymous',
      format: 'image/jpeg',
      interpolate: false,
      layer: 'VIIRS_SNPP_CorrectedReflectance_TrueColor',
      matrixSet: '250m',
      projection: projectionCode,
      tileGrid: getTileGrid(projectionCode, '250m'),
      url: `https://gibs-{a-c}.earthdata.nasa.gov/wmts/${projection}/best/wmts.cgi?TIME=${date}`,
      wrapX: false
    }),
    visible: false
  })

  return layer
}

export default correctedReflectance
