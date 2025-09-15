import { Feature } from 'ol'

import getQueryFromShapefileFeature from '../getQueryFromShapefileFeature'
import spatialTypes from '../../../constants/spatialTypes'

describe('getQueryFromShapefileFeature', () => {
  describe('when the feature is not supported', () => {
    test('return an empty object', () => {
      const mockFeature = {
        getGeometry: () => ({}),
        getProperties: () => ({
          geometryType: 'Unsupported',
          geographicCoordinates: [-77.0163, 38.883, 0],
          circleGeometry: null
        })
      } as unknown as Feature

      const result = getQueryFromShapefileFeature(mockFeature)

      expect(result).toEqual({})
    })
  })

  describe('when the feature is a Circle', () => {
    test('return the spatial as a query object', () => {
      const mockFeature = {
        getGeometry: () => ({}),
        getProperties: () => ({
          geometryType: spatialTypes.CIRCLE,
          geographicCoordinates: [-77.0163, 38.883, 0],
          circleGeometry: [
            [-77.0163, 38.883, 0],
            50000
          ]
        })
      } as unknown as Feature

      const result = getQueryFromShapefileFeature(mockFeature)

      expect(result).toEqual({
        circle: ['-77.0163,38.883,50000']
      })
    })
  })

  describe('when the feature is a Point', () => {
    test('return the spatial as a query object', () => {
      const mockFeature = {
        getGeometry: () => ({}),
        getProperties: () => ({
          geometryType: spatialTypes.POINT,
          geographicCoordinates: [-77.0163, 38.883, 0],
          circleGeometry: null
        })
      } as unknown as Feature

      const result = getQueryFromShapefileFeature(mockFeature)

      expect(result).toEqual({
        point: ['-77.0163,38.883']
      })
    })
  })

  describe('when the feature is a MultiPoint', () => {
    test('return the spatial as a query object', () => {
      const mockFeature = {
        getGeometry: () => ({}),
        getProperties: () => ({
          geometryType: spatialTypes.MULTI_POINT,
          geographicCoordinates: [
            [-109.6, 38.81, 0],
            [-109.55, 38.75, 0]
          ],
          circleGeometry: null
        })
      } as unknown as Feature

      const result = getQueryFromShapefileFeature(mockFeature)

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
      const mockFeature = {
        getGeometry: () => ({}),
        getProperties: () => ({
          geometryType: spatialTypes.LINE_STRING,
          geographicCoordinates: [
            [-106, 35, 0],
            [-105, 36, 0],
            [-94, 33, 0],
            [-95, 30, 0],
            [-93, 31, 0],
            [-92, 30, 0]
          ],
          circleGeometry: null
        })
      } as unknown as Feature

      const result = getQueryFromShapefileFeature(mockFeature)

      expect(result).toEqual({
        line: ['-106,35,-105,36,-94,33,-95,30,-93,31,-92,30']
      })
    })
  })

  describe('when the feature is a MultiLine', () => {
    test('return the spatial as a query object', () => {
      const mockFeature = {
        getGeometry: () => ({}),
        getProperties: () => ({
          geometryType: spatialTypes.MULTI_LINE_STRING,
          geographicCoordinates: [
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
          ],
          circleGeometry: null
        })
      } as unknown as Feature

      const result = getQueryFromShapefileFeature(mockFeature)

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
      const mockFeature = {
        getGeometry: () => ({}),
        getProperties: () => ({
          geometryType: spatialTypes.POLYGON,
          geographicCoordinates: [
            [
              [-77.0163, 38.883, 100],
              [-77.0164, 38.884, 101],
              [-77.0165, 38.885, 102],
              [-77.0163, 38.883, 100]
            ]
          ],
          circleGeometry: null
        })
      } as unknown as Feature

      const result = getQueryFromShapefileFeature(mockFeature)

      expect(result).toEqual({
        polygon: ['-77.0163,38.883,-77.0164,38.884,-77.0165,38.885,-77.0163,38.883']
      })
    })
  })

  describe('when the feature is a MultiPolygon', () => {
    test('return the spatial as a query object', () => {
      const mockFeature = {
        getGeometry: () => ({}),
        getProperties: () => ({
          geometryType: spatialTypes.MULTI_POLYGON,
          geographicCoordinates: [
            [
              [
                [-77.0163, 38.883, 100],
                [-77.0164, 38.884, 101],
                [-77.0165, 38.885, 102],
                [-77.0163, 38.883, 100]
              ]
            ],
            [
              [
                [-42.0163, 30.883, 200],
                [-42.0164, 30.884, 201],
                [-42.0165, 30.885, 202],
                [-42.0163, 30.883, 200]
              ]
            ]
          ],
          circleGeometry: null
        })
      } as unknown as Feature

      const result = getQueryFromShapefileFeature(mockFeature)

      expect(result).toEqual({
        polygon: [
          '-77.0163,38.883,-77.0164,38.884,-77.0165,38.885,-77.0163,38.883',
          '-42.0163,30.883,-42.0164,30.884,-42.0165,30.885,-42.0163,30.883'
        ]
      })
    })
  })
})
