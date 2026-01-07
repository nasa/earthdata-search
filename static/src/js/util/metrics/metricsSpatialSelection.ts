const { dataLayer = [] } = window

/**
* Pushes a spatialSelection event on the dataLayer.
* This event is fired when a user makes a spatial selection on the map
* @param {string} shapeType - The type of shape selected (e.g., 'rectangle', 'polygon', 'circle').
*/
export const metricsSpatialSelection = (shapeType: string) => {
  dataLayer.push({
    event: 'spatialSelection',
    spatialSelectionCategory: 'Spatial Selection',
    spatialSelectionEventLabel: shapeType
  })
}
