import LayerGroup from 'ol/layer/Group'
import TileLayer from 'ol/layer/Tile'

/**
 * Updates the visibility of a specific layer in an OpenLayers LayerGroup
 * @param granuleImageryLayerGroup - The OpenLayers LayerGroup containing granule imagery layers
 * @param productName - The product name to identify the layer
 * @param isVisible - The visibility state to set
 */
export const updateOpenLayersLayerLayerVisibility = (
  granuleImageryLayerGroup: LayerGroup | undefined,
  productName: string,
  isVisible: boolean
): void => {
  if (!granuleImageryLayerGroup) return

  const groupLayers = granuleImageryLayerGroup.getLayers()
  groupLayers.forEach((layer) => {
    if (layer instanceof TileLayer) {
      // Check if this layer belongs to the toggled product using the stored product property
      const layerProduct = layer.get('product')
      if (layerProduct === productName) {
        layer.setVisible(isVisible)
      }
    }
  })
}

/**
 * Updates the opacity of a specific layer in an OpenLayers LayerGroup
 * @param granuleImageryLayerGroup - The OpenLayers LayerGroup containing granule imagery layers
 * @param productName - The product name to identify the layer
 * @param opacity - The opacity value to set (0-1)
 */
export const updateOpenLayersLayerOpacity = (
  granuleImageryLayerGroup: LayerGroup | undefined,
  productName: string,
  opacity: number
): void => {
  if (!granuleImageryLayerGroup) return

  const groupLayers = granuleImageryLayerGroup.getLayers()
  groupLayers.forEach((layer) => {
    if (layer instanceof TileLayer) {
      const layerProduct = layer.get('product')
      if (layerProduct === productName) {
        layer.setOpacity(opacity)
      }
    }
  })
}
