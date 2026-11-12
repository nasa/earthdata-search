import { Feature, Map } from 'ol'
import { MultiPoint, MultiPolygon } from 'ol/geom'
import { fromExtent } from 'ol/geom/Polygon'
import VectorSource from 'ol/source/Vector'

import drawGranuleOutlines from '../drawGranuleOutlines'
import drawOutline from '../drawOutline'
import {
  drawGranuleOutlinesSnapshot,
  saveGranuleOutlinesSnapshot
} from '../granuleOutlinesSnapshot'
import { granulePointStyle, granuleStyle } from '../styles'

import { getColorByIndex } from '../../colors'

vi.mock('../drawOutline', () => ({ default: vi.fn() }))

vi.mock('../granuleOutlinesSnapshot', () => ({
  drawGranuleOutlinesSnapshot: vi.fn(),
  saveGranuleOutlinesSnapshot: vi.fn()
}))

const setup = ({
  animating = false,
  interacting = false,
  snapshotDrawn = false
}: {
  /** If the map is animating, e.g. zooming with the mouse wheel */
  animating?: boolean
  /** If the user is interacting with the map, e.g. dragging it */
  interacting?: boolean
  /** If there is a snapshot of the granule outlines that can be drawn */
  snapshotDrawn?: boolean
} = {}) => {
  vi.mocked(drawGranuleOutlinesSnapshot).mockReturnValue(snapshotDrawn)

  // Keep a list of what was drawn on the canvas, in the order it was drawn. `operation` is
  // the value of globalCompositeOperation at the time.
  const drawn: { call: string, operation: string, strokeStyle?: string }[] = []

  const ctx = {
    beginPath: vi.fn(),
    canvas: {
      height: 500,
      width: 1000
    },
    fill: vi.fn(() => {
      drawn.push({
        call: 'fill',
        operation: ctx.globalCompositeOperation
      })
    }),
    globalCompositeOperation: 'source-over',
    reset: vi.fn(),
    stroke: vi.fn(() => {
      drawn.push({
        call: 'stroke',
        operation: ctx.globalCompositeOperation,
        strokeStyle: ctx.strokeStyle as string
      })
    })
  } as unknown as CanvasRenderingContext2D

  const map = {
    getSize: () => [1000, 500],
    getView: () => ({
      calculateExtent: () => [-180, -90, 180, 90],
      getAnimating: () => animating,
      getInteracting: () => interacting
    })
  } as unknown as Map

  // Add two polygon granules to the map. The granule with index 0 is on the top of the stack.
  const granuleBackgroundsSource = new VectorSource()
  granuleBackgroundsSource.addFeatures([0, 1].map((index) => {
    const feature = new Feature({
      geometry: new MultiPolygon([fromExtent([0, 0, 10, 10])])
    })
    feature.set('index', index)
    feature.set('granuleStyle', granuleStyle(index))

    return feature
  }))

  // Add a point granule to the bottom of the stack
  const pointFeature = new Feature({
    geometry: new MultiPoint([[5, 5]])
  })
  pointFeature.set('index', 2)
  pointFeature.set('granuleStyle', granulePointStyle(2))
  granuleBackgroundsSource.addFeature(pointFeature)

  drawGranuleOutlines({
    ctx,
    granuleBackgroundsSource,
    map
  })

  return {
    ctx,
    drawn,
    granuleBackgroundsSource,
    map
  }
}

describe('drawGranuleOutlines', () => {
  describe('when there is no snapshot that can be drawn', () => {
    test('draws the granule outlines from the bottom of the stack to the top', () => {
      const { ctx, drawn } = setup()

      expect(ctx.reset).toHaveBeenCalledTimes(1)
      expect(ctx.reset).toHaveBeenCalledWith()

      expect(drawOutline).toHaveBeenCalledTimes(3)

      expect(drawn).toEqual([
        // The point granule (index 2) is drawn first. It is not a polygon, so nothing is erased
        {
          call: 'stroke',
          operation: 'source-over',
          strokeStyle: getColorByIndex(2)
        },
        // The outlines below the second polygon granule (index 1) are erased from inside of
        // it, then its outline is drawn
        {
          call: 'fill',
          operation: 'destination-out'
        },
        {
          call: 'stroke',
          operation: 'source-over',
          strokeStyle: getColorByIndex(1)
        },
        // The same thing happens for the granule on the top of the stack (index 0)
        {
          call: 'fill',
          operation: 'destination-out'
        },
        {
          call: 'stroke',
          operation: 'source-over',
          strokeStyle: getColorByIndex(0)
        }
      ])
    })

    test('saves a snapshot of the granule outlines', () => {
      const { ctx, granuleBackgroundsSource, map } = setup()

      expect(drawGranuleOutlinesSnapshot).toHaveBeenCalledTimes(1)
      expect(drawGranuleOutlinesSnapshot).toHaveBeenCalledWith({
        ctx,
        granuleBackgroundsSource,
        isMoving: false,
        map
      })

      expect(saveGranuleOutlinesSnapshot).toHaveBeenCalledTimes(1)
      expect(saveGranuleOutlinesSnapshot).toHaveBeenCalledWith({
        ctx,
        granuleBackgroundsSource,
        map
      })
    })
  })

  describe('when there is a snapshot that can be drawn', () => {
    test('draws the snapshot instead of drawing the granule outlines', () => {
      const { ctx, granuleBackgroundsSource, map } = setup({
        snapshotDrawn: true
      })

      expect(ctx.reset).toHaveBeenCalledTimes(1)
      expect(ctx.reset).toHaveBeenCalledWith()

      expect(drawGranuleOutlinesSnapshot).toHaveBeenCalledTimes(1)
      expect(drawGranuleOutlinesSnapshot).toHaveBeenCalledWith({
        ctx,
        granuleBackgroundsSource,
        isMoving: false,
        map
      })

      expect(drawOutline).toHaveBeenCalledTimes(0)
      expect(ctx.fill).toHaveBeenCalledTimes(0)
      expect(ctx.stroke).toHaveBeenCalledTimes(0)
      expect(saveGranuleOutlinesSnapshot).toHaveBeenCalledTimes(0)
    })
  })

  describe('when the map is animating', () => {
    test('lets the snapshot know the map is moving', () => {
      const { ctx, granuleBackgroundsSource, map } = setup({
        animating: true,
        snapshotDrawn: true
      })

      expect(drawGranuleOutlinesSnapshot).toHaveBeenCalledTimes(1)
      expect(drawGranuleOutlinesSnapshot).toHaveBeenCalledWith({
        ctx,
        granuleBackgroundsSource,
        isMoving: true,
        map
      })
    })
  })

  describe('when the user is interacting with the map', () => {
    test('lets the snapshot know the map is moving', () => {
      const { ctx, granuleBackgroundsSource, map } = setup({
        interacting: true,
        snapshotDrawn: true
      })

      expect(drawGranuleOutlinesSnapshot).toHaveBeenCalledTimes(1)
      expect(drawGranuleOutlinesSnapshot).toHaveBeenCalledWith({
        ctx,
        granuleBackgroundsSource,
        isMoving: true,
        map
      })
    })
  })

  describe('when the map is undefined', () => {
    test('clears the canvas and does not draw anything', () => {
      const ctx = { reset: vi.fn() } as unknown as CanvasRenderingContext2D

      drawGranuleOutlines({
        ctx,
        granuleBackgroundsSource: new VectorSource(),
        map: undefined as unknown as Map
      })

      expect(ctx.reset).toHaveBeenCalledTimes(1)
      expect(ctx.reset).toHaveBeenCalledWith()

      expect(drawGranuleOutlinesSnapshot).toHaveBeenCalledTimes(0)
      expect(drawOutline).toHaveBeenCalledTimes(0)
      expect(saveGranuleOutlinesSnapshot).toHaveBeenCalledTimes(0)
    })
  })
})
