import { SpatialCoordinates } from '../../../types/sharedTypes'
import removeAltitudeFromSpatial from '../removeAltitudeFromSpatial'

describe('removeAltitudeFromSpatial', () => {
  describe('when the spatial is a Point', () => {
    test('removes altitude from coordinates', () => {
      const spatial = [42.1875, -2.40647, 0]

      const result = removeAltitudeFromSpatial(spatial as SpatialCoordinates)

      expect(result).toEqual([42.1875, -2.40647])
    })
  })

  describe('when the spatial is a MultiPoint', () => {
    test('removes altitude from coordinates', () => {
      const spatial = [
        [-109.6, 38.81, 0],
        [-109.55, 38.75, 0]
      ]

      const result = removeAltitudeFromSpatial(spatial as SpatialCoordinates)

      expect(result).toEqual([
        [-109.6, 38.81],
        [-109.55, 38.75]
      ])
    })
  })

  describe('when the spatial is a LineString', () => {
    test('removes altitude from coordinates', () => {
      const spatial = [
        [-106, 35, 0],
        [-105, 36, 0],
        [-94, 33, 0],
        [-95, 30, 0],
        [-93, 31, 0],
        [-92, 30, 0]
      ]

      const result = removeAltitudeFromSpatial(spatial as SpatialCoordinates)

      expect(result).toEqual([
        [-106, 35],
        [-105, 36],
        [-94, 33],
        [-95, 30],
        [-93, 31],
        [-92, 30]
      ])
    })
  })

  describe('when the spatial is a MultiLineString', () => {
    test('removes altitude from coordinates', () => {
      const spatial = [
        [
          [-109.6, 38.81, 0],
          [-109.62, 38.83, 0],
          [-109.64, 38.85, 0]
        ],
        [
          [-109.55, 38.75, 0],
          [-109.57, 38.77, 0],
          [-109.59, 38.79, 0]
        ]
      ]

      const result = removeAltitudeFromSpatial(spatial as SpatialCoordinates)

      expect(result).toEqual([
        [
          [-109.6, 38.81],
          [-109.62, 38.83],
          [-109.64, 38.85]
        ],
        [
          [-109.55, 38.75],
          [-109.57, 38.77],
          [-109.59, 38.79]
        ]
      ])
    })
  })

  describe('when the spatial is a Polygon', () => {
    test('removes altitude from coordinates', () => {
      const spatial = [
        [
          [42.1875, -2.40647, 0],
          [42.1875, -16.46517, 0],
          [56.25, -16.46517, 0],
          [42.1875, -2.40647, 0]
        ]
      ]

      const result = removeAltitudeFromSpatial(spatial as SpatialCoordinates)

      expect(result).toEqual([
        [
          [42.1875, -2.40647],
          [42.1875, -16.46517],
          [56.25, -16.46517],
          [42.1875, -2.40647]
        ]
      ])
    })
  })

  describe('when the spatial is a MultiPolygon', () => {
    test('removes altitude from coordinates', () => {
      const spatial = [
        [
          [
            [-109.6, 38.81, 0],
            [-109.62, 38.81, 0],
            [-109.62, 38.83, 0],
            [-109.6, 38.83, 0],
            [-109.6, 38.81, 0]
          ]
        ],
        [
          [
            [-109.55, 38.75, 0],
            [-109.57, 38.75, 0],
            [-109.57, 38.77, 0],
            [-109.55, 38.77, 0],
            [-109.55, 38.75, 0]
          ]
        ]
      ]

      const result = removeAltitudeFromSpatial(spatial as SpatialCoordinates)

      expect(result).toEqual([
        [
          [
            [-109.6, 38.81],
            [-109.62, 38.81],
            [-109.62, 38.83],
            [-109.6, 38.83],
            [-109.6, 38.81]
          ]
        ],
        [
          [
            [-109.55, 38.75],
            [-109.57, 38.75],
            [-109.57, 38.77],
            [-109.55, 38.77],
            [-109.55, 38.75]
          ]
        ]
      ])
    })
  })
})
