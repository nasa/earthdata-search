import { collectionSortKeys } from '../../../constants/collectionSortKeys'
import projectionCodes from '../../../constants/projectionCodes'
import mapLayers from '../../../constants/mapLayers'

import useEdscStore from '../../useEdscStore'
import { initialSitePreferences } from '../createUserSlice'

import type { PreferencesData } from '../../types'

describe('createUserSlice', () => {
  test('sets the default state', () => {
    const zustandState = useEdscStore.getState()
    const { user } = zustandState

    expect(user).toEqual({
      username: undefined,
      sitePreferences: initialSitePreferences,
      setSitePreferences: expect.any(Function),
      setUsername: expect.any(Function)
    })
  })

  describe('setSitePreferences', () => {
    test('sets the sitePreferences in state', () => {
      const { setSitePreferences } = useEdscStore.getState().user

      const newPreferences = {
        ...initialSitePreferences,
        panelState: 'open'
      }

      setSitePreferences(newPreferences as PreferencesData)

      const { sitePreferences } = useEdscStore.getState().user

      expect(sitePreferences).toEqual(newPreferences)
    })

    describe('when the collectionSort value has been set', () => {
      test('sets the query sortKey in state', () => {
        const { setSitePreferences } = useEdscStore.getState().user

        const newPreferences = {
          ...initialSitePreferences,
          collectionSort: collectionSortKeys.recentVersion
        }

        setSitePreferences(newPreferences as PreferencesData)

        const { query, user } = useEdscStore.getState()

        expect(user.sitePreferences.collectionSort).toBe(collectionSortKeys.recentVersion)

        expect(query.collection.sortKey).toBe(collectionSortKeys.recentVersion)
      })
    })

    describe('when mapView preferences have been set', () => {
      test('updates the map slice if the current map view matches the initial state', () => {
        useEdscStore.setState((state) => {
          state.map.setMapView = jest.fn()
        })

        const { setSitePreferences } = useEdscStore.getState().user

        const newMapView = {
          zoom: 5,
          latitude: 39.5,
          longitude: -98.35,
          projection: projectionCodes.geographic,
          baseLayer: mapLayers.trueColor,
          overlayLayers: [mapLayers.coastlines],
          rotation: 0
        }

        const newPreferences = {
          ...initialSitePreferences,
          mapView: newMapView
        }

        setSitePreferences(newPreferences as PreferencesData)

        const { map } = useEdscStore.getState()

        expect(map.setMapView).toHaveBeenCalledTimes(1)
        expect(map.setMapView).toHaveBeenCalledWith({
          base: {
            landWaterMap: false,
            trueColor: true,
            worldImagery: false
          },
          latitude: 39.5,
          longitude: -98.35,
          overlays: {
            bordersRoads: false,
            coastlines: true,
            placeLabels: false
          },
          projection: 'epsg4326',
          zoom: 5
        })
      })

      test('does not update the map slice if the current map view has been changed', () => {
        useEdscStore.setState((state) => {
          state.map.setMapView = jest.fn()
          state.map.mapView = {
            zoom: 8,
            latitude: 40,
            longitude: -90,
            projection: projectionCodes.geographic,
            base: {
              worldImagery: true,
              trueColor: false,
              landWaterMap: false
            },
            overlays: {
              bordersRoads: false,
              coastlines: false,
              placeLabels: false
            },
            rotation: 0
          }
        })

        const { setSitePreferences } = useEdscStore.getState().user

        const newMapView = {
          zoom: 5,
          latitude: 39.5,
          longitude: -98.35,
          projection: projectionCodes.geographic,
          baseLayer: mapLayers.trueColor,
          overlayLayers: [mapLayers.coastlines],
          rotation: 0
        }

        const newPreferences = {
          ...initialSitePreferences,
          mapView: newMapView
        }

        setSitePreferences(newPreferences as PreferencesData)

        const { map } = useEdscStore.getState()

        expect(map.setMapView).toHaveBeenCalledTimes(0)
      })
    })
  })

  describe('setUsername', () => {
    test('sets the username in state', () => {
      const { setUsername } = useEdscStore.getState().user

      setUsername('test_user')

      const { username } = useEdscStore.getState().user
      expect(username).toBe('test_user')
    })
  })
})
