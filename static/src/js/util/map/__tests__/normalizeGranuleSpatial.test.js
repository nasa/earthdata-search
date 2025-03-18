import normalizeGranuleSpatial from '../normalizeGranuleSpatial'

describe('normalizeGranuleSpatial', () => {
  describe('when the granule has no spatial information', () => {
    test('returns null', () => {
      const granule = {}

      const response = normalizeGranuleSpatial(granule)

      expect(response).toBeNull()
    })
  })

  describe('when the granule has a box', () => {
    test('returns a geojson multi polygon', () => {
      const granule = {
        boxes: ['0 1 10 11']
      }

      const response = normalizeGranuleSpatial(granule)

      expect(response).toEqual({
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'MultiPolygon',
          coordinates: [
            [
              [
                [1, 0],
                [1, 2.5],
                [1, 5],
                [1, 7.5],
                [1, 10],
                [3.5, 10],
                [6, 10],
                [8.5, 10],
                [11, 10],
                [11, 7.5],
                [11, 5],
                [11, 2.5],
                [11, 0],
                [8.5, 0],
                [6, 0],
                [3.5, 0],
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

        const response = normalizeGranuleSpatial(granule)

        expect(response).toEqual({
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'MultiPolygon',
            coordinates: [
              [
                [
                  [1, 0],
                  [1, 2.5],
                  [1, 5],
                  [1, 7.5],
                  [1, 10],
                  [3.5, 10],
                  [6, 10],
                  [8.5, 10],
                  [11, 10],
                  [11, 7.5],
                  [11, 5],
                  [11, 2.5],
                  [11, 0],
                  [8.5, 0],
                  [6, 0],
                  [3.5, 0],
                  [1, 0]
                ]
              ],
              [
                [
                  [2, 1],
                  [2, 3.5],
                  [2, 6],
                  [2, 8.5],
                  [2, 11],
                  [4.5, 11],
                  [7, 11],
                  [9.5, 11],
                  [12, 11],
                  [12, 8.5],
                  [12, 6],
                  [12, 3.5],
                  [12, 1],
                  [9.5, 1],
                  [7, 1],
                  [4.5, 1],
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

      const response = normalizeGranuleSpatial(granule)

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

        const response = normalizeGranuleSpatial(granule)

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

        const response = normalizeGranuleSpatial(granule)

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

      const response = normalizeGranuleSpatial(granule)

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

        const response = normalizeGranuleSpatial(granule)

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

      const response = normalizeGranuleSpatial(granule)

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

        const response = normalizeGranuleSpatial(granule)

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
                  [10, 10],
                  [7.500144327690457, 10.02806255960527],
                  [4.999999999999976, 10.037423045910712],
                  [2.499855672309495, 10.028062559605273],
                  [0, 10],
                  [0, 0]
                ]
              ],
              [
                [
                  [0, 0],
                  [5, 0],
                  [5, 5],
                  [2.5000000000000027, 5.004739244608396],
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

        const response = normalizeGranuleSpatial(granule)

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
                  [10, 10],
                  [7.500144327690457, 10.02806255960527],
                  [4.999999999999976, 10.037423045910712],
                  [2.499855672309495, 10.028062559605273],
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

        const response = normalizeGranuleSpatial(granule)

        expect(response).toEqual({
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'MultiPolygon',
            coordinates: [
              [
                [
                  [180, 10.15108171104812],
                  [177.49926515208145, 10.141615202612158],
                  [174.99882567334598, 10.113234824310313],
                  [172.49897454560028, 10.065997952552072],
                  [170, 10],
                  [170, 0],
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
                  [-172.49897454560036, 10.065997952552076],
                  [-174.99882567334606, 10.113234824310316],
                  [-177.49926515208156, 10.141615202612163],
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

        const response = normalizeGranuleSpatial(granule)

        expect(response).toEqual({
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'MultiPolygon',
            coordinates: [
              [
                [
                  [180, 10.15108171104812],
                  [177.49926515208145, 10.141615202612158],
                  [174.99882567334598, 10.113234824310313],
                  [172.49897454560028, 10.065997952552072],
                  [170, 10],
                  [170, 0],
                  [170, 0],
                  [180, 0],
                  [180, 10.15108171104812]
                ],
                [
                  [180, 3.0123568091770365],
                  [177.50132107630438, 3.5095103431534436],
                  [175, 4],
                  [175, 3],
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
                  [-172.49897454560036, 10.065997952552076],
                  [-174.99882567334606, 10.113234824310316],
                  [-177.49926515208156, 10.141615202612163],
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
