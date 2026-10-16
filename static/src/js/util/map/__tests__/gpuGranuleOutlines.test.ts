import { Map } from 'ol'
import Feature from 'ol/Feature'
import { MultiPolygon } from 'ol/geom'
import VectorSource from 'ol/source/Vector'
import {
  Fill,
  Stroke,
  Style
} from 'ol/style'

import drawGpuGranuleOutlines, {
  fillTriangles,
  geometryMesh,
  strokeTriangles
} from '../gpuGranuleOutlines'

const exterior = [[0, 0], [10, 0], [10, 10], [0, 10], [0, 0]]
const hole = [[2, 2], [2, 8], [8, 8], [8, 2], [2, 2]]

const triangleArea = (vertices: number[]) => {
  let area = 0
  for (let i = 0; i < vertices.length; i += 6) {
    const [ax, ay, bx, by, cx, cy] = vertices.slice(i, i + 6)
    area += Math.abs((bx - ax) * (cy - ay) - (by - ay) * (cx - ax)) / 2
  }

  return area
}

const setup = ({
  count = 12,
  projection = 'EPSG:4326',
  strokeColor = 'rgb(255, 255, 255)'
} = {}) => {
  const source = new VectorSource()
  source.addFeatures(Array.from({ length: count }, (_, index) => {
    const feature = new Feature(new MultiPolygon([[exterior.map(([x, y]) => [x + index * 20, y])]]))
    feature.set('index', index)
    feature.set('granuleStyle', new Style({
      fill: new Fill({ color: 'transparent' }),
      stroke: new Stroke({
        color: strokeColor,
        width: 1
      })
    }))

    return feature
  }))

  const map = {
    getView: () => ({
      getProjection: () => ({ getCode: () => projection }),
      calculateExtent: () => [-1000, -1000, 1000, 1000]
    }),
    getSize: () => [100, 100]
  } as unknown as Map

  const canvas = document.createElement('canvas')
  canvas.width = 100
  canvas.height = 100
  document.body.appendChild(canvas)

  return drawGpuGranuleOutlines({
    ctx: { canvas } as unknown as CanvasRenderingContext2D,
    map,
    granuleBackgroundsSource: source,
    matrix: [1, 0, 0, -1, 50, 50]
  })
}

describe('gpuGranuleOutlines', () => {
  describe('fillTriangles', () => {
    test('preserves holes and disjoint polygon area', () => {
      const second = exterior.map(([x, y]) => [x + 20, y])
      const geometry = new MultiPolygon([[exterior, hole], [second]])

      expect(triangleArea(fillTriangles(geometry))).toBeCloseTo(164, 10)
    })
  })

  describe('geometryMesh', () => {
    test('rebuilds the cached stroke and fill mesh when the geometry changes in place', () => {
      const geometry = new MultiPolygon([[exterior]])
      const before = geometryMesh(geometry)

      expect(geometryMesh(geometry)).toBe(before)

      geometry.setCoordinates([[exterior, hole]])
      const after = geometryMesh(geometry)

      expect(after).not.toBe(before)
      expect(after.strokeCount).toBeGreaterThan(before.strokeCount)
      expect(after.fillCount).toBeGreaterThan(before.fillCount)
      expect(triangleArea(fillTriangles(geometry))).toBeCloseTo(64, 10)
    })
  })

  describe('strokeTriangles', () => {
    test('preserves miter corners and ignores duplicate ring vertices', () => {
      const ring = exterior as [number, number][]
      const triangles = strokeTriangles(ring, 2)

      expect(strokeTriangles([ring[0], ...ring], 2)).toEqual(triangles)

      const xs = triangles.filter((_, i) => i % 2 === 0)
      const ys = triangles.filter((_, i) => i % 2 === 1)

      expect([Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys)])
        .toEqual([-1, 11, -1, 11])

      expect(triangles.every(Number.isFinite)).toBe(true)
    })

    test('uses finite bevels past the Canvas miter limit', () => {
      const triangles = strokeTriangles([[0, 0], [100, 0], [0, 0.001], [0, 0]], 2)

      expect(triangles.every(Number.isFinite)).toBe(true)
      expect(Math.max(...triangles.filter((_, i) => i % 2 === 0))).toBeLessThan(110)
    })

    test('returns no triangles for degenerate rings', () => {
      expect(strokeTriangles([[0, 0], [0, 0], [0, 0]], 2)).toEqual([])
    })
  })

  describe('drawGpuGranuleOutlines', () => {
    afterEach(() => {
      document.body.innerHTML = ''
    })

    test('falls back outside the geographic projection', () => {
      expect(setup({ projection: 'EPSG:3413' })).toBe(false)
    })

    test('falls back when few granules are visible', () => {
      expect(setup({ count: 9 })).toBe(false)
    })

    test('falls back for translucent strokes', () => {
      expect(setup({ strokeColor: 'rgba(255, 255, 255, 0.5)' })).toBe(false)
    })

    test('falls back when WebGL2 is unavailable', () => {
      vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(null)

      expect(setup()).toBe(false)
    })
  })
})
