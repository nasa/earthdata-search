import VectorTileLayer, { VectorTileRenderType } from 'ol/layer/VectorTile'
import VectorTileSource from 'ol/source/VectorTile'
import MVT from 'ol/format/MVT'
import { applyStyle } from 'ol-mapbox-style'
import { Projection } from 'ol/proj'

import { crsProjections } from '../crs'
import projectionCodes from '../../../constants/projectionCodes'
import { ProjectionCode } from '../../../types/sharedTypes'

/**
 * Creates a vector tile layer with configurable styling
 * @param {Object} params
 * @param {String} params.attributions Attribution for the layer
 * @param {String} params.className CSS class name for the layer
 * @param {Boolean} params.declutter Whether to declutter labels
 * @param {String} params.projectionCode The projection code for the layer
 * @param {String} params.renderMode Render mode for the layer ('hybrid', 'vector', etc.)
 * @param {Object|String} params.style Style object or URL for the layer
 * @param {String} params.url URL for the vector tiles
 * @param {Boolean} params.visible Whether the layer should be initially visible
 * @param {Number} params.zIndex Z-index for the layer
 */
const vectorTileLayer = async ({
  attributions,
  className,
  declutter = true,
  projectionCode,
  renderMode = 'hybrid',
  style,
  url = 'https://basemaps.arcgis.com/arcgis/rest/services/World_Basemap_GCS_v2/VectorTileServer/tile/{z}/{y}/{x}.pbf',
  visible = false,
  zIndex = undefined
}: {
  /** Attribution for the layer */
  attributions: string
  /** CSS class name for the layer */
  className: string
  /** Whether to declutter labels */
  declutter?: boolean
  /** The projection code for the layer */
  projectionCode: ProjectionCode
  /** Render mode for the layer ('hybrid', 'vector', etc.) */
  renderMode?: VectorTileRenderType
  /** Style object or URL for the layer */
  style: object | string
  /** URL for the vector tiles */
  url?: string
  /** Whether the layer should be initially visible */
  visible?: boolean
  /** Z-index for the layer */
  zIndex?: number
}) => {
  // If the projection code is not geographic, return null because the VectorTileLayer can not be reprojected
  if (projectionCode !== projectionCodes.geographic) return null

  const projection = crsProjections[projectionCode] as Projection

  const layer = new VectorTileLayer({
    className,
    declutter,
    renderMode,
    source: new VectorTileSource({
      attributions,
      format: new MVT(),
      projection,
      url,
      wrapX: false
    }),
    visible,
    zIndex
  })

  await applyStyle(layer, style, {
    resolutions: layer?.getSource()?.getTileGrid()?.getResolutions() || [],
    transformRequest(tileUrl: string, resourceType: string) {
      if (resourceType === 'Tile') {
        return new Request(tileUrl.replace('/VectorTileServer', '/VectorTileServer/'))
      }

      return new Request(tileUrl)
    }
  })

  return layer
}

export default vectorTileLayer
