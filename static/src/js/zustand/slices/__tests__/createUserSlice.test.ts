import { remove } from 'tiny-cookie'

import { collectionSortKeys } from '../../../constants/collectionSortKeys'
import projectionCodes from '../../../constants/projectionCodes'
import mapLayers from '../../../constants/mapLayers'

import useEdscStore from '../../useEdscStore'
import { initialSitePreferences } from '../createUserSlice'

import type { PreferencesData } from '../../types'
import { localStorageKeys } from '../../../constants/localStorageKeys'

jest.mock('tiny-cookie', () => ({
  remove: jest.fn()
}))

describe('createUserSlice', () => {
  test('sets the default state', () => {
    const zustandState = useEdscStore.getState()
    const { user } = zustandState

    expect(user).toEqual({
      edlToken: null,
      sitePreferences: initialSitePreferences,
      username: null,
      ursProfile: null,
      logout: expect.any(Function),
      setEdlToken: expect.any(Function),
      setSitePreferences: expect.any(Function),
      setUsername: expect.any(Function),
      setUrsProfile: expect.any(Function)
    })
  })

  describe('logout', () => {
    const originalWindowLocation = window.location

    beforeEach(() => {
      Object.defineProperty(window, 'location', {
        configurable: true,
        enumerable: true,
        value: {
          assign: jest.fn()
        }
      })
    })

    afterEach(() => {
      Object.defineProperty(window, 'location', {
        configurable: true,
        enumerable: true,
        value: originalWindowLocation
      })
    })

    test('clears the user state and redirects the user', () => {
      const localStorageRemoveItemSpy = jest.spyOn(Storage.prototype, 'removeItem')

      const { logout } = useEdscStore.getState().user

      logout()

      const { user } = useEdscStore.getState()

      expect(user.edlToken).toBeNull()
      expect(user.username).toBeNull()
      expect(user.ursProfile).toBeNull()

      expect(remove).toHaveBeenCalledTimes(1)
      expect(remove).toHaveBeenCalledWith('edlToken')

      expect(localStorageRemoveItemSpy).toHaveBeenCalledTimes(1)
      expect(localStorageRemoveItemSpy).toHaveBeenCalledWith(localStorageKeys.user)

      expect(window.location.assign).toHaveBeenCalledTimes(1)
      expect(window.location.assign).toHaveBeenCalledWith('/search?ee=prod')
    })
  })

  describe('setEdlToken', () => {
    describe('when a token is provided', () => {
      test('sets the edlToken in state', () => {
        const { setEdlToken } = useEdscStore.getState().user

        const mockToken = 'mocked_token'

        setEdlToken(mockToken)

        const { user } = useEdscStore.getState()

        expect(user.edlToken).toEqual(mockToken)
      })
    })

    describe('when no token is provided', () => {
      test('sets the edlToken in state to null', () => {
        const { setEdlToken } = useEdscStore.getState().user

        setEdlToken(null)

        const { user } = useEdscStore.getState()

        expect(user.edlToken).toBeNull()
      })
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

  describe('setUrsProfile', () => {
    test('sets the ursProfile in state', () => {
      const { setUrsProfile } = useEdscStore.getState().user

      const mockProfile = {
        emailAddress: 'test@example.com',
        firstName: 'Test',
        lastName: 'User'
      }

      setUrsProfile(mockProfile)

      const { ursProfile } = useEdscStore.getState().user
      expect(ursProfile).toEqual(mockProfile)
    })
  })
})
