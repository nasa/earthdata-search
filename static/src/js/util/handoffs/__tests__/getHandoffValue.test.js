import { getHandoffValue } from '../getHandoffValue'

describe('getHandoffValue', () => {
  describe('When the value is a conceptId', () => {
    test('returns the value', () => {
      const collectionMetadata = {
        conceptId: 'testId'
      }
      const collectionQuery = {}

      const handoffInput = {
        valueType: 'conceptId'
      }

      expect(getHandoffValue({
        collectionMetadata,
        collectionQuery,
        handoffInput
      })).toEqual('testId')
    })

    test('returns undefined when the value doesn\t exist', () => {
      const handoffInput = {
        valueType: 'conceptId'
      }

      expect(getHandoffValue({
        collectionMetadata: {},
        collectionQuery: {},
        handoffInput
      })).toEqual(undefined)
    })
  })

  describe('When the value is a bounding box', () => {
    test('returns the value', () => {
      const collectionQuery = {
        spatial: {
          boundingBox: ['-77.60234,37.00428,-75.15486,40.06987']
        }
      }

      const handoffInput = {
        valueType: 'https://schema.org/box'
      }

      expect(getHandoffValue({
        collectionQuery,
        handoffInput
      })).toEqual('-77.60234,37.00428,-75.15486,40.06987')
    })

    test('returns undefined when the value doesn\t exist', () => {
      const handoffInput = {
        valueType: 'https://schema.org/box'
      }

      expect(getHandoffValue({
        collectionMetadata: {},
        collectionQuery: {},
        handoffInput
      })).toEqual(undefined)
    })
  })

  describe('When the value is minx', () => {
    test('returns the value', () => {
      const collectionQuery = {
        spatial: {
          boundingBox: ['-77.60234,37.00428,-75.15486,40.06987']
        }
      }

      const handoffInput = {
        valueType: 'minx'
      }

      expect(getHandoffValue({
        collectionQuery,
        handoffInput
      })).toEqual(-77.60234)
    })

    test('returns undefined when the value doesn\t exist', () => {
      const handoffInput = {
        valueType: 'minx'
      }

      expect(getHandoffValue({
        collectionMetadata: {},
        collectionQuery: {},
        handoffInput
      })).toEqual(undefined)
    })
  })

  describe('When the value is miny', () => {
    test('returns the value', () => {
      const collectionQuery = {
        spatial: {
          boundingBox: ['-77.60234,37.00428,-75.15486,40.06987']
        }
      }

      const handoffInput = {
        valueType: 'miny'
      }

      expect(getHandoffValue({
        collectionQuery,
        handoffInput
      })).toEqual(37.00428)
    })

    test('returns undefined when the value doesn\t exist', () => {
      const handoffInput = {
        valueType: 'miny'
      }

      expect(getHandoffValue({
        collectionMetadata: {},
        collectionQuery: {},
        handoffInput
      })).toEqual(undefined)
    })
  })

  describe('When the value is maxx', () => {
    test('returns the value', () => {
      const collectionQuery = {
        spatial: {
          boundingBox: ['-77.60234,37.00428,-75.15486,40.06987']
        }
      }

      const handoffInput = {
        valueType: 'maxx'
      }

      expect(getHandoffValue({
        collectionQuery,
        handoffInput
      })).toEqual(-75.15486)
    })

    test('returns undefined when the value doesn\t exist', () => {
      const handoffInput = {
        valueType: 'maxx'
      }

      expect(getHandoffValue({
        collectionMetadata: {},
        collectionQuery: {},
        handoffInput
      })).toEqual(undefined)
    })
  })

  describe('When the value is maxy', () => {
    test('returns the value', () => {
      const collectionQuery = {
        spatial: {
          boundingBox: ['-77.60234,37.00428,-75.15486,40.06987']
        }
      }

      const handoffInput = {
        valueType: 'maxy'
      }

      expect(getHandoffValue({
        collectionQuery,
        handoffInput
      })).toEqual(40.06987)
    })

    test('returns undefined when the value doesn\t exist', () => {
      const handoffInput = {
        valueType: 'maxy'
      }

      expect(getHandoffValue({
        collectionMetadata: {},
        collectionQuery: {},
        handoffInput
      })).toEqual(undefined)
    })
  })

  describe('When the value is a start time', () => {
    test('returns the value', () => {
      const collectionQuery = {
        temporal: {
          startDate: '2021-07-22T00:55:39.384Z'
        }
      }

      const handoffInput = {
        valueType: 'https://schema.org/startDate'
      }

      expect(getHandoffValue({
        collectionQuery,
        handoffInput
      })).toEqual('2021-07-22T00:55:39.384Z')
    })

    test('returns undefined when the value doesn\t exist', () => {
      const handoffInput = {
        valueType: 'https://schema.org/startDate'
      }

      expect(getHandoffValue({
        collectionMetadata: {},
        collectionQuery: {},
        handoffInput
      })).toEqual(undefined)
    })
  })

  describe('When the value is a start date', () => {
    test('returns the value', () => {
      const collectionQuery = {
        temporal: {
          startDate: '2021-07-22T00:55:39.384Z'
        }
      }

      const handoffInput = {
        valueType: 'startDate'
      }

      expect(getHandoffValue({
        collectionQuery,
        handoffInput
      })).toEqual('2021-07-22')
    })

    test('returns undefined when the value doesn\t exist', () => {
      const handoffInput = {
        valueType: 'startDate'
      }

      expect(getHandoffValue({
        collectionMetadata: {},
        collectionQuery: {},
        handoffInput
      })).toEqual(undefined)
    })
  })

  describe('When the value is an end time', () => {
    test('returns the value', () => {
      const collectionQuery = {
        temporal: {
          endDate: '2021-07-22T00:55:39.384Z'
        }
      }

      const handoffInput = {
        valueType: 'https://schema.org/endDate'
      }

      expect(getHandoffValue({
        collectionQuery,
        handoffInput
      })).toEqual('2021-07-22T00:55:39.384Z')
    })

    test('returns undefined when the value doesn\t exist', () => {
      const handoffInput = {
        valueType: 'https://schema.org/endDate'
      }

      expect(getHandoffValue({
        collectionMetadata: {},
        collectionQuery: {},
        handoffInput
      })).toEqual(undefined)
    })
  })

  describe('When the value is an end date', () => {
    test('returns the value', () => {
      const collectionQuery = {
        temporal: {
          endDate: '2021-07-22T00:55:39.384Z'
        }
      }

      const handoffInput = {
        valueType: 'endDate'
      }

      expect(getHandoffValue({
        collectionQuery,
        handoffInput
      })).toEqual('2021-07-22')
    })

    test('returns undefined when the value doesn\t exist', () => {
      const handoffInput = {
        valueType: 'endDate'
      }

      expect(getHandoffValue({
        collectionMetadata: {},
        collectionQuery: {},
        handoffInput
      })).toEqual(undefined)
    })
  })

  describe('When the value is a layer', () => {
    test('returns the value', () => {
      const collectionMetadata = {
        tags: {
          'edsc.extra.serverless.gibs': {
            data: [
              {
                format: 'png',
                antarctic: false,
                geographic: true,
                group: 'overlays',
                geographic_resolution: '1km',
                arctic_resolution: null,
                source: 'Multi-mission / GHRSST',
                arctic: false,
                title: 'Sea Surface Temperature (L4, MUR)',
                updated_at: '2021-08-30T12:00:15.498Z',
                antarctic_resolution: null,
                product: 'GHRSST_L4_MUR_Sea_Surface_Temperature',
                match: {
                  time_start: '>=2002-06-01T00:00:00Z'
                },
                resolution: '1km'
              },
              {
                format: 'png',
                antarctic: false,
                geographic: true,
                group: 'overlays',
                geographic_resolution: '1km',
                arctic_resolution: null,
                source: 'Multi-mission / GHRSST',
                arctic: false,
                title: 'Sea Ice Concentration (L4, MUR)',
                updated_at: '2021-08-30T12:00:15.498Z',
                antarctic_resolution: null,
                product: 'GHRSST_L4_MUR_Sea_Ice_Concentration',
                match: {
                  time_start: '>=2002-06-01T00:00:00Z'
                },
                resolution: '1km'
              },
              {
                format: 'png',
                antarctic: false,
                geographic: true,
                group: 'overlays',
                geographic_resolution: '1km',
                arctic_resolution: null,
                source: 'Multi-mission / GHRSST',
                arctic: false,
                title: 'Sea Surface Temperature Anomalies (L4, MUR)',
                updated_at: '2021-08-30T12:00:15.498Z',
                antarctic_resolution: null,
                product: 'GHRSST_L4_MUR_Sea_Surface_Temperature_Anomalies',
                match: {
                  time_start: '>=2019-07-23T00:00:00Z'
                },
                resolution: '1km'
              }
            ]
          }
        }
      }

      const handoffs = {
        sotoLayers: ['GHRSST_L4_MUR_Sea_Surface_Temperature', 'GHRSST_L4_MUR_Sea_Surface_Temperature_Anomalies']
      }

      const handoffInput = {
        valueType: 'https://wiki.earthdata.nasa.gov/display/GIBS/GIBS+API+for+Developers#GIBSAPIforDevelopers-LayerNaming'
      }

      expect(getHandoffValue({
        collectionMetadata,
        collectionQuery: {},
        handoffInput,
        handoffs
      })).toEqual([
        'GHRSST_L4_MUR_Sea_Surface_Temperature(la=true)',
        'GHRSST_L4_MUR_Sea_Surface_Temperature_Anomalies(la=true)'
      ])
    })

    test('returns undefined when the value doesn\t exist', () => {
      const handoffs = {
        sotoLayers: []
      }
      const handoffInput = {
        valueType: 'https://wiki.earthdata.nasa.gov/display/GIBS/GIBS+API+for+Developers#GIBSAPIforDevelopers-LayerNaming'
      }

      expect(getHandoffValue({
        collectionMetadata: {},
        collectionQuery: {},
        handoffInput,
        handoffs
      })).toEqual(undefined)
    })
  })

  describe('When the value is a shortName', () => {
    test('returns the value', () => {
      const collectionMetadata = {
        shortName: 'Mock short name'
      }

      const handoffInput = {
        valueType: 'shortName'
      }

      expect(getHandoffValue({
        collectionMetadata,
        collectionQuery: {},
        handoffInput
      })).toEqual('Mock short name')
    })

    test('returns undefined when the value doesn\t exist', () => {
      const handoffInput = {
        valueType: 'shortName'
      }

      expect(getHandoffValue({
        collectionMetadata: {},
        collectionQuery: {},
        handoffInput
      })).toEqual(undefined)
    })
  })

  describe('When the value is a mapProjection', () => {
    test('returns geographic when the project is epsg4326', () => {
      const handoffInput = {
        valueType: 'mapProjection'
      }

      expect(getHandoffValue({
        collectionMetadata: {},
        collectionQuery: {},
        handoffInput,
        map: {
          projection: 'epsg4326'
        }
      })).toEqual('geographic')
    })

    test('returns arctic when the project is epsg3413', () => {
      const handoffInput = {
        valueType: 'mapProjection'
      }

      expect(getHandoffValue({
        collectionMetadata: {},
        collectionQuery: {},
        handoffInput,
        map: {
          projection: 'epsg3413'
        }
      })).toEqual('arctic')
    })

    test('returns antarctic when the project is epsg3031', () => {
      const handoffInput = {
        valueType: 'mapProjection'
      }

      expect(getHandoffValue({
        collectionMetadata: {},
        collectionQuery: {},
        handoffInput,
        map: {
          projection: 'epsg3031'
        }
      })).toEqual('antarctic')
    })

    test('returns geographic when the value doesn\t exist', () => {
      const handoffInput = {
        valueType: 'mapProjection'
      }

      expect(getHandoffValue({
        collectionMetadata: {},
        collectionQuery: {},
        handoffInput
      })).toEqual('geographic')
    })
  })

  describe('When the value is a mapProjection using epsg codes', () => {
    test('returns EPSG:4326 when the project is epsg4326', () => {
      const handoffInput = {
        valueType: 'https://spatialreference.org/ref/epsg/'
      }

      expect(getHandoffValue({
        collectionMetadata: {},
        collectionQuery: {},
        handoffInput,
        map: {
          projection: 'epsg4326'
        }
      })).toEqual('EPSG:4326')
    })

    test('returns EPSG:3413 when the project is epsg3413', () => {
      const handoffInput = {
        valueType: 'https://spatialreference.org/ref/epsg/'
      }

      expect(getHandoffValue({
        collectionMetadata: {},
        collectionQuery: {},
        handoffInput,
        map: {
          projection: 'epsg3413'
        }
      })).toEqual('EPSG:3413')
    })

    test('returns EPSG:3031 when the project is epsg3031', () => {
      const handoffInput = {
        valueType: 'https://spatialreference.org/ref/epsg/'
      }

      expect(getHandoffValue({
        collectionMetadata: {},
        collectionQuery: {},
        handoffInput,
        map: {
          projection: 'epsg3031'
        }
      })).toEqual('EPSG:3031')
    })

    test('returns EPSG:4326 when the value doesn\t exist', () => {
      const handoffInput = {
        valueType: 'https://spatialreference.org/ref/epsg/'
      }

      expect(getHandoffValue({
        collectionMetadata: {},
        collectionQuery: {},
        handoffInput
      })).toEqual('EPSG:4326')
    })
  })

  describe('When the value is a latitude', () => {
    test('returns the value', () => {
      const handoffInput = {
        valueType: 'https://schema.org/latitude'
      }

      expect(getHandoffValue({
        collectionMetadata: {},
        collectionQuery: {},
        handoffInput,
        map: {
          latitude: 0
        }
      })).toEqual(0)
    })

    test('returns undefined when the value doesn\t exist', () => {
      const handoffInput = {
        valueType: 'https://schema.org/latitude'
      }

      expect(getHandoffValue({
        collectionMetadata: {},
        collectionQuery: {},
        handoffInput
      })).toEqual(undefined)
    })
  })

  describe('When the value is a longitude', () => {
    test('returns the value', () => {
      const handoffInput = {
        valueType: 'https://schema.org/longitude'
      }

      expect(getHandoffValue({
        collectionMetadata: {},
        collectionQuery: {},
        handoffInput,
        map: {
          longitude: 0
        }
      })).toEqual(0)
    })

    test('returns undefined when the value doesn\t exist', () => {
      const handoffInput = {
        valueType: 'https://schema.org/longitude'
      }

      expect(getHandoffValue({
        collectionMetadata: {},
        collectionQuery: {},
        handoffInput
      })).toEqual(undefined)
    })
  })

  describe('When the value is a zoom', () => {
    test('returns the value', () => {
      const handoffInput = {
        valueType: 'zoom'
      }

      expect(getHandoffValue({
        collectionMetadata: {},
        collectionQuery: {},
        handoffInput,
        map: {
          zoom: 0
        }
      })).toEqual(0)
    })

    test('returns undefined when the value doesn\t exist', () => {
      const handoffInput = {
        valueType: 'zoom'
      }

      expect(getHandoffValue({
        collectionMetadata: {},
        collectionQuery: {},
        handoffInput
      })).toEqual(undefined)
    })
  })

  describe('When the value is a edscBaseLayer', () => {
    test('returns blueMarble', () => {
      const handoffInput = {
        valueType: 'edscBaseLayer'
      }

      expect(getHandoffValue({
        collectionMetadata: {},
        collectionQuery: {},
        handoffInput,
        map: {
          base: {
            blueMarble: true
          }
        }
      })).toEqual('blueMarble')
    })

    test('returns trueColor', () => {
      const handoffInput = {
        valueType: 'edscBaseLayer'
      }

      expect(getHandoffValue({
        collectionMetadata: {},
        collectionQuery: {},
        handoffInput,
        map: {
          base: {
            trueColor: true
          }
        }
      })).toEqual('trueColor')
    })

    test('returns landWaterMap', () => {
      const handoffInput = {
        valueType: 'edscBaseLayer'
      }

      expect(getHandoffValue({
        collectionMetadata: {},
        collectionQuery: {},
        handoffInput,
        map: {
          base: {
            landWaterMap: true
          }
        }
      })).toEqual('landWaterMap')
    })

    test('returns undefined when the value doesn\t exist', () => {
      const handoffInput = {
        valueType: 'edscBaseLayer'
      }

      expect(getHandoffValue({
        collectionMetadata: {},
        collectionQuery: {},
        handoffInput
      })).toEqual(undefined)
    })
  })

  describe('When the value is a edscOverlayLayers', () => {
    test('returns coastlines', () => {
      const handoffInput = {
        valueType: 'edscOverlayLayers'
      }

      expect(getHandoffValue({
        collectionMetadata: {},
        collectionQuery: {},
        handoffInput,
        map: {
          overlays: {
            coastlines: true
          }
        }
      })).toEqual('coastlines')
    })

    test('returns referenceFeatures', () => {
      const handoffInput = {
        valueType: 'edscOverlayLayers'
      }

      expect(getHandoffValue({
        collectionMetadata: {},
        collectionQuery: {},
        handoffInput,
        map: {
          overlays: {
            referenceFeatures: true
          }
        }
      })).toEqual('referenceFeatures')
    })

    test('returns referenceLabels', () => {
      const handoffInput = {
        valueType: 'edscOverlayLayers'
      }

      expect(getHandoffValue({
        collectionMetadata: {},
        collectionQuery: {},
        handoffInput,
        map: {
          overlays: {
            referenceLabels: true
          }
        }
      })).toEqual('referenceLabels')
    })

    test('returns multiple layers', () => {
      const handoffInput = {
        valueType: 'edscOverlayLayers'
      }

      expect(getHandoffValue({
        collectionMetadata: {},
        collectionQuery: {},
        handoffInput,
        map: {
          overlays: {
            coastlines: true,
            referenceFeatures: true,
            referenceLabels: true
          }
        }
      })).toEqual('coastlines,referenceFeatures,referenceLabels')
    })

    test('returns undefined when the value doesn\t exist', () => {
      const handoffInput = {
        valueType: 'edscOverlayLayers'
      }

      expect(getHandoffValue({
        collectionMetadata: {},
        collectionQuery: {},
        handoffInput
      })).toEqual(undefined)
    })
  })

  describe('When the value is a edscTextQuery', () => {
    test('returns the value', () => {
      const handoffInput = {
        valueType: 'edscTextQuery'
      }

      expect(getHandoffValue({
        collectionMetadata: {},
        collectionQuery: {
          keyword: 'mock keyword'
        },
        handoffInput,
        map: {}
      })).toEqual('mock keyword')
    })

    test('returns undefined when the value doesn\t exist', () => {
      const handoffInput = {
        valueType: 'edscTextQuery'
      }

      expect(getHandoffValue({
        collectionMetadata: {},
        collectionQuery: {},
        handoffInput
      })).toEqual(undefined)
    })
  })
})
