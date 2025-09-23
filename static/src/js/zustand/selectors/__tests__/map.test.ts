import { getFocusedCollectionMapLayers } from '../map'

import useEdscStore from '../../useEdscStore'

describe('map selectors', () => {
  describe('getFocusedCollectionMapLayers', () => {
    test('returns the map layers for the focused collection', () => {
      useEdscStore.setState(() => ({
        collection: {
          collectionId: 'collection1'
        },
        map: {
          mapLayers: {
            collection1: [
              {
                product: 'MODIS_Terra_Aerosol',
                title: 'MODIS Aerosol',
                format: 'image/png',
                layerPeriod: 'daily',
                antarctic_resolution: '1km',
                arctic_resolution: '1km',
                geographic_resolution: '1km',
                antarctic: true,
                arctic: true,
                geographic: true,
                isVisible: true,
                opacity: 1.0
              },
              {
                product: 'AIRS_Prata_SO2_Index_Day',
                title: 'AIRS SO2',
                format: 'image/png',
                layerPeriod: 'daily',
                antarctic_resolution: '2km',
                arctic_resolution: '2km',
                geographic_resolution: '2km',
                antarctic: true,
                arctic: true,
                geographic: true,
                isVisible: false,
                opacity: 0.8
              }
            ],
            collection2: [
              {
                product: 'VIIRS_SNPP_CorrectedReflectance_TrueColor',
                title: 'VIIRS True Color',
                format: 'image/png',
                layerPeriod: 'daily',
                antarctic_resolution: '500m',
                arctic_resolution: '500m',
                geographic_resolution: '500m',
                antarctic: true,
                arctic: true,
                geographic: true,
                isVisible: true,
                opacity: 1.0
              }
            ]
          }
        }
      }))

      const result = getFocusedCollectionMapLayers(useEdscStore.getState())
      expect(result).toEqual([
        {
          product: 'MODIS_Terra_Aerosol',
          title: 'MODIS Aerosol',
          format: 'image/png',
          layerPeriod: 'daily',
          antarctic_resolution: '1km',
          arctic_resolution: '1km',
          geographic_resolution: '1km',
          antarctic: true,
          arctic: true,
          geographic: true,
          isVisible: true,
          opacity: 1.0
        },
        {
          product: 'AIRS_Prata_SO2_Index_Day',
          title: 'AIRS SO2',
          format: 'image/png',
          layerPeriod: 'daily',
          antarctic_resolution: '2km',
          arctic_resolution: '2km',
          geographic_resolution: '2km',
          antarctic: true,
          arctic: true,
          geographic: true,
          isVisible: false,
          opacity: 0.8
        }
      ])
    })

    test('returns empty array when no collection is focused', () => {
      useEdscStore.setState(() => ({
        collection: {
          collectionId: ''
        },
        map: {
          mapLayers: {
            collection1: [
              {
                product: 'MODIS_Terra_Aerosol',
                title: 'MODIS Aerosol',
                format: 'image/png',
                layerPeriod: 'daily',
                antarctic_resolution: '1km',
                arctic_resolution: '1km',
                geographic_resolution: '1km',
                antarctic: true,
                arctic: true,
                geographic: true,
                isVisible: true,
                opacity: 1.0
              }
            ]
          }
        }
      }))

      const result = getFocusedCollectionMapLayers(useEdscStore.getState())
      expect(result).toEqual([])
    })

    test('returns empty array when focused collection has no map layers', () => {
      useEdscStore.setState(() => ({
        collection: {
          collectionId: 'collection3'
        },
        map: {
          mapLayers: {
            collection1: [
              {
                product: 'MODIS_Terra_Aerosol',
                title: 'MODIS Aerosol',
                format: 'image/png',
                layerPeriod: 'daily',
                antarctic_resolution: '1km',
                arctic_resolution: '1km',
                geographic_resolution: '1km',
                antarctic: true,
                arctic: true,
                geographic: true,
                isVisible: true,
                opacity: 1.0
              }
            ]
          }
        }
      }))

      const result = getFocusedCollectionMapLayers(useEdscStore.getState())
      expect(result).toEqual([])
    })

    test('returns empty array when mapLayers is empty', () => {
      useEdscStore.setState(() => ({
        collection: {
          collectionId: 'collection1'
        },
        map: {
          mapLayers: {}
        }
      }))

      const result = getFocusedCollectionMapLayers(useEdscStore.getState())
      expect(result).toEqual([])
    })
  })
})
