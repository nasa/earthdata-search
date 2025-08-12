import { Feature } from 'ol'
import { Point } from 'ol/geom'
import getQueryFromShapefileFeature from '../getQueryFromShapefileFeature'
import spatialTypes from '../../../constants/spatialTypes'

describe('getQueryFromShapefileFeature', () => {
  test('removes altitude from coordinates with altitude', () => {
    // Create a mock feature where geographicCoordinates[0][0] has 3 values (lon, lat, alt)
    // This structure should trigger the altitude removal condition
    const mockFeature = {
      getGeometry: () => ({}),
      getProperties: () => ({
        geometryType: spatialTypes.POLYGON,
        geographicCoordinates: [
          [
            [-77.0163, 38.883, 100], // This coordinate has altitude - should trigger removal
            [-77.0164, 38.884, 101],
            [-77.0165, 38.885, 102],
            [-77.0163, 38.883, 100]
          ]
        ],
        circleGeometry: null
      })
    } as unknown as Feature

    const result = getQueryFromShapefileFeature(mockFeature)

    // The result should have altitude removed (only lon,lat)
    expect(result).toEqual({
      polygon: ['-77.0163,38.883,-77.0164,38.884,-77.0165,38.885,-77.0163,38.883']
    })
  })

  test('removes altitude from deeply nested MultiPolygon structure', () => {
    // Create a deeply nested structure that will trigger recursive calls
    // and eventually hit the simple coordinate case (line 32)
    const mockFeature = {
      getGeometry: () => ({}),
      getProperties: () => ({
        geometryType: spatialTypes.MULTI_POLYGON,
        geographicCoordinates: [
          // First polygon
          [
            [
              [-77.0163, 38.883, 100], // This will eventually hit line 32 via recursion
              [-77.0164, 38.884, 101],
              [-77.0165, 38.885, 102],
              [-77.0163, 38.883, 100]
            ]
          ],
          // Second polygon - this additional level should trigger more recursion
          [
            [
              [-76.0163, 37.883, 200],
              [-76.0164, 37.884, 201], 
              [-76.0165, 37.885, 202],
              [-76.0163, 37.883, 200]
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
        '-76.0163,37.883,-76.0164,37.884,-76.0165,37.885,-76.0163,37.883'
      ]
    })
  })
})