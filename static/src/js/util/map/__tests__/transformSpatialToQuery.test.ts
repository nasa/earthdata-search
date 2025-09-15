import transformSpatialToQuery from '../transformSpatialToQuery'
import spatialTypes from '../../../constants/spatialTypes'

describe('transformSpatialToQuery', () => {
  describe('when the feature is not supported', () => {
    test('return an empty object', () => {
      const result = transformSpatialToQuery(
        'Unsupported',
        [-77.0163, 38.883]
      )

      expect(result).toEqual({})
    })
  })

  describe('when the feature is a Circle', () => {
    test('return the spatial as a query object', () => {
      const result = transformSpatialToQuery(
        spatialTypes.CIRCLE,
        [-77.0163, 38.883],
        [
          [-77.0163, 38.883, 0],
          50000
        ]
      )

      expect(result).toEqual({
        circle: ['-77.0163,38.883,50000']
      })
    })
  })

  describe('when the feature is a Point', () => {
    test('return the spatial as a query object', () => {
      const result = transformSpatialToQuery(
        spatialTypes.POINT,
        [-77.0163, 38.883]
      )

      expect(result).toEqual({
        point: ['-77.0163,38.883']
      })
    })
  })

  describe('when the feature is a MultiPoint', () => {
    test('return the spatial as a query object', () => {
      const result = transformSpatialToQuery(
        spatialTypes.MULTI_POINT,
        [
          [-109.6, 38.81],
          [-109.55, 38.75]
        ]
      )

      expect(result).toEqual({
        point: [
          '-109.6,38.81',
          '-109.55,38.75'
        ]
      })
    })
  })

  describe('when the feature is a Line', () => {
    test('return the spatial as a query object', () => {
      const result = transformSpatialToQuery(
        spatialTypes.LINE_STRING,
        [
          [-106, 35],
          [-105, 36],
          [-94, 33],
          [-95, 30],
          [-93, 31],
          [-92, 30]
        ]
      )

      expect(result).toEqual({
        line: ['-106,35,-105,36,-94,33,-95,30,-93,31,-92,30']
      })
    })
  })

  describe('when the feature is a MultiLine', () => {
    test('return the spatial as a query object', () => {
      const result = transformSpatialToQuery(
        spatialTypes.MULTI_LINE_STRING,
        [
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
        ]
      )

      expect(result).toEqual({
        line: [
          '-109.6,38.81,-109.62,38.83,-109.64,38.85',
          '-109.55,38.75,-109.57,38.77,-109.59,38.79'
        ]
      })
    })
  })

  describe('when the feature is a Polygon', () => {
    test('return the spatial as a query object', () => {
      const result = transformSpatialToQuery(
        spatialTypes.POLYGON,
        [
          [
            [-77.0163, 38.883],
            [-77.0164, 38.884],
            [-77.0165, 38.885],
            [-77.0163, 38.883]
          ]
        ]
      )

      expect(result).toEqual({
        polygon: ['-77.0163,38.883,-77.0164,38.884,-77.0165,38.885,-77.0163,38.883']
      })
    })
  })

  describe('when the feature is a MultiPolygon', () => {
    test('return the spatial as a query object', () => {
      const result = transformSpatialToQuery(
        spatialTypes.MULTI_POLYGON,
        [
          [
            [
              [-77.0163, 38.883],
              [-77.0164, 38.884],
              [-77.0165, 38.885],
              [-77.0163, 38.883]
            ]
          ],
          [
            [
              [-42.0163, 30.883],
              [-42.0164, 30.884],
              [-42.0165, 30.885],
              [-42.0163, 30.883]
            ]
          ]
        ]
      )

      expect(result).toEqual({
        polygon: [
          '-77.0163,38.883,-77.0164,38.884,-77.0165,38.885,-77.0163,38.883',
          '-42.0163,30.883,-42.0164,30.884,-42.0165,30.885,-42.0163,30.883'
        ]
      })
    })
  })
})
