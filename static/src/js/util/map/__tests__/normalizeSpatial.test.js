import normalizeSpatial, {
  getPolygonArea,
  squareMetersToSquareKilometers
} from '../normalizeSpatial'

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
                [9.999999999999998, 2],
                [9.999999999999998, 4],
                [10, 5],
                [9.999999999999998, 6],
                [9.999999999999998, 7],
                [10, 8],
                [10, 10],
                [9.000110773799255, 10.013466491669565],
                [8.000147765273205, 10.023944943799453],
                [7.000129336429673, 10.031431971672442],
                [6.000073920872426, 10.035925156338871],
                [5, 10.037423045910714],
                [3.9999260791275715, 10.035925156338871],
                [2.9998706635703245, 10.031431971672442],
                [1.9998522347267933, 10.023944943799453],
                [0.9998892262007445, 10.013466491669565],
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
                  [9.999999999999998, 2],
                  [9.999999999999998, 4],
                  [10, 5],
                  [9.999999999999998, 6],
                  [9.999999999999998, 7],
                  [10, 8],
                  [10, 10],
                  [9.000110773799255, 10.013466491669565],
                  [8.000147765273205, 10.023944943799453],
                  [7.000129336429673, 10.031431971672442],
                  [6.000073920872426, 10.035925156338871],
                  [5, 10.037423045910714],
                  [3.9999260791275715, 10.035925156338871],
                  [2.9998706635703245, 10.031431971672442],
                  [1.9998522347267933, 10.023944943799453],
                  [0.9998892262007445, 10.013466491669565],
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
                  [9.999999999999998, 2],
                  [9.999999999999998, 4],
                  [10, 5],
                  [9.999999999999998, 6],
                  [9.999999999999998, 7],
                  [10, 8],
                  [10, 10],
                  [9.000110773799255, 10.013466491669565],
                  [8.000147765273205, 10.023944943799453],
                  [7.000129336429673, 10.031431971672442],
                  [6.000073920872426, 10.035925156338871],
                  [5, 10.037423045910714],
                  [3.9999260791275715, 10.035925156338871],
                  [2.9998706635703245, 10.031431971672442],
                  [1.9998522347267933, 10.023944943799453],
                  [0.9998892262007445, 10.013466491669565],
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
                  [180, 10.15108171104812],
                  [178.99968949443453, 10.149566855159124],
                  [177.99939792465378, 10.145022777887437],
                  [176.99914420192633, 10.137450950153768],
                  [175.99894718852823, 10.126853822609],
                  [174.998825673346, 10.113234824310315],
                  [173.99879834759815, 10.096598360870885],
                  [172.99888378071475, 10.076949812086204],
                  [171.9991003964133, 10.054295529041028],
                  [170.9994664490095, 10.028642830701777],
                  [170, 10],
                  [170, 0],
                  [180, 0],
                  [180, 10.15108171104812]
                ]
              ],
              [
                [
                  [-180, 0],
                  [-170, 0],
                  [-170, 10],
                  [-170.9994664490095, 10.028642830701777],
                  [-171.9991003964133, 10.054295529041028],
                  [-172.99888378071475, 10.076949812086205],
                  [-173.99879834759815, 10.096598360870889],
                  [-174.998825673346, 10.113234824310315],
                  [-175.99894718852823, 10.126853822608998],
                  [-176.99914420192633, 10.13745095015377],
                  [-177.99939792465378, 10.145022777887437],
                  [-178.99968949443453, 10.149566855159124],
                  [-180, 10.15108171104812],
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
                  [180, 10.15108171104812],
                  [178.99968949443453, 10.149566855159124],
                  [177.99939792465378, 10.145022777887437],
                  [176.99914420192633, 10.137450950153768],
                  [175.99894718852823, 10.126853822609],
                  [174.998825673346, 10.113234824310315],
                  [173.99879834759815, 10.096598360870885],
                  [172.99888378071475, 10.076949812086204],
                  [171.9991003964133, 10.054295529041028],
                  [170.9994664490095, 10.028642830701777],
                  [170, 10],
                  [170, 0],
                  [180, 0],
                  [180, 10.15108171104812]
                ],
                [
                  [180, 3.0123568091770365],
                  [175, 4],
                  [175, 3],
                  [180, 2.509728649780264],
                  [180, 3.0123568091770365]
                ]
              ],
              [
                [
                  [-180, 0],
                  [-170, 0],
                  [-170, 10],
                  [-170.9994664490095, 10.028642830701777],
                  [-171.9991003964133, 10.054295529041028],
                  [-172.99888378071475, 10.076949812086205],
                  [-173.99879834759815, 10.096598360870889],
                  [-174.998825673346, 10.113234824310315],
                  [-175.99894718852823, 10.126853822608998],
                  [-176.99914420192633, 10.13745095015377],
                  [-177.99939792465378, 10.145022777887437],
                  [-178.99968949443453, 10.149566855159124],
                  [-180, 10.15108171104812],
                  [-180, 0]
                ],
                [
                  [-180, 2.509728649780264],
                  [-175, 2],
                  [-180, 3.0123568091770365],
                  [-180, 2.509728649780264]
                ]
              ]
            ]
          }
        })
      })
    })
  })
})
