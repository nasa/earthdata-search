import { bucketGranuleCount } from './helpers'

const { dataLayer = [] } = window

/**
* Pushes a map event on the dataLayer.
* This event is fired when a user interacts with the map
* @param {string} eventLabel - The label for the map event.
*/
export const metricsMapButtons = (eventLabel: string) => {
  dataLayer.push({
    event: 'map',
    mapEventCategory: 'button',
    mapEventAction: 'click',
    mapEventLabel: `Map ${eventLabel}`
  })
}

/**
* Pushes a map event on the dataLayer.
* This event is fired when drawing a collections granules completes
* @param {string} eventLabel - The label for the map event.
* @param {number} granuleCount - The number of granules rendered.
* @param {number} totalRenderMs - The total render time in milliseconds.
*/

export const metricsMapRenderPerformance = (
  granuleCount: number,
  totalRenderMs: number,
  mapEventAction: string,
  collectionId: string
) => {
  console.count('metricsMapRenderPerformance')
  console.log(
    `[map] once ${mapEventAction} for the collection ${collectionId} that has ${granuleCount} granules it took: ${totalRenderMs.toFixed(2)}ms`
  )

  dataLayer.push({
    event: 'map',
    mapEventCategory: 'performance',
    mapEventAction,
    mapEventLabel: `Map Granule Render ${bucketGranuleCount(granuleCount)}`,
    mapEventValue: totalRenderMs,
    // Keep the exact count as a separate field for real analysis outside GA's UI bucketing
    granuleCount,
    collectionId
  })
}

export const metricsMapFps = (fps: number) => {
  dataLayer.push({
    event: 'map',
    mapEventCategory: 'performance',
    mapEventAction: 'fps',
    mapEventLabel: `Map FPS`,
    mapEventValue: fps
  })
}
