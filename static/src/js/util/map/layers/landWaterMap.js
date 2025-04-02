import VectorTileLayer from 'ol/layer/VectorTile'
import VectorTileSource from 'ol/source/VectorTile'
import MVT from 'ol/format/MVT'

import { applyStyle } from 'ol-mapbox-style'

import { crsProjections } from '../crs'

import { getApplicationConfig } from '../../../../../../sharedUtils/config'

// Import the land-water map style JSON file
import landWaterMapStyleUrl from './landWaterMap.json'

/**
 * Builds the place labels layer
 * @param {Object} params
 * @param {String} params.attributions Attribution for the layer
 * @param {String} params.projectionCode The projection code for the layer
 */
const landWaterMap = async ({
  attributions,
  projectionCode
}) => {
  const projection = crsProjections[projectionCode]

  // Setup the VectorTileLayer
  const layer = new VectorTileLayer({
    source: new VectorTileSource({
      url: 'https://basemaps.arcgis.com/arcgis/rest/services/World_Basemap_GCS_v2/VectorTileServer/tile/{z}/{y}/{x}.pbf',
      wrapX: false,
      format: new MVT(),
      projection,
      attributions
    }),
    declutter: true,
    renderMode: 'hybrid'
    // ZIndex: 5
  })

  // Style the layer according to the landWaterMapStyleUrl, provided by Worldview
  await applyStyle(layer, landWaterMapStyleUrl, {
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

export default landWaterMap
