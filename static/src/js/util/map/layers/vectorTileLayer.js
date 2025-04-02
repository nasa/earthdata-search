import VectorTileLayer from 'ol/layer/VectorTile'
import VectorTileSource from 'ol/source/VectorTile'
import MVT from 'ol/format/MVT'
import { applyStyle } from 'ol-mapbox-style'
import { crsProjections } from '../crs'

/**
 * Creates a vector tile layer with configurable styling
 * @param {Object} params
 * @param {String} params.attributions Attribution for the layer
 * @param {String} params.projectionCode The projection code for the layer
 * @param {Object|String} params.style Style object or URL for the layer
 * @param {String} params.url URL for the vector tiles
 * @param {Boolean} params.declutter Whether to declutter labels
 * @param {String} params.renderMode Render mode for the layer ('hybrid', 'vector', etc.)
 * @param {Number} params.zIndex Z-index for the layer
 * @param {Boolean} params.visible Whether the layer should be initially visible
 */
const vectorTileLayer = async ({
  attributions,
  projectionCode,
  style,
  url = 'https://basemaps.arcgis.com/arcgis/rest/services/World_Basemap_GCS_v2/VectorTileServer/tile/{z}/{y}/{x}.pbf',
  declutter = true,
  renderMode = 'hybrid',
  zIndex = undefined,
  visible = false
}) => {
  const projection = crsProjections[projectionCode]

  const layer = new VectorTileLayer({
    source: new VectorTileSource({
      url,
      wrapX: false,
      format: new MVT(),
      projection,
      attributions
    }),
    declutter,
    renderMode,
    zIndex,
    visible
  })

  await applyStyle(layer, style, {
    resolutions: layer.getSource().getTileGrid().getResolutions(),
    transformRequest(url, resourceType) {
      if (resourceType === 'Tile') {
        return new Request(url.replace('/VectorTileServer', '/VectorTileServer/'))
      }

      return new Request(url)
    }
  })

  return layer
}

export default vectorTileLayer
