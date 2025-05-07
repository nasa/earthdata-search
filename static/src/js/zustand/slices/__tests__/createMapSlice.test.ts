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
