import projectionCodes from '../../../constants/projectionCodes'
import useEdscStore from '../../useEdscStore'

describe('createMapSlice', () => {
  test('sets the default state', () => {
    const zustandState = useEdscStore.getState()
    const { map } = zustandState

    expect(map).toEqual({
      mapView: {
        base: {
          worldImagery: true,
          trueColor: false,
          landWaterMap: false
        },
        latitude: 0,
        longitude: 0,
        overlays: {
          bordersRoads: true,
          coastlines: false,
          placeLabels: true
        },
        projection: projectionCodes.geographic,
        rotation: 0,
        zoom: 3
      },
      setMapView: expect.any(Function),
      mapLayers: {},
      setMapLayers: expect.any(Function),
      toggleLayerVisibility: expect.any(Function),
      setMapLayersOrder: expect.any(Function),
      updateLayerOpacity: expect.any(Function),
      showMbr: false,
      setShowMbr: expect.any(Function)
    })
  })

  describe('setMapView', () => {
    test('updates mapView', () => {
      const zustandState = useEdscStore.getState()
      const { map } = zustandState
      const { mapView: originalMapView, setMapView } = map
      const newMapView = {
        latitude: 10,
        longitude: 20,
        zoom: 5
      }

      setMapView(newMapView)

      const updatedState = useEdscStore.getState()
      const { map: updatedMap } = updatedState
      expect(updatedMap.mapView).toEqual({
        ...originalMapView,
        ...newMapView
      })
    })
  })

  describe('setMapLayers', () => {
    test('sets map layers with first layer visible by default', () => {
      const zustandState = useEdscStore.getState()
      const { map } = zustandState
      const { setMapLayers } = map

      const layers = [
        {
          product: 'AIRS_Prata_SO2_Index_Day',
          title: 'AIRS SO2'
        },
        {
          product: 'MODIS_Terra_Aerosol',
          title: 'MODIS Aerosol'
        },
        {
          product: 'VIIRS_SNPP_CorrectedReflectance_TrueColor',
          title: 'VIIRS True Color'
        }
      ]

      setMapLayers('collection-1', layers)

      const updatedState = useEdscStore.getState()
      const { map: updatedMap } = updatedState

      expect(updatedMap.mapLayers['collection-1']).toEqual([
        {
          product: 'AIRS_Prata_SO2_Index_Day',
          title: 'AIRS SO2',
          isVisible: true,
          opacity: 1.0
        },
        {
          product: 'MODIS_Terra_Aerosol',
          title: 'MODIS Aerosol',
          isVisible: false,
          opacity: 1.0
        },
        {
          product: 'VIIRS_SNPP_CorrectedReflectance_TrueColor',
          title: 'VIIRS True Color',
          isVisible: false,
          opacity: 1.0
        }
      ])
    })
  })

  describe('toggleLayerVisibility', () => {
    test('toggles layer visibility', () => {
      const zustandState = useEdscStore.getState()
      const { map } = zustandState
      const { setMapLayers, toggleLayerVisibility } = map

      // First set up some layers
      const layers = [
        {
          product: 'AIRS_Prata_SO2_Index_Day',
          title: 'AIRS SO2'
        },
        {
          product: 'MODIS_Terra_Aerosol',
          title: 'MODIS Aerosol'
        }
      ]
      setMapLayers('collection-1', layers)

      // Toggle the second layer
      toggleLayerVisibility('collection-1', 'MODIS_Terra_Aerosol')

      const updatedState = useEdscStore.getState()
      const { map: updatedMap } = updatedState
      const collectionLayers = updatedMap.mapLayers['collection-1']

      expect(collectionLayers[0].isVisible).toBe(true) // First layer should still be visible
      expect(collectionLayers[1].isVisible).toBe(true) // Second layer should now be visible
    })
  })

  describe('updateLayerOpacity', () => {
    test('updates layer opacity', () => {
      const zustandState = useEdscStore.getState()
      const { map } = zustandState
      const { setMapLayers, updateLayerOpacity } = map

      // First set up some layers
      const layers = [
        {
          product: 'AIRS_Prata_SO2_Index_Day',
          title: 'AIRS SO2'
        }
      ]
      setMapLayers('collection-1', layers)

      // Update opacity
      updateLayerOpacity('collection-1', 'AIRS_Prata_SO2_Index_Day', 0.5)

      const updatedState = useEdscStore.getState()
      const { map: updatedMap } = updatedState
      const collectionLayers = updatedMap.mapLayers['collection-1']

      expect(collectionLayers[0].opacity).toBe(0.5)
    })
  })

  describe('setMapLayersOrder', () => {
    test('reorders map layers', () => {
      const zustandState = useEdscStore.getState()
      const { map } = zustandState
      const { setMapLayers, setMapLayersOrder } = map

      // First set up some layers
      const layers = [
        {
          product: 'AIRS_Prata_SO2_Index_Day',
          title: 'AIRS SO2'
        },
        {
          product: 'MODIS_Terra_Aerosol',
          title: 'MODIS Aerosol'
        }
      ]
      setMapLayers('collection-1', layers)

      // Reorder layers
      const newOrder = [
        {
          product: 'MODIS_Terra_Aerosol',
          title: 'MODIS Aerosol',
          isVisible: false,
          opacity: 1.0
        },
        {
          product: 'AIRS_Prata_SO2_Index_Day',
          title: 'AIRS SO2',
          isVisible: true,
          opacity: 1.0
        }
      ]
      setMapLayersOrder('collection-1', newOrder)

      const updatedState = useEdscStore.getState()
      const { map: updatedMap } = updatedState

      expect(updatedMap.mapLayers['collection-1']).toEqual(newOrder)
    })
  })

  describe('setShowMbr', () => {
    test('updates showMbr', () => {
      const zustandState = useEdscStore.getState()
      const { map } = zustandState
      const { setShowMbr } = map
      setShowMbr(true)

      const updatedState = useEdscStore.getState()
      const { map: updatedMap } = updatedState
      expect(updatedMap.showMbr).toBe(true)
    })
  })
})
