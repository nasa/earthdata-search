import TileLayer from 'ol/layer/Tile'
import { XYZ } from 'ol/source'
import { createXYZ } from 'ol/tilegrid'

import { crsProjections, projectionConfigs } from '../crs'

/**
 * Builds the World Imagery base map layer
 * @param {Object} params
 * @param {String} params.attributions Attribution for the layer
 * @param {String} params.projectionCode The projection code for the layer
 */
const worldImagery = ({
  attributions,
  projectionCode
}) => {
  const projection = crsProjections[projectionCode]

  const layer = new TileLayer({
    className: 'edsc-map-base-layer',
    source: new XYZ({
      attributions,
      maxResolution: 180 / 512,
      projection,
      reprojectionErrorThreshold: 2,
      tileGrid: createXYZ({
        extent: [-180, -90, 180, 90],
        maxResolution: 360 / 512,
        maxZoom: projectionConfigs[projectionCode].maxZoom
      }),
      tileSize: 512,
      url: 'https://wi.maptiles.arcgis.com/arcgis/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      wrapX: false
    })
  })

  return layer
}

export default worldImagery
