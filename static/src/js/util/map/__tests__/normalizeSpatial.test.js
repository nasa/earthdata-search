import normalizeSpatial, {
  getPolygonArea,
  squareMetersToSquareKilometers
} from '../normalizeSpatial'

// @ts-expect-error The file does not have types
import configureStore from '../../../store/configureStore'
// @ts-expect-error The file does not have types
import actions from '../../../actions'

jest.mock('../../../store/configureStore', () => jest.fn())

describe('normalizeSpatial', () => {
  describe('get polygon area', () => {
    test('returns the area of a polygon in square meters', () => {
      const polygonFeature = {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'MultiPolygon',
          coordinates: [
            [
              [
                [0, 0],
                [10, 0],
                [10, 10],
                [7.500144327690457, 10.02806255960527],
                [4.999999999999976, 10.037423045910712],
                [2.499855672309495, 10.028062559605273],
                [0, 10],
                [0, 0]
              ]
            ]
          ]
        }
      }
      const polygonArea = getPolygonArea(polygonFeature)
      expect(polygonArea).toEqual(1233014465748.1511)
    })
  })

  describe('squareMetersToSquareKilometers', () => {
    test('returns square kilometers from square meters input', () => {
      const areaSquareMeters = 1233014465748.1511
      const areaSquareKilometers = squareMetersToSquareKilometers(areaSquareMeters)
      expect(areaSquareKilometers).toEqual(1233014)
    })
  })

  describe('when the granule has no spatial information', () => {
    test('returns null', () => {
      const granule = {}

      const response = normalizeSpatial(granule)

      expect(response).toBeNull()
    })
  })

  describe('when the granule has a box', () => {
    test('returns a geojson multi polygon', () => {
      const granule = {
        boxes: ['0 1 10 11']
      }

      const response = normalizeSpatial(granule)

      expect(response).toEqual({
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'MultiPolygon',
          coordinates: [
            [
              [
                [1, 0],
                [3.5, 0],
                [6, 0],
                [8.5, 0],
                [11, 0],
                [11, 2.5],
                [11, 5],
                [11, 7.5],
                [11, 10],
                [8.5, 10],
                [6, 10],
                [3.5, 10],
                [1, 10],
                [1, 7.5],
                [1, 5],
                [1, 2.5],
                [1, 0]
              ]
            ]
          ]
        }
      })
    })

    describe('when the granule has multiple boxes', () => {
      test('returns a geojson multi polygon', () => {
        const granule = {
          boxes: ['0 1 10 11', '1 2 11 12']
        }

        const response = normalizeSpatial(granule)

        expect(response).toEqual({
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'MultiPolygon',
            coordinates: [
              [
                [
                  [1, 0],
                  [3.5, 0],
                  [6, 0],
                  [8.5, 0],
                  [11, 0],
                  [11, 2.5],
                  [11, 5],
                  [11, 7.5],
                  [11, 10],
                  [8.5, 10],
                  [6, 10],
                  [3.5, 10],
                  [1, 10],
                  [1, 7.5],
                  [1, 5],
                  [1, 2.5],
                  [1, 0]
                ]
              ],
              [
                [
                  [2, 1],
                  [4.5, 1],
                  [7, 1],
                  [9.5, 1],
                  [12, 1],
                  [12, 3.5],
                  [12, 6],
                  [12, 8.5],
                  [12, 11],
                  [9.5, 11],
                  [7, 11],
                  [4.5, 11],
                  [2, 11],
                  [2, 8.5],
                  [2, 6],
                  [2, 3.5],
                  [2, 1]
                ]
              ]
            ]
          }
        })
      })
    })
  })

  describe('when the granule has a line', () => {
    test('returns a geojson multi line string', () => {
      const granule = {
        lines: ['0 5 10 15']
      }

      const response = normalizeSpatial(granule)

      expect(response).toEqual({
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'MultiLineString',
          coordinates: [
            [
              [5, 0],
              [15, 10]
            ]
          ]
        }
      })
    })

    describe('when the granule has multiple lines', () => {
      test('returns a geojson multi line string', () => {
        const granule = {
          lines: ['0 5 10 15', '1 6 11 16']
        }

        const response = normalizeSpatial(granule)

        expect(response).toEqual({
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'MultiLineString',
            coordinates: [
              [
                [5, 0],
                [15, 10]
              ],
              [
                [6, 1],
                [16, 11]
              ]
            ]
          }
        })
      })
    })

    describe('when the line crosses the antimeridian', () => {
      test('returns a geojson multi line string', () => {
        const granule = {
          lines: ['1 170 2 175 3 -175 4 -170']
        }

        const response = normalizeSpatial(granule)

        expect(response).toEqual({
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'MultiLineString',
            coordinates: [
              [
                [170, 1],
                [175, 2],
                [180, 3]
              ],
              [
                [-180, 3],
                [-175, 3],
                [-170, 4]
              ]
            ]
          }
        })
      })
    })
  })

  describe('when the granule has a point', () => {
    test('returns a geojson multipoint', () => {
      const granule = {
        points: ['0 10']
      }

      const response = normalizeSpatial(granule)

      expect(response).toEqual({
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'MultiPoint',
          coordinates: [[10, 0]]
        }
      })
    })

    describe('when the granule has multiple points', () => {
      test('returns a geojson multipoint', () => {
        const granule = {
          points: ['0 10', '1 11']
        }

        const response = normalizeSpatial(granule)

        expect(response).toEqual({
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'MultiPoint',
            coordinates: [
              [10, 0],
              [11, 1]
            ]
          }
        })
      })
    })
  })

  describe('when the granule has a polygon', () => {
    test('returns a geojson multi polygon', () => {
      const granule = {
        polygons: [
          ['0 0 0 10 10 10 10 0 0 0']
        ]
      }

      const response = normalizeSpatial(granule)

      expect(response).toEqual({
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'MultiPolygon',
          coordinates: [
            [
              [
                [0, 0],
                [10, 0],
                [10, 1],
                [10, 2],
                [10, 4],
                [10, 5],
                [10, 6],
                [10, 7],
                [10, 8],
                [10, 10],
                [9.0001107738, 10.0134664917],
                [8.0001477653, 10.0239449438],
                [7.0001293364, 10.0314319717],
                [6.0000739209, 10.0359251563],
                [5, 10.0374230459],
                [3.9999260791, 10.0359251563],
                [2.9998706636, 10.0314319717],
                [1.9998522347, 10.0239449438],
                [0.9998892262, 10.0134664917],
                [0, 10],
                [0, 0]
              ]
            ]
          ]
        }
      })
    })

    describe('when the granule has multiple polygons', () => {
      test('returns a geojson multi polygon', () => {
        const granule = {
          polygons: [
            ['0 0 0 10 10 10 10 0 0 0'],
            ['0 0 0 5 5 5 5 0 0 0']
          ]
        }

        const response = normalizeSpatial(granule)

        expect(response).toEqual({
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'MultiPolygon',
            coordinates: [
              [
                [
                  [0, 0],
                  [10, 0],
                  [10, 1],
                  [10, 2],
                  [10, 4],
                  [10, 5],
                  [10, 6],
                  [10, 7],
                  [10, 8],
                  [10, 10],
                  [9.0001107738, 10.0134664917],
                  [8.0001477653, 10.0239449438],
                  [7.0001293364, 10.0314319717],
                  [6.0000739209, 10.0359251563],
                  [5, 10.0374230459],
                  [3.9999260791, 10.0359251563],
                  [2.9998706636, 10.0314319717],
                  [1.9998522347, 10.0239449438],
                  [0.9998892262, 10.0134664917],
                  [0, 10],
                  [0, 0]
                ]
              ],
              [
                [
                  [0, 0],
                  [5, 0],
                  [5, 5],
                  [0, 5],
                  [0, 0]
                ]
              ]
            ]
          }
        })
      })
    })

    describe('when the granule has a polygon with holes', () => {
      test('returns a geojson multi polygon', () => {
        const granule = {
          polygons: [
            [
              '0 0 0 10 10 10 10 0 0 0',
              '5 5 7 7 3 7 5 5'
            ]
          ]
        }

        const response = normalizeSpatial(granule)

        expect(response).toEqual({
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'MultiPolygon',
            coordinates: [
              [
                [
                  [0, 0],
                  [10, 0],
                  [10, 1],
                  [10, 2],
                  [10, 4],
                  [10, 5],
                  [10, 6],
                  [10, 7],
                  [10, 8],
                  [10, 10],
                  [9.0001107738, 10.0134664917],
                  [8.0001477653, 10.0239449438],
                  [7.0001293364, 10.0314319717],
                  [6.0000739209, 10.0359251563],
                  [5, 10.0374230459],
                  [3.9999260791, 10.0359251563],
                  [2.9998706636, 10.0314319717],
                  [1.9998522347, 10.0239449438],
                  [0.9998892262, 10.0134664917],
                  [0, 10],
                  [0, 0]
                ],
                [
                  [5, 5],
                  [7, 3],
                  [7, 7],
                  [5, 5]
                ]
              ]
            ]
          }
        })
      })
    })

    describe('when the polygon crosses the antimeridian', () => {
      test('returns a geojson multi polygon', () => {
        const granule = {
          polygons: [
            ['0 170 10 170 10 -170 0 -170 0 170']
          ]
        }

        const response = normalizeSpatial(granule)

        expect(response).toEqual({
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'MultiPolygon',
            coordinates: [
              [
                [
                  [180, 10.151081711],
                  [178.9996894944, 10.1495668552],
                  [177.9993979247, 10.1450227779],
                  [176.9991442019, 10.1374509502],
                  [175.9989471885, 10.1268538226],
                  [174.9988256733, 10.1132348243],
                  [173.9987983476, 10.0965983609],
                  [172.9988837807, 10.0769498121],
                  [171.9991003964, 10.054295529],
                  [170.999466449, 10.0286428307],
                  [170, 10],
                  [170, 0],
                  [180, 0],
                  [180, 10.151081711]
                ]
              ],
              [
                [
                  [-180, 0],
                  [-170, 0],
                  [-170, 10],
                  [-170.999466449, 10.0286428307],
                  [-171.9991003964, 10.054295529],
                  [-172.9988837807, 10.0769498121],
                  [-173.9987983476, 10.0965983609],
                  [-174.9988256733, 10.1132348243],
                  [-175.9989471885, 10.1268538226],
                  [-176.9991442019, 10.1374509502],
                  [-177.9993979247, 10.1450227779],
                  [-178.9996894944, 10.1495668552],
                  [-180, 10.151081711],
                  [-180, 0]
                ]
              ]
            ]
          }
        })
      })
    })

    describe('when the polygon crosses the antimeridian and the polygon hole also crosses the antimeridian', () => {
      test('returns a geojson multi polygon', () => {
        const granule = {
          polygons: [
            [
              '0 170 10 170 10 -170 0 -170 0 170',
              '3 175 4 175 2 -175 3 175'
            ]
          ]
        }

        const response = normalizeSpatial(granule)

        expect(response).toEqual({
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'MultiPolygon',
            coordinates: [
              [
                [
                  [180, 10.151081711],
                  [178.9996894944, 10.1495668552],
                  [177.9993979247, 10.1450227779],
                  [176.9991442019, 10.1374509502],
                  [175.9989471885, 10.1268538226],
                  [174.9988256733, 10.1132348243],
                  [173.9987983476, 10.0965983609],
                  [172.9988837807, 10.0769498121],
                  [171.9991003964, 10.054295529],
                  [170.999466449, 10.0286428307],
                  [170, 10],
                  [170, 0],
                  [180, 0],
                  [180, 10.151081711]
                ],
                [
                  [180, 3.0123568092],
                  [175, 4],
                  [175, 3],
                  [180, 2.5097286498],
                  [180, 3.0123568092]
                ]
              ],
              [
                [
                  [-180, 0],
                  [-170, 0],
                  [-170, 10],
                  [-170.999466449, 10.0286428307],
                  [-171.9991003964, 10.054295529],
                  [-172.9988837807, 10.0769498121],
                  [-173.9987983476, 10.0965983609],
                  [-174.9988256733, 10.1132348243],
                  [-175.9989471885, 10.1268538226],
                  [-176.9991442019, 10.1374509502],
                  [-177.9993979247, 10.1450227779],
                  [-178.9996894944, 10.1495668552],
                  [-180, 10.151081711],
                  [-180, 0]
                ],
                [
                  [-180, 2.5097286498],
                  [-175, 2],
                  [-180, 3.0123568092],
                  [-180, 2.5097286498]
                ]
              ]
            ]
          }
        })
      })
    })

    describe('when the polygon has points that can not be interpolated', () => {
      test('returns a geojson multi polygon of the original points and logs the error', () => {
        const handleErrorMock = jest.spyOn(actions, 'handleError').mockImplementation(() => {})
        const mockDispatch = jest.fn()
        configureStore.mockReturnValue({
          dispatch: mockDispatch,
          getState: () => ({})
        })

        const granule = {
          polygons: [
            ['-90 -180 -90 180 90 180 90 -180 -90 -180']
          ]
        }

        const response = normalizeSpatial(granule)

        expect(response).toEqual({
          geometry: {
            coordinates: [
              [
                [
                  [-180, -90],
                  [180, -90],
                  [180, 90],
                  [-180, 90],
                  [-180, -90]
                ]
              ]
            ],
            type: 'MultiPolygon'
          },
          properties: {},
          type: 'Feature'
        })

        expect(handleErrorMock).toHaveBeenCalledTimes(2)
        expect(handleErrorMock).toHaveBeenNthCalledWith(1, {
          action: 'interpolatePolygon',
          error: expect.any(Error),
          message: expect.stringContaining('Error interpolating points: start: 180,-90, end: 180,90. All coordiates: [{"lat":-90,"lng":-180},{"lat":-90,"lng":180},{"lat":90,"lng":180},{"lat":90,"lng":-180},{"lat":-90,"lng":-180}].'),
          notificationType: 'none'
        })

        expect(handleErrorMock).toHaveBeenNthCalledWith(2, {
          action: 'interpolatePolygon',
          error: expect.any(Error),
          message: expect.stringContaining('Error interpolating points: start: -180,90, end: -180,-90. All coordiates: [{"lat":-90,"lng":-180},{"lat":-90,"lng":180},{"lat":90,"lng":180},{"lat":90,"lng":-180},{"lat":-90,"lng":-180}].'),
          notificationType: 'none'
        })
      })
    })
  })
})
