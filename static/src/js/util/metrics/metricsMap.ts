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
  /** Total number of frames recorded during the performance window (summed across all pan/zoom gestures that occurred within it) */
  frames: number
  /** Median (50th percentile) inter-render interval in milliseconds across all recorded frames */
  p50RenderTimeMs: number
  /** 95th percentile inter-render interval in milliseconds — captures typical "worst case" jank */
  p95RenderTimeMs: number
  /** 99th percentile inter-render interval in milliseconds — captures rare, severe jank */
  p99RenderTimeMs: number
  /** The single longest inter-render interval (ms) observed in the window */
  maxRenderTimeMs: number
  /** Count of frames with an inter-render interval over 33ms (i.e. dropped below ~30fps) */
  slowFrames: number
  /** Count of frames with an inter-render interval over 100ms (severe, user-perceptible jank) */
  verySlowFrames: number
}

export interface MapPerformanceEvent {
  /** IDs of the collection(s) active when this performance window was flushed. Usually a single ID; multiple on the project page */
  collectionIds: string[],
  /** Granule count at the time this performance window was flushed */
  granuleCount: number,
  /** Aggregated frame-rate statistics for this window */
  render: MapRenderStats,
  /** Real time elapsed (ms) between when this window opened and when it was flushed */
  windowDurationMs: number
}

export const metricsMapFramePerformance = (event: MapPerformanceEvent) => {
  dataLayer.push({
    event: 'mapFramePerformance (ms)',
    ...event
  })
}
