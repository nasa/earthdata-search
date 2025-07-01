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

    // Specific setters for individual preference types
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

    // JWT processing implementation
    setPreferencesFromJwt: (jwtToken) => {
      if (!jwtToken) return

      const decoded = jwt.decode(jwtToken) as { preferences?: any }
      const { preferences = {} } = decoded

      // TODO Remove in EDSC-4443
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

      // Update Zustand preferences
      set((state) => {
        state.preferences = {
          ...state.preferences,
          ...preferences
        }
      })

      // If the user has map preferences use those to set the map store if there is no map url parameters
      // This will happen on page load to ensure that the map will default to the preferences
      const { mapView: preferencesMapView = {} } = preferences

      if (!isEmpty(preferencesMapView)) {
        // Get current state from the store
        const currentState = get()
        const { map: currentMap } = currentState
        const { mapView, setMapView } = currentMap

        // Define initial map view state (matches createMapSlice initial state)
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

        // Only apply preferences if current map state matches initial state
        // This prevents overriding URL parameters
        if (isEqual(mapView, initialMapView)) {
          const {
            baseLayer,
            latitude,
            longitude,
            overlayLayers,
            projection,
            zoom
          } = preferencesMapView

          // Convert preferences format to Zustand map format
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

    // API operations implementation with Redux integration
    updatePreferences: async (data) => {
      const { formData: preferences } = data

      // Set submitting state
      get().preferences.setIsSubmitting(true)

      try {
        // Access Redux store for authentication and environment data
        const { getState: reduxGetState, dispatch: reduxDispatch } = configureStore()
        const reduxState = reduxGetState()

        // Get required data from Redux state
        const earthdataEnvironment = getEarthdataEnvironment(reduxState)
        const { authToken } = reduxState

        // Create and execute API request
        const requestObject = new PreferencesRequest(authToken, earthdataEnvironment)

        const response = await requestObject.update({ preferences })

        const {
          data: dataObject,
          headers
        } = response

        const {
          preferences: newPreferences
        } = dataObject

        // Update Zustand state with new preferences
        get().preferences.setPreferences(newPreferences)
        get().preferences.setIsSubmitting(false)

        // Handle Redux side effects
        reduxDispatch(updateAuthTokenFromHeaders(headers))

        // Show success notification
        addToast('Preferences saved!', {
          appearance: 'success',
          autoDismiss: true
        })
      } catch (error) {
        // Handle error state
        get().preferences.setIsSubmitting(false)

        // Use Redux error handling system
        const { dispatch: reduxDispatch } = configureStore()

        reduxDispatch(actions.handleError({
          error,
          action: 'updatePreferences',
          resource: 'preferences',
          requestObject: null, // Will be undefined in catch block
          notificationType: displayNotificationType.toast
        }))
      }
    }
  }
})

export default createPreferencesSlice
