import TileLayer from 'ol/layer/Tile'
import XYZ from 'ol/source/XYZ'

/**
 * Creates a coastlines layer
 * @param {Object} options - Options for the layer
 * @param {String} options.attributions - Attribution for the layer
 * @param {String} options.projectionCode - Projection code for the layer
 * @return {TileLayer} - OpenLayers TileLayer
 */
const oceanDepth = ({
  attributions,
  projectionCode
}) => {
  // Create a new tile layer for coastlines
  const oceanDepthLayer = new TileLayer({
    source: new XYZ({
      attributions,
      url: 'https://services.arcgisonline.com/arcgis/rest/services/Ocean/World_Ocean_Base/MapServer/tile/{z}/{y}/{x}',
      maxZoom: 16
    }),
    className: 'edsc-coastlines-layer',
    visible: false // Default to hidden until selected
  })

  return oceanDepthLayer
}

export default oceanDepth
