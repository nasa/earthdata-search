import { Map } from 'ol'
import VectorSource from 'ol/source/Vector'

import drawGranuleOutlines from '../drawGranuleOutlines'
import drawGpuGranuleOutlines, { hideGpuGranuleOutlines } from '../gpuGranuleOutlines'

vi.mock('../gpuGranuleOutlines', () => ({
  default: vi.fn(),
  hideGpuGranuleOutlines: vi.fn()
}))

const setup = ({
  moving,
  accelerated,
  hasTransform = true
}: {
  moving: boolean
  accelerated: boolean
  hasTransform?: boolean
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
    ctx,
    map,
    granuleBackgroundsSource: new VectorSource(),
    coordinateToPixelTransform: hasTransform ? [1, 0, 0, -1, 0, 0] : undefined
  })

  return {
    ctx,
    map
  }
}

describe('drawGranuleOutlines', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('when the map is settled', () => {
    test('uses the Canvas painter', () => {
      const { ctx, map } = setup({
        moving: false,
        accelerated: true
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
        moving: true,
        accelerated: true
      })

      expect(drawGpuGranuleOutlines).toHaveBeenCalledTimes(1)
      expect(hideGpuGranuleOutlines).toHaveBeenCalledTimes(0)
      expect(ctx.reset).toHaveBeenCalledTimes(0)
    })

    test('falls back to the Canvas painter when acceleration is unavailable', () => {
      const { ctx, map } = setup({
        moving: true,
        accelerated: false
      })

      expect(hideGpuGranuleOutlines).toHaveBeenCalledTimes(1)
      expect(hideGpuGranuleOutlines).toHaveBeenCalledWith(map)
      expect(ctx.reset).toHaveBeenCalledTimes(1)
    })

    test('uses the Canvas painter without a frame transform', () => {
      const { ctx } = setup({
        moving: true,
        accelerated: true,
        hasTransform: false
      })

      expect(drawGpuGranuleOutlines).toHaveBeenCalledTimes(0)
      expect(ctx.reset).toHaveBeenCalledTimes(1)
    })
  })
})
