import VectorTileLayer from 'ol/layer/VectorTile'
import VectorTileSource from 'ol/source/VectorTile'
import MVT from 'ol/format/MVT'
import { applyStyle } from 'ol-mapbox-style'
import { crsProjections } from '../crs'

// Style provided by Worldview
const styleUrl = 'https://nasa.maps.arcgis.com/sharing/rest/content/items/b611632010304f9a9358e1eec064cd25/resources/styles/root.json?f=pjson'

/**
 * Builds the Borders and Roads layer for the OpenLayers map
 * @param {Object} params - Parameters for layer configuration
 * @param {string} params.attributions - Attribution text for the layer
 * @param {string} params.projectionCode - The projection code (e.g., 'EPSG:4326')
 * @param {Object} params.styleJson - The Mapbox style JSON to filter for borders and roads
 * @returns {Promise<VectorTileLayer>} - The configured Borders and Roads layer
 */
const bordersAndRoadsLayer = async ({
  attributions,
  projectionCode
}) => {
  const projection = crsProjections[projectionCode]

  // Filter the styleJson to include only borders and roads layers
  // Note: Adjust the filter based on the actual layer IDs in your styleJson
  // const filteredStyle = {
  //   ...styleUrl,
  //   layers: styleUrl.layers.filter((layer) => layer.id.includes('border') || layer.id.includes('road'))
  // }

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
  })

  await applyStyle(layer, styleUrl, {
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

export default bordersAndRoadsLayer
