import { isEmpty, isEqual } from 'lodash-es'
// @ts-expect-error The file does not have types
import jwt from 'jsonwebtoken'

import {
  ImmerStateCreator,
  PreferencesSlice,
  PreferencesData
} from '../types'
import type { ProjectionCode } from '../../types/sharedTypes'
// @ts-expect-error The file does not have types
import configureStore from '../../store/configureStore'
import PreferencesRequest from '../../util/request/preferencesRequest'
// @ts-expect-error The file does not have types
import { updateAuthTokenFromHeaders } from '../../actions/authToken'
// @ts-expect-error The file does not have types
import { addToast } from '../../util/addToast'
// @ts-expect-error The file does not have types
import { displayNotificationType } from '../../constants/enums'
// @ts-expect-error The file does not have types
import actions from '../../actions'

import projectionCodes from '../../constants/projectionCodes'
import mapLayers from '../../constants/mapLayers'
import { projectionConfigs } from '../../util/map/crs'

/** Type for JWT token payload containing preferences */
type JwtTokenPayload = {
  preferences?: Partial<PreferencesData>
}

export const initialPreferencesData = {
  panelState: 'default',
  collectionListView: 'default',
  granuleListView: 'default',
  collectionSort: 'default',
  granuleSort: 'default',
  mapView: {
    zoom: 3,
    latitude: 0,
    baseLayer: mapLayers.worldImagery,
    longitude: 0,
    projection: projectionCodes.geographic,
    overlayLayers: [
      mapLayers.bordersRoads,
      mapLayers.placeLabels
    ],
    rotation: 0
  }
}

export const initialState = {
  preferences: initialPreferencesData,
  isSubmitting: false,
  isSubmitted: false
}

const createPreferencesSlice: ImmerStateCreator<PreferencesSlice> = (set, get) => ({
  preferences: {
    ...initialState,

    setPreferences: (preferences) => {
      set((state) => {
        state.preferences.preferences = preferences
      })
    },

    setIsSubmitting: (isSubmitting) => {
      set((state) => {
        state.preferences.isSubmitting = isSubmitting
      })
    },

    setPreferencesFromJwt: (jwtToken) => {
      if (!jwtToken) return

      const decoded = jwt.decode(jwtToken) as JwtTokenPayload
      const { preferences = {} } = decoded

      // TODO Remove in EDSC-4443 - Legacy layer migration
      if (preferences.mapView) {
        const { baseLayer, overlayLayers } = preferences.mapView
        if (baseLayer === 'blueMarble') {
          preferences.mapView.baseLayer = mapLayers.worldImagery
        }

        const referenceFeatureIndex = overlayLayers.indexOf('referenceFeatures')
        const referenceLabelsIndex = overlayLayers.indexOf('referenceLabels')
        if (referenceFeatureIndex !== -1) {
          overlayLayers[referenceFeatureIndex] = mapLayers.bordersRoads
        }

        if (referenceLabelsIndex !== -1) {
          overlayLayers[referenceLabelsIndex] = mapLayers.placeLabels
        }
      }

      set((state) => {
        state.preferences.preferences = preferences
      })

      const { mapView: preferencesMapView = {} } = preferences

      if (!isEmpty(preferencesMapView)) {
        const currentState = get()
        const { map: currentMap } = currentState
        const { mapView, setMapView } = currentMap

        const initialMapView = {
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
          zoom: projectionConfigs[projectionCodes.geographic].zoom
        }

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

    submitAndUpdatePreferences: async (data) => {
      const { formData: preferences } = data

      set((state) => {
        state.preferences.isSubmitting = true
      })

      try {
        const { getState: reduxGetState, dispatch: reduxDispatch } = configureStore()
        const reduxState = reduxGetState()

        const {
          authToken,
          earthdataEnvironment
        } = reduxState

        const requestObject = new PreferencesRequest(authToken, earthdataEnvironment)

        const response = await requestObject.update({ preferences })

        const {
          data: dataObject,
          headers
        } = response

        const {
          preferences: newPreferences
        } = dataObject

        set((state) => {
          state.preferences.preferences = newPreferences

          state.preferences.isSubmitting = false
        })

        reduxDispatch(updateAuthTokenFromHeaders(headers))

        addToast('Preferences saved!', {
          appearance: 'success',
          autoDismiss: true
        })
      } catch (error) {
        set((state) => {
          state.preferences.isSubmitting = false
        })

        const { dispatch: reduxDispatch } = configureStore()

        reduxDispatch(actions.handleError({
          error,
          action: 'updatePreferences',
          resource: 'preferences',
          requestObject: null,
          notificationType: displayNotificationType.toast
        }))
      }
    }
  }
})

export default createPreferencesSlice
