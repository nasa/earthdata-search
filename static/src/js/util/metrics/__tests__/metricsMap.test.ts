import {
  metricsMapButtons,
  metricsMapFramePerformance,
  metricsMapRenderPerformance
} from '../metricsMap'

import { computeBucketGranuleCount } from '../helpers'

import type { MapPerformanceEvent } from '../metricsMap'

vi.mock('../helpers', () => ({
  computeBucketGranuleCount: vi.fn(() => '20-40')
}))

describe('metricsMap', () => {
  describe('metricsMapButtons', () => {
    test('pushes the correct event to the dataLayer', () => {
      const dataLayerPushSpy = vi.spyOn(window.dataLayer, 'push')

      metricsMapButtons('Zoom')

      expect(dataLayerPushSpy).toHaveBeenCalledTimes(1)
      expect(dataLayerPushSpy).toHaveBeenCalledWith({
        event: 'map',
        mapEventCategory: 'button',
        mapEventAction: 'click',
        mapEventLabel: 'Map Zoom'
      })
    })
  })

  describe('metricsMapRenderPerformance', () => {
    test('pushes the correct event to the dataLayer', () => {
      const dataLayerPushSpy = vi.spyOn(window.dataLayer, 'push')

      metricsMapRenderPerformance(1500, 123.456, 'initial-render', 'C1000000001-EDSC')

      expect(computeBucketGranuleCount).toHaveBeenCalledTimes(1)
      expect(computeBucketGranuleCount).toHaveBeenCalledWith(1500)

      expect(dataLayerPushSpy).toHaveBeenCalledTimes(1)
      expect(dataLayerPushSpy).toHaveBeenCalledWith({
        event: 'map',
        mapEventCategory: 'performance',
        mapEventAction: 'initial-render',
        mapEventLabel: 'Map Granule Render 20-40',
        mapEventValue: 123.456,
        granuleCount: 1500,
        collectionId: 'C1000000001-EDSC'
      })
    })
  })

  describe('metricsMapFramePerformance', () => {
    test('pushes the correct event to the dataLayer', () => {
      const dataLayerPushSpy = vi.spyOn(window.dataLayer, 'push')

      const event: MapPerformanceEvent = {
        collectionId: 'C1000000001-EDSC',
        render: {
          frames: 120,
          p50RenderTimeMs: 8.2,
          p95RenderTimeMs: 16.4,
          p99RenderTimeMs: 33.1,
          maxRenderTimeMs: 50.7,
          slowFrames: 4,
          verySlowFrames: 1
        },
        windowDurationMs: 10000
      }

      metricsMapFramePerformance(event)

      expect(dataLayerPushSpy).toHaveBeenCalledTimes(1)
      expect(dataLayerPushSpy).toHaveBeenCalledWith({
        event: 'MapFramePerformance',
        collectionId: 'C1000000001-EDSC',
        render: {
          frames: 120,
          p50RenderTimeMs: 8.2,
          p95RenderTimeMs: 16.4,
          p99RenderTimeMs: 33.1,
          maxRenderTimeMs: 50.7,
          slowFrames: 4,
          verySlowFrames: 1
        },
        windowDurationMs: 10000
      })
    })
  })
})
