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
interface MetricsMapRenderPerformanceParams {
  /** Number of granules being rendered */
  granuleCount: number
  /** Total render duration in milliseconds (prerender → postrender) */
  totalRenderMs: number
  /** The map event action label (e.g. 'granule-backgrounds', 'granule-outlines') */
  mapEventAction: string
  /** ID of the collection being rendered */
  collectionId: string
  /** Map center at the time this render was triggered */
  center: {
    latitude: number
    longitude: number
  }
  /** Map zoom level at the time this render was triggered */
  zoomLevel: number
}

export const metricsMapRenderPerformance = ({
  granuleCount,
  totalRenderMs,
  mapEventAction,
  collectionId,
  center,
  zoomLevel
}: MetricsMapRenderPerformanceParams) => {
  dataLayer.push({
    event: 'map',
    mapEventCategory: 'performance',
    mapEventAction,
    mapEventLabel: `Map Granule Render ${computeBucketGranuleCount(granuleCount)}`,
    mapEventValue: totalRenderMs,
    // Keep the exact count as a separate field for real analysis outside GA's UI bucketing
    granuleCount,
    collectionId,
    center,
    zoomLevel
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
  collectionIds: string[],
  render: MapRenderStats,
  windowDurationMs: number
}

export const metricsMapFramePerformance = (event: MapPerformanceEvent) => {
  dataLayer.push({
    event: 'mapFramePerformance (ms)',
    ...event
  })
}
