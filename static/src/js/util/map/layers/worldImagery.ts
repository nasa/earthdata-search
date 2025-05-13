import TileLayer from 'ol/layer/Tile'
import { XYZ } from 'ol/source'
import { createXYZ } from 'ol/tilegrid'
import { Projection } from 'ol/proj'

import { crsProjections, projectionConfigs } from '../crs'
import { ProjectionCode } from '../../../types/sharedTypes'

/**
 * Builds the World Imagery base map layer
 * https://www.arcgis.com/home/item.html?id=898f58f2ee824b3c97bae0698563a4b3
 * @param {Object} params
 * @param {String} params.projectionCode The projection code for the layer
 * @param {String} params.visible The visibility flag for the layer
 */
const worldImagery = ({
  projectionCode,
  visible
}: {
  /** The projection code for the layer */
  projectionCode: ProjectionCode
  /** The visibility flag for the layer */
  visible: boolean
}) => {
  const projection = crsProjections[projectionCode] as Projection

  const layer = new TileLayer({
    className: 'world-imagery-layer',
    source: new XYZ({
      attributions: 'Esri, Maxar, Earthstar Geographics, and the GIS User Community',
      maxResolution: 180 / 512,
      projection,
      reprojectionErrorThreshold: 2,
      tileGrid: createXYZ({
        extent: projection?.getExtent(),
        maxResolution: 360 / 512,
        maxZoom: projectionConfigs[projectionCode].maxZoom
      }),
      tileSize: 512,
      url: 'https://wi.maptiles.arcgis.com/arcgis/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      wrapX: false
    }),
    visible
  })

  return layer
}

export default worldImagery
