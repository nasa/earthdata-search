import { Map } from 'ol'
import VectorSource from 'ol/source/Vector'

import {
  drawGranuleOutlinesSnapshot,
  saveGranuleOutlinesSnapshot
} from '../granuleOutlinesSnapshot'

// The context of the snapshot canvas. jsdom does not implement canvas drawing, so every
// snapshot canvas created during a test uses this context.
const snapshotCtx = {
  clearRect: vi.fn(),
  drawImage: vi.fn()
}

// Creates a stand-in for the context of the granule outlines canvas
const createCtx = ({ height = 500, width = 1000 } = {}) => ({
  canvas: {
    height,
    width
  },
  drawImage: vi.fn(),
  restore: vi.fn(),
  save: vi.fn(),
  setTransform: vi.fn()
} as unknown as CanvasRenderingContext2D)

// Creates a stand-in for the OL map, with a `view` that can be changed to pan and zoom the map.
// The map starts with every map coordinate being equal to its pixel on the map.
const createMap = () => {
  const view = {
    // The number of pixels the map has been panned
    panX: 0,
    panY: 0,
    // How far the map has been zoomed, `2` means everything is drawn twice as big
    zoom: 1
  }

  const map = {
    getCoordinateFromPixel: ([x, y]: number[]) => [
      (x - view.panX) / view.zoom,
      (y - view.panY) / view.zoom
    ],
    getPixelFromCoordinate: ([x, y]: number[]) => [
      (x * view.zoom) + view.panX,
      (y * view.zoom) + view.panY
    ]
  } as unknown as Map

  return {
    map,
    view
  }
}

// Saves a snapshot of a 1000x500 canvas, then returns everything needed to draw it again
const setup = () => {
  const { map, view } = createMap()
  const granuleBackgroundsSource = new VectorSource()

  const savedCtx = createCtx()
  saveGranuleOutlinesSnapshot({
    ctx: savedCtx,
    granuleBackgroundsSource,
    map
  })

  return {
    ctx: createCtx(),
    granuleBackgroundsSource,
    map,
    savedCtx,
    view
  }
}

beforeEach(() => {
  vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(
    snapshotCtx as unknown as CanvasRenderingContext2D
  )
})

afterEach(() => {
  window.devicePixelRatio = 1
})

describe('granuleOutlinesSnapshot', () => {
  describe('saveGranuleOutlinesSnapshot', () => {
    test('copies the granule outlines canvas', () => {
      const { savedCtx } = setup()

      expect(snapshotCtx.clearRect).toHaveBeenCalledTimes(1)
      expect(snapshotCtx.clearRect).toHaveBeenCalledWith(0, 0, 1000, 500)

      expect(snapshotCtx.drawImage).toHaveBeenCalledTimes(1)
      expect(snapshotCtx.drawImage).toHaveBeenCalledWith(savedCtx.canvas, 0, 0)
    })

    test('reuses the snapshot canvas when the outlines are saved again for the same map', () => {
      const {
        granuleBackgroundsSource,
        map,
        savedCtx
      } = setup()

      const createElementSpy = vi.spyOn(document, 'createElement')

      saveGranuleOutlinesSnapshot({
        ctx: savedCtx,
        granuleBackgroundsSource,
        map
      })

      expect(createElementSpy).toHaveBeenCalledTimes(0)
    })
  })

  describe('drawGranuleOutlinesSnapshot', () => {
    describe('when no snapshot has been saved for the map', () => {
      test('does not draw and returns false', () => {
        const { ctx, granuleBackgroundsSource } = setup()

        // A different map to the one the snapshot was saved for
        const { map } = createMap()

        const result = drawGranuleOutlinesSnapshot({
          ctx,
          granuleBackgroundsSource,
          isMoving: true,
          map
        })

        expect(result).toEqual(false)
        expect(ctx.drawImage).toHaveBeenCalledTimes(0)
      })
    })

    describe('when the map has not moved since the snapshot was saved', () => {
      test('draws the snapshot as it was saved and returns true', () => {
        const { ctx, granuleBackgroundsSource, map } = setup()

        const result = drawGranuleOutlinesSnapshot({
          ctx,
          granuleBackgroundsSource,
          isMoving: false,
          map
        })

        expect(result).toEqual(true)

        // The snapshot is not moved or scaled
        expect(ctx.setTransform).toHaveBeenCalledTimes(0)

        expect(ctx.drawImage).toHaveBeenCalledTimes(1)
        expect(ctx.drawImage).toHaveBeenCalledWith(expect.any(HTMLCanvasElement), 0, 0)
      })
    })

    describe('when the map has moved since the snapshot was saved, and has stopped moving', () => {
      test('does not draw and returns false', () => {
        const {
          ctx,
          granuleBackgroundsSource,
          map,
          view
        } = setup()

        view.panX = 100

        const result = drawGranuleOutlinesSnapshot({
          ctx,
          granuleBackgroundsSource,
          isMoving: false,
          map
        })

        expect(result).toEqual(false)
        expect(ctx.drawImage).toHaveBeenCalledTimes(0)
      })
    })

    describe('when the map has been panned', () => {
      test('draws the snapshot moved by the same amount', () => {
        const {
          ctx,
          granuleBackgroundsSource,
          map,
          view
        } = setup()

        view.panX = 100
        view.panY = -40

        const result = drawGranuleOutlinesSnapshot({
          ctx,
          granuleBackgroundsSource,
          isMoving: true,
          map
        })

        expect(result).toEqual(true)

        expect(ctx.save).toHaveBeenCalledTimes(1)
        expect(ctx.save).toHaveBeenCalledWith()

        expect(ctx.setTransform).toHaveBeenCalledTimes(1)
        expect(ctx.setTransform).toHaveBeenCalledWith(1, 0, 0, 1, 100, -40)

        expect(ctx.drawImage).toHaveBeenCalledTimes(1)
        expect(ctx.drawImage).toHaveBeenCalledWith(expect.any(HTMLCanvasElement), 0, 0)

        expect(ctx.restore).toHaveBeenCalledTimes(1)
        expect(ctx.restore).toHaveBeenCalledWith()
      })
    })

    describe('when the map has been zoomed', () => {
      test('draws the snapshot scaled by the same amount', () => {
        const {
          ctx,
          granuleBackgroundsSource,
          map,
          view
        } = setup()

        // Zoom in 1.5x around the middle of the 1000x500 canvas
        view.zoom = 1.5
        view.panX = -250
        view.panY = -125

        const result = drawGranuleOutlinesSnapshot({
          ctx,
          granuleBackgroundsSource,
          isMoving: true,
          map
        })

        expect(result).toEqual(true)

        expect(ctx.setTransform).toHaveBeenCalledTimes(1)
        expect(ctx.setTransform).toHaveBeenCalledWith(1.5, 0, 0, 1.5, -250, -125)

        expect(ctx.drawImage).toHaveBeenCalledTimes(1)
        expect(ctx.drawImage).toHaveBeenCalledWith(expect.any(HTMLCanvasElement), 0, 0)
      })
    })

    describe('when the device pixel ratio is not 1', () => {
      test('draws the snapshot in device pixels', () => {
        // The canvas is still 1000x500, so with a device pixel ratio of 2 the map is 500x250
        window.devicePixelRatio = 2

        const {
          ctx,
          granuleBackgroundsSource,
          map,
          view
        } = setup()

        // Pan the map by 100 CSS pixels, which is 200 pixels on the canvas
        view.panX = 100

        const result = drawGranuleOutlinesSnapshot({
          ctx,
          granuleBackgroundsSource,
          isMoving: true,
          map
        })

        expect(result).toEqual(true)

        expect(ctx.setTransform).toHaveBeenCalledTimes(1)
        expect(ctx.setTransform).toHaveBeenCalledWith(1, 0, 0, 1, 200, 0)
      })
    })

    describe('when the granules have changed since the snapshot was saved', () => {
      test('does not draw and returns false', () => {
        const { ctx, granuleBackgroundsSource, map } = setup()

        // Any change to the granules changes the revision of the source
        granuleBackgroundsSource.changed()

        const result = drawGranuleOutlinesSnapshot({
          ctx,
          granuleBackgroundsSource,
          isMoving: true,
          map
        })

        expect(result).toEqual(false)
        expect(ctx.drawImage).toHaveBeenCalledTimes(0)
      })
    })

    describe('when the map has been resized since the snapshot was saved', () => {
      test('does not draw and returns false', () => {
        const { granuleBackgroundsSource, map } = setup()

        const ctx = createCtx({
          height: 600,
          width: 1000
        })

        const result = drawGranuleOutlinesSnapshot({
          ctx,
          granuleBackgroundsSource,
          isMoving: true,
          map
        })

        expect(result).toEqual(false)
        expect(ctx.drawImage).toHaveBeenCalledTimes(0)
      })
    })

    describe('when the map has been zoomed in to more than double the size', () => {
      test('does not draw and returns false', () => {
        const {
          ctx,
          granuleBackgroundsSource,
          map,
          view
        } = setup()

        // Zoom in 2.1x around the middle of the canvas
        view.zoom = 2.1
        view.panX = -550
        view.panY = -275

        const result = drawGranuleOutlinesSnapshot({
          ctx,
          granuleBackgroundsSource,
          isMoving: true,
          map
        })

        expect(result).toEqual(false)
        expect(ctx.drawImage).toHaveBeenCalledTimes(0)
      })
    })

    describe('when the map has been zoomed out to less than half the size', () => {
      test('does not draw and returns false', () => {
        const {
          ctx,
          granuleBackgroundsSource,
          map,
          view
        } = setup()

        // Zoom out to 0.4x around the middle of the canvas
        view.zoom = 0.4
        view.panX = 300
        view.panY = 150

        const result = drawGranuleOutlinesSnapshot({
          ctx,
          granuleBackgroundsSource,
          isMoving: true,
          map
        })

        expect(result).toEqual(false)
        expect(ctx.drawImage).toHaveBeenCalledTimes(0)
      })
    })

    describe('when the map has been panned by less than half of the canvas', () => {
      test('draws the snapshot and returns true', () => {
        const {
          ctx,
          granuleBackgroundsSource,
          map,
          view
        } = setup()

        // Half of the 1000px wide canvas is 500px
        view.panX = 499

        const result = drawGranuleOutlinesSnapshot({
          ctx,
          granuleBackgroundsSource,
          isMoving: true,
          map
        })

        expect(result).toEqual(true)

        expect(ctx.drawImage).toHaveBeenCalledTimes(1)
        expect(ctx.drawImage).toHaveBeenCalledWith(expect.any(HTMLCanvasElement), 0, 0)
      })
    })

    describe('when the map has been panned by more than half of the canvas', () => {
      test('does not draw and returns false when panned horizontally', () => {
        const {
          ctx,
          granuleBackgroundsSource,
          map,
          view
        } = setup()

        // Half of the 1000px wide canvas is 500px
        view.panX = -501

        const result = drawGranuleOutlinesSnapshot({
          ctx,
          granuleBackgroundsSource,
          isMoving: true,
          map
        })

        expect(result).toEqual(false)
        expect(ctx.drawImage).toHaveBeenCalledTimes(0)
      })

      test('does not draw and returns false when panned vertically', () => {
        const {
          ctx,
          granuleBackgroundsSource,
          map,
          view
        } = setup()

        // Half of the 500px tall canvas is 250px
        view.panY = 251

        const result = drawGranuleOutlinesSnapshot({
          ctx,
          granuleBackgroundsSource,
          isMoving: true,
          map
        })

        expect(result).toEqual(false)
        expect(ctx.drawImage).toHaveBeenCalledTimes(0)
      })
    })
  })
})
