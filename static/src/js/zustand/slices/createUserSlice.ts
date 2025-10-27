import { isEmpty, isEqual } from 'lodash-es'
import { remove } from 'tiny-cookie'
// @ts-expect-error The file does not have types
import jwt from 'jsonwebtoken'

import type {
  ImmerStateCreator,
  PreferencesData,
  UserSlice,
  BaseLayer,
  OverlayLayer
} from '../types'
import type { ProjectionCode } from '../../types/sharedTypes'

import projectionCodes from '../../constants/projectionCodes'
import mapLayers from '../../constants/mapLayers'

import { initialMapView } from './createMapSlice'

import { getEarthdataEnvironment } from '../selectors/earthdataEnvironment'

import { localStorageKeys } from '../../constants/localStorageKeys'

type JwtTokenPayload = {
  edlToken: string
}

export const initialSitePreferences: PreferencesData = {
  panelState: 'default',
  collectionListView: 'default',
  granuleListView: 'default',
  collectionSort: 'default',
  granuleSort: 'default',
  mapView: {
    zoom: 3,
    latitude: 0,
    baseLayer: mapLayers.worldImagery as BaseLayer,
    longitude: 0,
    projection: projectionCodes.geographic,
    overlayLayers: [
      mapLayers.bordersRoads as OverlayLayer,
      mapLayers.placeLabels as OverlayLayer
    ],
    rotation: 0
  }
}

const createUserSlice: ImmerStateCreator<UserSlice> = (set, get) => ({
  user: {
    authToken: null,
    edlToken: null,
    sitePreferences: initialSitePreferences,
    username: null,
    ursProfile: null,

    logout: () => {
      const zustandState = get()
      const earthdataEnvironment = getEarthdataEnvironment(zustandState)

      // Remove the auth cookie
      remove('authToken')

      set((state) => {
        state.user.authToken = null
        state.user.edlToken = null
        state.user.username = null
        state.user.ursProfile = null
      })

      // Clear the user information from local storage
      localStorage.removeItem(localStorageKeys.user)

      // Redirect to root url
      window.location.assign(`/search?ee=${earthdataEnvironment}`)
    },

    setAuthToken: (authToken) => {
      let edlToken = null

      if (authToken) {
        const decoded = jwt.decode(authToken) as JwtTokenPayload
        ({ edlToken } = decoded)
      }

      set((state) => {
        state.user.edlToken = edlToken
        state.user.authToken = authToken
      })
    },

    setSitePreferences: (sitePreferences) => {
      const {
        collectionSort,
        mapView: preferencesMapView = {}
      } = sitePreferences

      set((state) => {
        state.user.sitePreferences = sitePreferences

        // If there is a collectionSort preference, update the query slice
        if (collectionSort !== 'default') state.query.collection.sortKey = collectionSort
      })

      // If there are mapView preferences, update the map slice
      if (!isEmpty(preferencesMapView)) {
        const zustandState = get()
        const { map: currentMap } = zustandState
        const { mapView, setMapView } = currentMap

        // If the current map view is still the initial state, update it with the preferences
        if (isEqual(mapView, initialMapView)) {
          const {
            baseLayer,
            latitude,
            longitude,
            overlayLayers,
            projection,
            zoom
          } = preferencesMapView as PreferencesData['mapView']

          const base = {
            worldImagery: false,
            trueColor: false,
            landWaterMap: false,
            [baseLayer]: true
          }

          const overlays = {
            bordersRoads: false,
            coastlines: false,
            placeLabels: false
          }

          overlayLayers.forEach((layer: string) => {
            if (Object.prototype.hasOwnProperty.call(overlays, layer)) {
              (overlays as Record<string, boolean>)[layer] = true
            }
          })

          setMapView({
            base,
            latitude,
            longitude,
            overlays,
            projection: projection as ProjectionCode,
            zoom
          })
        }
      }
    },

    setUsername: (username) => {
      set((state) => {
        state.user.username = username
      })
    },

    setUrsProfile: (ursProfile) => {
      set((state) => {
        state.user.ursProfile = ursProfile
      })
    }
  }
})

export default createUserSlice
