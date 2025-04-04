const mapLayers = {
  // Base layers
  worldImagery: 'worldImagery',
  trueColor: 'trueColor',
  landWaterMap: 'landWaterMap',

  // Overlay layers
  referenceFeatures: 'referenceFeatures',
  coastlines: 'coastlines',
  referenceLabels: 'referenceLabels'
}

// Base Layer IDs
export const baseLayerIds = [
  mapLayers.worldImagery,
  mapLayers.trueColor,
  mapLayers.landWaterMap
]

export default mapLayers
