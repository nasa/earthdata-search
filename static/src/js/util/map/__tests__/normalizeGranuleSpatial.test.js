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
        boxes: ['0 0 10 10']
      }

      const response = normalizeGranuleSpatial(granule)

      expect(response).toEqual({
        type: 'Feature',
        geometry: {
          type: 'MultiPolygon',
          coordinates: [
            [
              [
                [0, 0],
                [10, 0],
                [10, 10],
                [0, 10],
                [0, 0]
              ]
            ]
          ]
        }
      })
    })

    describe('when the box crosses the antimeridian', () => {
      test('returns a geojson multi polygon', () => {
        const granule = {
          boxes: ['0 170 10 -170']
        }

        const response = normalizeGranuleSpatial(granule)

        expect(response).toEqual({
          type: 'Feature',
          geometry: {
            type: 'MultiPolygon',
            coordinates: [
              [
                [
                  [180, 10.15108171104812],
                  [170, 10],
                  [170, 0],
                  [170, 0],
                  [180, 0]
                ],
                [
                  [-180, 0],
                  [-170, 0],
                  [-170, 10],
                  [-180, 10.15108171104812]
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
        lines: ['0 0 10 10']
      }

      const response = normalizeGranuleSpatial(granule)

      expect(response).toEqual({
        type: 'Feature',
        geometry: {
          type: 'MultiLineString',
          coordinates: [
            [
              [0, 0],
              [10, 10]
            ]
          ]
        }
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
    test('returns a geojson point', () => {
      const granule = {
        points: ['0 10']
      }

      const response = normalizeGranuleSpatial(granule)

      expect(response).toEqual({
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [10, 0]
        }
      })
    })
  })

  describe('when the granule has a polygon', () => {
    test('returns a geojson multi polygon', () => {
      const granule = {
        polygons: [['0 0 0 10 10 10 10 0 0 0']]
      }

      const response = normalizeGranuleSpatial(granule)

      expect(response).toEqual({
        type: 'Feature',
        geometry: {
          type: 'MultiPolygon',
          coordinates: [
            [
              [
                [0, 0],
                [10.000000000000012, 6.092193914545939e-16],
                [10, 0],
                [10, 10.000000000000012],
                [10, 10],
                [7.500144327690457, 10.02806255960527],
                [4.999999999999976, 10.037423045910712],
                [2.499855672309495, 10.028062559605273],
                [-4.929859756268451e-14, 10],
                [0, 10],
                [1.2184387829091878e-15, -1.2722218725854067e-14]
              ]
            ]
          ]
        }
      })
    })

    describe('when the polygon crosses the antimeridian', () => {
      test('returns a geojson multi polygon', () => {
        const granule = {
          polygons: [['0 170 10 170 10 -170 0 -170 0 170']]
        }

        const response = normalizeGranuleSpatial(granule)

        expect(response).toEqual({
          type: 'Feature',
          geometry: {
            type: 'MultiPolygon',
            coordinates: [
              [
                [
                  [180, 10.151081711048118],
                  [177.49926515208145, 10.141615202612158],
                  [174.99882567334598, 10.113234824310313],
                  [172.49897454560028, 10.065997952552072],
                  [169.9999999999999, 9.999999999999996],
                  [170, 10],
                  [170, -1.2722218725854067e-14],
                  [170, 0],
                  [170, 0],
                  [170, 0],
                  [180.00000000000003, 6.092193914545939e-16]
                ]
              ],
              [
                [
                  [-180, 0],
                  [-170, 6.092193914545939e-16],
                  [-170, 0],
                  [-170, 10.000000000000012],
                  [-170, 10],
                  [-172.49897454560036, 10.065997952552076],
                  [-174.99882567334606, 10.113234824310316],
                  [-177.49926515208156, 10.141615202612163],
                  [-180.0000000000001, 10.151081711048121]
                ]
              ]
            ]
          }
        })
      })
    })
  })
})
