import { RefObject } from 'react'

import RenderEventType, { LayerRenderEventTypes } from 'ol/render/EventType'
import VectorLayer from 'ol/layer/Vector'
import { EventsKey } from 'ol/events'
// @ts-expect-error: Types do not exist for this file
import { getApplicationConfig } from '../../../../../sharedUtils/config'

import {
  metricsMapFramePerformance,
  metricsMapRenderPerformance,
  MapPerformanceEvent
} from '../metrics/metricsMap'

import { computePercentile } from '../metrics/helpers'

// How often (in ms) the accumulated performance window is flushed to metrics
const { mapPerformanceWindowMs } = getApplicationConfig()

export const MAP_PERFORMANCE_WINDOW_MS = mapPerformanceWindowMs || 5000

export interface MapPerformanceWindow {
  /** Timestamp (from performance.now()) marking when the current metrics window started */
  windowStart: number
  /** Total number of frames recorded during a pan/zoom interaction in this window
   *  this is the cumulative count of postrender events collected across possibly multiple separate pan/zoom gestures,
   *  accumulated until the (`PERFORMANCE_WINDOW_MS`) window is flushed.
  */
  frames: number
  /** Count of frames that took longer than 33ms to render (i.e. dropped below ~30fps) */
  slowFrames: number
  /** Count of frames that took longer than 100ms to render (severe jank) */
  verySlowFrames: number
  /** Raw list of individual frame render durations (ms), used to compute percentiles (p50/p95/p99) */
  renderTimes: number[]
  /** The single longest frame render duration (ms) observed in this window */
  maxRenderTimeMs: number
}

export const createEmptyPerformanceWindow = (): MapPerformanceWindow => ({
  windowStart: performance.now(),
  frames: 0,
  slowFrames: 0,
  verySlowFrames: 0,
  renderTimes: [],
  maxRenderTimeMs: 0
})

interface TimeLayerRenderOnceParams {
  /** The vector layer to time a single render pass for */
  layer: VectorLayer
  /** Label used for the performance mark/measure names and reported as the metric's identifier */
  label: string
  /** Number of granules being rendered, passed through to the metrics helper */
  granuleCount: number
  /** IDs of the collection(s) active for this render. Usually a single ID; multiple on the project page */
  collectionIds: string[]
  /** Map center at the time this render was triggered */
  center: {
    latitude: number
    longitude: number
  }
  /** Map zoom level at the time this render was triggered */
  zoomLevel: number
}

// Times a single prerender → postrender pass for a layer using .once(),
// so it only fires for the very next render triggered after this is called.
export const timeLayerRenderOnce = ({
  layer,
  label,
  granuleCount,
  collectionIds,
  center,
  zoomLevel
}: TimeLayerRenderOnceParams): EventsKey[] => {
  let start = 0

  const preKey = layer.once(RenderEventType.PRERENDER as LayerRenderEventTypes, () => {
    start = performance.now()
    performance.mark(`${label}-prerender`)
  })

  const postKey = layer.once(RenderEventType.POSTRENDER as LayerRenderEventTypes, () => {
    const duration = performance.now() - start
    performance.mark(`${label}-postrender`)
    performance.measure(label, `${label}-prerender`, `${label}-postrender`)

    // Fire one event per active collection so per-collection analysis
    // stays possible; the render duration describes the same shared pass.
    collectionIds.forEach((collectionId) => {
      metricsMapRenderPerformance({
        granuleCount,
        totalRenderMs: duration,
        mapEventAction: label,
        collectionId,
        center,
        zoomLevel
      })
    })
  })

  return [preKey, postKey]
}

export const flushMapPerformanceMetrics = (
  performanceWindowRef: RefObject<MapPerformanceWindow>,
  collectionIds: string[],
  granuleCount: number
) => {
  if (!collectionIds || collectionIds.length === 0) {
    return
  }

  const metrics = performanceWindowRef.current
  if (metrics.frames === 0) {
    metrics.windowStart = performance.now()

    return
  }

  const sortedRenderTimes = [...metrics.renderTimes].sort(
    (a, b) => a - b
  )

  const event: MapPerformanceEvent = {
    windowDurationMs: performance.now() - metrics.windowStart,
    render: {
      frames: metrics.frames,
      p50RenderTimeMs: computePercentile(sortedRenderTimes, 0.5),
      p95RenderTimeMs: computePercentile(sortedRenderTimes, 0.95),
      p99RenderTimeMs: computePercentile(sortedRenderTimes, 0.99),
      maxRenderTimeMs: metrics.maxRenderTimeMs,
      slowFrames: metrics.slowFrames,
      verySlowFrames: metrics.verySlowFrames
    },
    collectionIds,
    granuleCount
  }
  metricsMapFramePerformance(event)

  // Clear the metrics for the next window
  // eslint-disable-next-line no-param-reassign
  performanceWindowRef.current = createEmptyPerformanceWindow()
}
