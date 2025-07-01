import { isEmpty, isEqual } from 'lodash-es'
// @ts-expect-error The file does not have types
import jwt from 'jsonwebtoken'

import { ImmerStateCreator, PreferencesSlice } from '../types'
// @ts-expect-error The file does not have types
import configureStore from '../../store/configureStore'
// @ts-expect-error The file does not have types
import PreferencesRequest from '../../util/request/preferencesRequest'
// @ts-expect-error The file does not have types
import { getEarthdataEnvironment } from '../../selectors/earthdataEnvironment'
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

export const initialState = {
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
  },
  isSubmitting: false,
  isSubmitted: false
}

const createPreferencesSlice: ImmerStateCreator<PreferencesSlice> = (set, get) => ({
  preferences: {
    ...initialState,

    setPreferences: (preferences) => {
      set((state) => {
        state.preferences = {
          ...state.preferences,
          ...preferences
        }
      })
    },

    setIsSubmitting: (isSubmitting) => {
      set((state) => {
        state.preferences.isSubmitting = isSubmitting
      })
    },

    setIsSubmitted: (isSubmitted) => {
      set((state) => {
        state.preferences.isSubmitted = isSubmitted
      })
    },

    resetPreferences: () => {
      set((state) => {
        state.preferences = {
          ...state.preferences,
          ...initialState
        }
      })
    },

    setPanelState: (panelState) => {
      set((state) => {
        state.preferences.panelState = panelState
      })
    },

    setCollectionListView: (collectionListView) => {
      set((state) => {
        state.preferences.collectionListView = collectionListView
      })
    },

    setGranuleListView: (granuleListView) => {
      set((state) => {
        state.preferences.granuleListView = granuleListView
      })
    },

    setCollectionSort: (collectionSort) => {
      set((state) => {
        state.preferences.collectionSort = collectionSort
      })
    },

    setGranuleSort: (granuleSort) => {
      set((state) => {
        state.preferences.granuleSort = granuleSort
      })
    },

    setMapView: (mapView) => {
      set((state) => {
        state.preferences.mapView = {
          ...state.preferences.mapView,
          ...mapView
        }
      })
    },

    setPreferencesFromJwt: (jwtToken) => {
      if (!jwtToken) return

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const decoded = jwt.decode(jwtToken) as { preferences?: any }
      const { preferences = {} } = decoded

      // If there are map view preferences, ensure they are the new layer names
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
        state.preferences = {
          ...state.preferences,
          ...preferences
        }
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
          } = preferencesMapView

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
            projection,
            zoom
          })
        }
      }
    },

    updatePreferences: async (data) => {
      const { formData: preferences } = data

      get().preferences.setIsSubmitting(true)

      try {
        const { getState: reduxGetState, dispatch: reduxDispatch } = configureStore()
        const reduxState = reduxGetState()

        const earthdataEnvironment = getEarthdataEnvironment(reduxState)
        const { authToken } = reduxState

        const requestObject = new PreferencesRequest(authToken, earthdataEnvironment)

        const response = await requestObject.update({ preferences })

        const {
          data: dataObject,
          headers
        } = response

        const {
          preferences: newPreferences
        } = dataObject

        get().preferences.setPreferences(newPreferences)
        get().preferences.setIsSubmitting(false)

        reduxDispatch(updateAuthTokenFromHeaders(headers))

        addToast('Preferences saved!', {
          appearance: 'success',
          autoDismiss: true
        })
      } catch (error) {
        get().preferences.setIsSubmitting(false)

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
