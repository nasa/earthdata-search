// Create a new file at: /static/src/js/util/map/layers/landWaterMap.js

import TileLayer from 'ol/layer/Tile'
import { XYZ } from 'ol/source'
import { createXYZ } from 'ol/tilegrid'

import { crsProjections, projectionConfigs } from '../crs'

/**
 * Builds the Land/Water Map layer
 * @param {Object} params
 * @param {String} params.attributions Attribution for the layer
 * @param {String} params.projectionCode The projection code for the layer
 */
const landWaterMap = ({
  attributions,
  projectionCode
}) => {
  const projection = crsProjections[projectionCode]

  const layer = new TileLayer({
    className: 'edsc-map-land-water-layer',
    source: new XYZ({
      attributions,
      maxResolution: 180 / 512,
      projection,
      reprojectionErrorThreshold: 2,
      tileGrid: createXYZ({
        extent: projection.getExtent(),
        maxResolution: 360 / 512,
        maxZoom: projectionConfigs[projectionCode].maxZoom
      }),
      tileSize: 512,
      url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Terrain_Base/MapServer/tile/{z}/{y}/{x}',
      wrapX: false
    }),
    visible: false
  })

  return layer
}

export default landWaterMap
