import TileLayer from 'ol/layer/Tile'
import { XYZ } from 'ol/source'
import { createXYZ } from 'ol/tilegrid'
import { crsProjections, projectionConfigs } from '../crs'

/**
 * Map our projection codes to GIBS projection identifiers
 * @param {String} projectionCode Our projection code
 * @return {String} GIBS projection identifier
 */
const getGibsProjection = (projectionCode) => {
  const projectionMap = {
    epsg4326: 'epsg4326',
    epsg3413: 'epsg3413', // Arctic
    epsg3031: 'epsg3031' // Antarctic
  }

  return projectionMap[projectionCode] || 'epsg4326'
}

/**
 * Builds the standard resolution Coastlines layer using OSM data from GIBS
 * @param {Object} params
 * @param {String} params.attributions Attribution for the layer
 * @param {String} params.projectionCode The projection code for the layer
 */
const coastlines = ({
  attributions,
  projectionCode
}) => {
  const projection = crsProjections[projectionCode]
  const gibsProjection = getGibsProjection(projectionCode)

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
    source: new XYZ({
      attributions,
      maxResolution: 180 / 512,
      projection,
      reprojectionErrorThreshold: 2,
      tileGrid: createXYZ({
        extent: projection.getExtent(),
        maxResolution: 576 / 512,
        maxZoom: projectionConfigs[projectionCode].maxZoom
      }),
      tileSize: 512,

      url: `https://gibs.earthdata.nasa.gov/wmts/${gibsProjection}/best/Coastlines/default/250m/{z}/{y}/{x}.png`,
      wrapX: false
    }),
    opacity: 1,
    visible: false
  })

  return layer
}

export default coastlines
