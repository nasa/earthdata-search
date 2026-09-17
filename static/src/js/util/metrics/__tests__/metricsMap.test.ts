import {
  createEmptyPerformanceWindow,
  flushMapPerformanceMetrics,
  recordInteractionFrames,
  MAP_PERFORMANCE_WINDOW_MS
} from '../../../../js/util/map/mapPerformanceMetrics'

import { computePercentile } from '../../metrics/helpers'
import { metricsMapFramePerformance } from '../../metrics/metricsMap'

vi.mock('../../metrics/metricsMap', () => ({
  metricsMapFramePerformance: vi.fn(),
  metricsMapRenderPerformance: vi.fn()
}))

// Stubbed so percentile assertions below don't depend on computePercentile's own
// logic (that's covered by helpers.test.ts). Returns quantile * 100 rounded, so
// p50 -> 50, p95 -> 95, p99 -> 99, independent of the renderTimes passed in.
vi.mock('../../metrics/helpers', () => ({
  computePercentile: vi.fn((_renderTimes: number[], quantile: number) => Math.round(quantile * 100))
}))

describe('mapPerformanceMetrics', () => {
  describe('recordInteractionFrames', () => {
    describe('when the interaction ends before the window closes', () => {
      test('holds the samples without emitting', () => {
        vi.spyOn(performance, 'now').mockReturnValue(0)

        const performanceWindowRef = { current: createEmptyPerformanceWindow() }

        vi.mocked(performance.now).mockReturnValue(MAP_PERFORMANCE_WINDOW_MS - 1800)

        const didFlush = recordInteractionFrames({
          performanceWindowRef,
          frameTimes: [16, 18, 40],
          collectionIds: ['C1000000001-EDSC'],
          granuleCount: 1500
        })

        expect(didFlush).toBe(false)
        expect(metricsMapFramePerformance).toHaveBeenCalledTimes(0)
        expect(computePercentile).toHaveBeenCalledTimes(0)

        expect(performanceWindowRef.current.frames).toEqual(3)
        expect(performanceWindowRef.current.slowFrames).toEqual(1)
        expect(performanceWindowRef.current.verySlowFrames).toEqual(0)
        expect(performanceWindowRef.current.maxRenderTimeMs).toEqual(40)
        expect(performanceWindowRef.current.windowStart).toEqual(0)
      })
    })

    describe('when a later interaction ends after the window closes', () => {
      test('emits the held samples alongside the new ones', () => {
        vi.spyOn(performance, 'now').mockReturnValue(0)

        const performanceWindowRef = { current: createEmptyPerformanceWindow() }

        vi.mocked(performance.now).mockReturnValue(MAP_PERFORMANCE_WINDOW_MS - 1800)

        recordInteractionFrames({
          performanceWindowRef,
          frameTimes: [16, 18, 40],
          collectionIds: ['C1000000001-EDSC'],
          granuleCount: 1500
        })

        vi.mocked(performance.now).mockReturnValue(MAP_PERFORMANCE_WINDOW_MS + 1000)

        const didFlush = recordInteractionFrames({
          performanceWindowRef,
          frameTimes: [20],
          collectionIds: ['C1000000001-EDSC'],
          granuleCount: 1500
        })

        expect(didFlush).toBe(true)

        expect(computePercentile).toHaveBeenCalledTimes(3)
        expect(computePercentile).toHaveBeenCalledWith([16, 18, 20, 40], 0.5)
        expect(computePercentile).toHaveBeenCalledWith([16, 18, 20, 40], 0.95)
        expect(computePercentile).toHaveBeenCalledWith([16, 18, 20, 40], 0.99)

        expect(metricsMapFramePerformance).toHaveBeenCalledTimes(1)
        expect(metricsMapFramePerformance).toHaveBeenCalledWith({
          collectionIds: ['C1000000001-EDSC'],
          granuleCount: 1500,
          render: {
            frames: 4,
            p50RenderTimeMs: 50,
            p95RenderTimeMs: 95,
            p99RenderTimeMs: 99,
            maxRenderTimeMs: 40,
            slowFrames: 1,
            verySlowFrames: 0
          },
          windowDurationMs: MAP_PERFORMANCE_WINDOW_MS + 1000
        })

        expect(performanceWindowRef.current.frames).toEqual(0)
        expect(performanceWindowRef.current.windowStart).toEqual(MAP_PERFORMANCE_WINDOW_MS + 1000)
      })
    })

    describe('when the first interaction ends after the window closes', () => {
      test('emits without waiting for a second interaction', () => {
        vi.spyOn(performance, 'now').mockReturnValue(0)

        const performanceWindowRef = { current: createEmptyPerformanceWindow() }

        vi.mocked(performance.now).mockReturnValue(MAP_PERFORMANCE_WINDOW_MS + 2000)

        const didFlush = recordInteractionFrames({
          performanceWindowRef,
          frameTimes: [10, 12],
          collectionIds: ['C1000000001-EDSC'],
          granuleCount: 1500
        })

        expect(didFlush).toBe(true)

        expect(computePercentile).toHaveBeenCalledWith([10, 12], 0.5)
        expect(computePercentile).toHaveBeenCalledWith([10, 12], 0.95)
        expect(computePercentile).toHaveBeenCalledWith([10, 12], 0.99)

        expect(metricsMapFramePerformance).toHaveBeenCalledTimes(1)
        expect(metricsMapFramePerformance).toHaveBeenCalledWith({
          collectionIds: ['C1000000001-EDSC'],
          granuleCount: 1500,
          render: {
            frames: 2,
            p50RenderTimeMs: 50,
            p95RenderTimeMs: 95,
            p99RenderTimeMs: 99,
            maxRenderTimeMs: 12,
            slowFrames: 0,
            verySlowFrames: 0
          },
          windowDurationMs: MAP_PERFORMANCE_WINDOW_MS + 2000
        })
      })
    })

    describe('when the interaction produced no frames', () => {
      test('does not emit or modify the window', () => {
        vi.spyOn(performance, 'now').mockReturnValue(0)

        const performanceWindowRef = { current: createEmptyPerformanceWindow() }

        vi.mocked(performance.now).mockReturnValue(MAP_PERFORMANCE_WINDOW_MS + 1000)

        const didFlush = recordInteractionFrames({
          performanceWindowRef,
          frameTimes: [],
          collectionIds: ['C1000000001-EDSC'],
          granuleCount: 1500
        })

        expect(didFlush).toBe(false)
        expect(metricsMapFramePerformance).toHaveBeenCalledTimes(0)
        expect(computePercentile).toHaveBeenCalledTimes(0)
        expect(performanceWindowRef.current.frames).toEqual(0)
        expect(performanceWindowRef.current.windowStart).toEqual(0)
      })
    })

    describe('when there is no focused collection', () => {
      test('holds the samples for a later flush', () => {
        vi.spyOn(performance, 'now').mockReturnValue(0)

        const performanceWindowRef = { current: createEmptyPerformanceWindow() }

        vi.mocked(performance.now).mockReturnValue(MAP_PERFORMANCE_WINDOW_MS + 1000)

        const didFlush = recordInteractionFrames({
          performanceWindowRef,
          frameTimes: [16, 18],
          collectionIds: [''],
          granuleCount: 0
        })

        expect(didFlush).toBe(false)
        expect(metricsMapFramePerformance).toHaveBeenCalledTimes(0)
        expect(performanceWindowRef.current.frames).toEqual(2)
      })
    })
  })

  describe('flushMapPerformanceMetrics', () => {
    describe('when there are no collection ids', () => {
      test('does not emit', () => {
        vi.spyOn(performance, 'now').mockReturnValue(0)

        const performanceWindowRef = { current: createEmptyPerformanceWindow() }
        performanceWindowRef.current.frames = 2

        flushMapPerformanceMetrics(performanceWindowRef, [], 1500)

        expect(metricsMapFramePerformance).toHaveBeenCalledTimes(0)
      })
    })

    describe('when there are no frames', () => {
      test('re-anchors the window without emitting', () => {
        vi.spyOn(performance, 'now').mockReturnValue(0)

        const performanceWindowRef = { current: createEmptyPerformanceWindow() }

        vi.mocked(performance.now).mockReturnValue(MAP_PERFORMANCE_WINDOW_MS)

        flushMapPerformanceMetrics(performanceWindowRef, ['C1000000001-EDSC'], 1500)

        expect(metricsMapFramePerformance).toHaveBeenCalledTimes(0)
        expect(performanceWindowRef.current.windowStart).toEqual(MAP_PERFORMANCE_WINDOW_MS)
      })
    })
  })
})
