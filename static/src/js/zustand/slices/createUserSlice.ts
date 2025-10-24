import { isEmpty, isEqual } from 'lodash-es'

import {
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
    sitePreferences: initialSitePreferences,
    username: undefined,

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
        const currentState = get()
        const { map: currentMap } = currentState
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

    setUsername: (username: string) => {
      set((state) => {
        state.user.username = username
      })
    }
  }
})

export default createUserSlice
