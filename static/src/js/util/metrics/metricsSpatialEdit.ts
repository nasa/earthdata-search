const { dataLayer = [] } = window

type SpatialEditMetricsParams = {
  /** The sum of distances edited */
  distanceSum: number
  /** The type of spatial edit */
  type: string
}

/**
* Pushes a spatialEdit event on the dataLayer.
* This event is fired when on the spatial edit control we edit shapes on the map
*/
export const metricsSpatialEdit = ({
  distanceSum,
  type
}: SpatialEditMetricsParams) => {
  dataLayer.push({
    event: 'spatialEdit',
    spatialEditEventCategory: 'Spatial Edit',
    spatialEditEventAction: type,
    spatialEditEventLabel: '',
    spatialEditEventValue: Math.round(distanceSum)
  })
}
