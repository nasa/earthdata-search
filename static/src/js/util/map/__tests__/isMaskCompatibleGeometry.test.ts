import { MultiPolygon, MultiPoint } from 'ol/geom'

import isMaskCompatibleGeometry from '../isMaskCompatibleGeometry'

const exterior = [[-10, -10], [10, -10], [10, 10], [-10, 10], [-10, -10]]
const hole = [[-2, -2], [-2, 2], [2, 2], [2, -2], [-2, -2]]

describe('isMaskCompatibleGeometry', () => {
  describe('when the polygon is normalized', () => {
    test('returns true with a hole', () => {
      expect(isMaskCompatibleGeometry(new MultiPolygon([[exterior, hole]]))).toBe(true)
    })

    test('returns true for disjoint parts', () => {
      const second = exterior.map(([x, y]) => [x + 30, y])

      expect(isMaskCompatibleGeometry(new MultiPolygon([[exterior], [second]]))).toBe(true)
    })
  })

  describe('when the polygon is not normalized', () => {
    test('returns false for a clockwise exterior', () => {
      expect(isMaskCompatibleGeometry(new MultiPolygon([[[...exterior].reverse()]]))).toBe(false)
    })

    test('returns false for a counterclockwise hole', () => {
      const reversedHole = [...hole].reverse()

      expect(isMaskCompatibleGeometry(new MultiPolygon([[exterior, reversedHole]]))).toBe(false)
    })

    test('returns false for overlapping polygon parts', () => {
      expect(isMaskCompatibleGeometry(new MultiPolygon([[exterior], [exterior]]))).toBe(false)
    })

    test('returns false for a hole outside its exterior', () => {
      const outsideHole = hole.map(([x, y]) => [x + 30, y])

      expect(isMaskCompatibleGeometry(new MultiPolygon([[exterior, outsideHole]]))).toBe(false)
    })

    test('returns false for self-intersecting rings', () => {
      const bowtie = [[0, 0], [10, 10], [0, 10], [10, 0], [0, 0]]

      expect(isMaskCompatibleGeometry(new MultiPolygon([[bowtie]]))).toBe(false)
    })

    test('returns false when a hole crosses a concave exterior', () => {
      const concave = [[0, 0], [10, 0], [10, 10], [7, 10], [7, 3],
        [3, 3], [3, 10], [0, 10], [0, 0]]
      const crossingHole = [[1, 6], [1, 8], [9, 8], [9, 6], [1, 6]]

      expect(isMaskCompatibleGeometry(new MultiPolygon([[concave, crossingHole]]))).toBe(false)
    })
  })

  describe('when the geometry is unsupported', () => {
    test('returns false for points and malformed polygons', () => {
      expect(isMaskCompatibleGeometry(new MultiPoint([[0, 0]]))).toBe(false)
      expect(isMaskCompatibleGeometry(new MultiPolygon([[[[0, 0], [1, 1]]]]))).toBe(false)
    })

    test('returns false for geometries above the vertex budget', () => {
      const dense = Array.from({ length: 1100 }, (_, index) => {
        const angle = (index / 1100) * 2 * Math.PI

        return [Math.cos(angle), Math.sin(angle)]
      })
      const ring = [...dense, dense[0]]

      expect(isMaskCompatibleGeometry(new MultiPolygon([[ring]]))).toBe(false)
    })
  })

  describe('when the geometry changes in place', () => {
    test('invalidates the cached result', () => {
      const geometry = new MultiPolygon([[exterior]])

      expect(isMaskCompatibleGeometry(geometry)).toBe(true)

      geometry.setCoordinates([[[...exterior].reverse()]])

      expect(isMaskCompatibleGeometry(geometry)).toBe(false)
    })
  })
})
