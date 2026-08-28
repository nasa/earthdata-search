import { computeBucketGranuleCount } from './helpers'

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
  dataLayer.push({
    event: 'map',
    mapEventCategory: 'performance',
    mapEventAction,
    mapEventLabel: `Map Granule Render ${computeBucketGranuleCount(granuleCount)}`,
    mapEventValue: totalRenderMs,
    // Keep the exact count as a separate field for real analysis outside GA's UI bucketing
    granuleCount,
    collectionId
  })
}

export interface MapRenderStats {
  frames: number
  p50RenderTimeMs: number
  p95RenderTimeMs: number
  p99RenderTimeMs: number
  maxRenderTimeMs: number
  slowFrames: number
  verySlowFrames: number
}

export interface MapPerformanceEvent {
  collectionId: string,
  render: MapRenderStats,
  windowDurationMs: number
}

export const metricsMapFramePerformance = (event: MapPerformanceEvent) => {
  dataLayer.push({
    event: 'MapFramePerformance',
    ...event
  })
}
