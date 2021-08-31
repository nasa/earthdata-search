import { getHandoffValue } from '../getHandoffValue'

describe('getHandoffValue', () => {
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

    test('returns an empty string when the value doesn\t exist', () => {
      const handoffInput = {
        valueType: 'https://schema.org/box'
      }

      expect(getHandoffValue({
        collectionMetadata: {},
        collectionQuery: {},
        handoffInput
      })).toEqual('')
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
        valueType: 'https://schema.org/startDate'
      }

      expect(getHandoffValue({
        collectionQuery,
        handoffInput
      })).toEqual('2021-07-22T00:55:39.384Z')
    })

    test('returns an empty string when the value doesn\t exist', () => {
      const handoffInput = {
        valueType: 'https://schema.org/startDate'
      }

      expect(getHandoffValue({
        collectionMetadata: {},
        collectionQuery: {},
        handoffInput
      })).toEqual('')
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
        valueType: 'https://schema.org/endDate'
      }

      expect(getHandoffValue({
        collectionQuery,
        handoffInput
      })).toEqual('2021-07-22T00:55:39.384Z')
    })

    test('returns an empty string when the value doesn\t exist', () => {
      const handoffInput = {
        valueType: 'https://schema.org/endDate'
      }

      expect(getHandoffValue({
        collectionMetadata: {},
        collectionQuery: {},
        handoffInput
      })).toEqual('')
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

      const handoffInput = {
        valueType: 'https://wiki.earthdata.nasa.gov/display/GIBS/GIBS+API+for+Developers#GIBSAPIforDevelopers-LayerNaming'
      }

      expect(getHandoffValue({
        collectionMetadata,
        collectionQuery: {},
        handoffInput
      })).toEqual('GHRSST_L4_MUR_Sea_Surface_Temperature,GHRSST_L4_MUR_Sea_Ice_Concentration,GHRSST_L4_MUR_Sea_Surface_Temperature_Anomalies')
    })

    test('returns an empty string when the value doesn\t exist', () => {
      const handoffInput = {
        valueType: 'https://wiki.earthdata.nasa.gov/display/GIBS/GIBS+API+for+Developers#GIBSAPIforDevelopers-LayerNaming'
      }

      expect(getHandoffValue({
        collectionMetadata: {},
        collectionQuery: {},
        handoffInput
      })).toEqual('')
    })
  })

  describe('When the value is a dataKeyword', () => {
    test('returns the value', () => {
      const collectionMetadata = {
        shortName: 'Mock short name'
      }

      const handoffInput = {
        valueType: 'dataKeyword'
      }

      expect(getHandoffValue({
        collectionMetadata,
        collectionQuery: {},
        handoffInput
      })).toEqual('Mock short name')
    })

    test('returns an empty string when the value doesn\t exist', () => {
      const handoffInput = {
        valueType: 'dataKeyword'
      }

      expect(getHandoffValue({
        collectionMetadata: {},
        collectionQuery: {},
        handoffInput
      })).toEqual('')
    })
  })
})
