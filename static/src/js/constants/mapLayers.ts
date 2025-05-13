const mapLayers = {
  // Base layers
  worldImagery: 'worldImagery',
  trueColor: 'trueColor',
  landWaterMap: 'landWaterMap',

  // Overlay layers
  bordersRoads: 'bordersRoads',
  coastlines: 'coastlines',
  placeLabels: 'placeLabels'
}

// Base Layer IDs
export const baseLayerIds = [
  mapLayers.worldImagery,
  mapLayers.trueColor,
  mapLayers.landWaterMap
]

export default mapLayers
