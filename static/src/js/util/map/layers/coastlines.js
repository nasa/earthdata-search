import TileLayer from 'ol/layer/Tile'
import { WMTS } from 'ol/source'
import { getTileGrid } from '../getTileGrid'

/**
 * Builds the standard resolution Coastlines layer using OSM data from GIBS
 * @param {Object} params
 * @param {String} params.attributions Attribution for the layer
 * @param {String} params.projectionCode The projection code for the layer
 */
const coastlines = ({
  projectionCode
}) => {
  if (!document.getElementById('coastlines-style')) {
    const style = document.createElement('style')
    style.id = 'coastlines-style'
    style.textContent = `
      .edsc-map-coastlines-layer {
        filter: contrast(1.5) brightness(0.8);
      }
    `

    document.head.appendChild(style)
  }

  const layer = new TileLayer({
    className: 'edsc-map-coastlines-layer',
    source: new WMTS({
      crossOrigin: 'anonymous',
      format: 'image/png',
      layer: 'Coastlines_15m',
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

export default coastlines
