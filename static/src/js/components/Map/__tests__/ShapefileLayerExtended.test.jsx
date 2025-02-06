import { ShapefileLayerExtended } from '../ShapefileLayerExtended'

describe('ShapefileLayerExtended', () => {
  describe('separateMultiPolygons', () => {
    test('should separate MultiPolygon features into individual Polygon features', () => {
      const layer = new ShapefileLayerExtended({})
      const geojson = {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            properties: { name: 'Region Name' },
            geometry: {
              type: 'MultiPolygon',
              coordinates: [
                [[[0, 0], [1, 1], [1, 0], [0, 0]]],
                [[[2, 2], [3, 3], [3, 2], [2, 2]]]
              ]
            }
          }
        ]
      }

      layer.separateMultiPolygons(geojson)

      expect(geojson.features.length).toBe(2)
      expect(geojson.features[0].geometry.type).toBe('Polygon')
      expect(geojson.features[0].geometry.coordinates).toEqual([[[0, 0], [1, 1], [1, 0], [0, 0]]])
      expect(geojson.features[0].properties).toEqual({ name: 'Region Name' })
      expect(geojson.features[1].geometry.type).toBe('Polygon')
      expect(geojson.features[1].geometry.coordinates).toEqual([[[2, 2], [3, 3], [3, 2], [2, 2]]])
      expect(geojson.features[1].properties).toEqual({ name: 'Region Name' })
    })

    test('should handle GeometryCollection with MultiPolygon features', () => {
      const layer = new ShapefileLayerExtended({})
      const geojson = {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            properties: { name: 'Region Name' },
            geometry: {
              type: 'GeometryCollection',
              geometries: [
                {
                  type: 'MultiPolygon',
                  coordinates: [
                    [[[0, 0], [1, 1], [1, 0], [0, 0]]],
                    [[[2, 2], [3, 3], [3, 2], [2, 2]]]
                  ]
                }
              ]
            }
          }
        ]
      }

      layer.separateMultiPolygons(geojson)

      expect(geojson.features.length).toBe(2)
      expect(geojson.features[0].geometry.type).toBe('Polygon')
      expect(geojson.features[0].geometry.coordinates).toEqual([[[0, 0], [1, 1], [1, 0], [0, 0]]])
      expect(geojson.features[0].properties).toEqual({ name: 'Region Name' })
      expect(geojson.features[1].geometry.type).toBe('Polygon')
      expect(geojson.features[1].geometry.coordinates).toEqual([[[2, 2], [3, 3], [3, 2], [2, 2]]])
      expect(geojson.features[1].properties).toEqual({ name: 'Region Name' })
    })

    test('should leave Polygon features unchanged', () => {
      const layer = new ShapefileLayerExtended({})
      const geojson = {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            properties: { name: 'Region Name' },
            geometry: {
              type: 'Polygon',
              coordinates: [[[0, 0], [1, 1], [1, 0], [0, 0]]]
            }
          }
        ]
      }

      layer.separateMultiPolygons(geojson)

      expect(geojson.features.length).toBe(1)
      expect(geojson.features[0].geometry.type).toBe('Polygon')
      expect(geojson.features[0].geometry.coordinates).toEqual([[[0, 0], [1, 1], [1, 0], [0, 0]]])
      expect(geojson.features[0].properties).toEqual({ name: 'Region Name' })
    })

    test('should add empty properties to geojson when input has no properties', () => {
      const layer = new ShapefileLayerExtended({})
      const geojson = {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            geometry: {
              type: 'MultiPolygon',
              coordinates: [
                [[[0, 0], [1, 1], [1, 0], [0, 0]]],
                [[[2, 2], [3, 3], [3, 2], [2, 2]]]
              ]
            }
          }
        ]
      }

      layer.separateMultiPolygons(geojson)

      expect(geojson.features.length).toBe(2)
      expect(geojson.features[0].properties).toEqual({ })
      expect(geojson.features[1].properties).toEqual({ })
    })
  })
})
