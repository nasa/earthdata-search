import TileLayer from 'ol/layer/Tile'
import { WMTS } from 'ol/source'
import { getTileGrid } from '../getTileGrid'

/**
 * Builds the standard resolution Borders and Roads layer using OSM data from GIBS
 * @param {Object} params
 * @param {String} params.projectionCode The projection code for the layer
 */
const bordersRoads = ({
  projectionCode
}) => {
  const layer = new TileLayer({
    className: 'edsc-map-bordersRoads-layer',
    source: new WMTS({
      crossOrigin: 'anonymous',
      format: 'image/png',
      layer: 'Reference_Features_15m',
      matrixSet: '15.625m',
      projection: projectionCode,
      tileGrid: getTileGrid(projectionCode, '15.625m'),
      url: `https://gibs-{a-c}.earthdata.nasa.gov/wmts/${projectionCode}/best/wmts.cgi`,
      wrapX: false
    }),
    opacity: 1,
    visible: false
  })

  return layer
}

export default bordersRoads
