import { Map } from 'ol'
import VectorSource from 'ol/source/Vector'

import drawGranuleOutlines from '../drawGranuleOutlines'
import drawGpuGranuleOutlines, { hideGpuGranuleOutlines } from '../gpuGranuleOutlines'

vi.mock('../gpuGranuleOutlines', () => ({
  default: vi.fn(),
  hideGpuGranuleOutlines: vi.fn()
}))

const setup = ({
  accelerated,
  hasTransform = true,
  moving
}: {
  /** Whether the GPU boundary reports that it drew this frame. */
  accelerated: boolean
  /** Whether OpenLayers supplies the map-to-CSS-pixel transform. */
  hasTransform?: boolean
  /** Whether the view is animating during this draw. */
  moving: boolean
}) => {
  const ctx = { reset: vi.fn() } as unknown as CanvasRenderingContext2D
  const map = {
    getView: () => ({
      getAnimating: () => moving,
      getInteracting: () => false,
      calculateExtent: () => [-180, -90, 180, 90]
    }),
    getSize: () => [100, 100]
  } as unknown as Map

  vi.mocked(drawGpuGranuleOutlines).mockReturnValue(accelerated)

  drawGranuleOutlines({
    coordinateToPixelTransform: hasTransform ? [1, 0, 0, -1, 0, 0] : undefined,
    ctx,
    granuleBackgroundsSource: new VectorSource(),
    map
  })

  return {
    ctx,
    map
  }
}

describe('drawGranuleOutlines', () => {
  describe('when the map is settled', () => {
    test('uses the Canvas painter', () => {
      const { ctx, map } = setup({
        accelerated: true,
        moving: false
      })

      expect(drawGpuGranuleOutlines).toHaveBeenCalledTimes(0)
      expect(hideGpuGranuleOutlines).toHaveBeenCalledTimes(1)
      expect(hideGpuGranuleOutlines).toHaveBeenCalledWith(map)
      expect(ctx.reset).toHaveBeenCalledTimes(1)
    })
  })

  describe('when the map is moving', () => {
    test('keeps the GPU surface without clearing the Canvas', () => {
      const { ctx } = setup({
        accelerated: true,
        moving: true
      })

      expect(drawGpuGranuleOutlines).toHaveBeenCalledTimes(1)
      expect(hideGpuGranuleOutlines).toHaveBeenCalledTimes(0)
      expect(ctx.reset).toHaveBeenCalledTimes(0)
    })

    test('falls back to the Canvas painter when acceleration is unavailable', () => {
      const { ctx, map } = setup({
        accelerated: false,
        moving: true
      })

      expect(hideGpuGranuleOutlines).toHaveBeenCalledTimes(1)
      expect(hideGpuGranuleOutlines).toHaveBeenCalledWith(map)
      expect(ctx.reset).toHaveBeenCalledTimes(1)
    })

    test('uses the Canvas painter without a frame transform', () => {
      const { ctx } = setup({
        accelerated: true,
        hasTransform: false,
        moving: true
      })

      expect(drawGpuGranuleOutlines).toHaveBeenCalledTimes(0)
      expect(ctx.reset).toHaveBeenCalledTimes(1)
    })
  })
})
