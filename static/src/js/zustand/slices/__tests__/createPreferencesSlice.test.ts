// @ts-expect-error The file does not have types
import jwt from 'jsonwebtoken'

import projectionCodes from '../../../constants/projectionCodes'
import mapLayers from '../../../constants/mapLayers'
import useEdscStore from '../../useEdscStore'
import { initialState } from '../createPreferencesSlice'
// @ts-expect-error The file does not have types
import configureStore from '../../../store/configureStore'
import PreferencesRequest from '../../../util/request/preferencesRequest'
// @ts-expect-error The file does not have types
import actions from '../../../actions'
// @ts-expect-error The file does not have types
import { addToast } from '../../../util/addToast'

jest.mock('jsonwebtoken')
jest.mock('../../../store/configureStore')
jest.mock('../../../util/request/preferencesRequest')
jest.mock('../../../actions')
jest.mock('../../../util/addToast')

const mockJwt = jwt as jest.Mocked<typeof jwt>
const mockConfigureStore = configureStore as jest.MockedFunction<typeof configureStore>
const mockPreferencesRequest = PreferencesRequest as jest.MockedClass<typeof PreferencesRequest>
const mockActions = actions as jest.Mocked<typeof actions>
const mockAddToast = addToast as jest.MockedFunction<typeof addToast>

describe('createPreferencesSlice', () => {
  test('sets the default state', () => {
    const zustandState = useEdscStore.getState()
    const { preferences } = zustandState

    expect(preferences).toEqual({
      ...initialState,
      setPreferences: expect.any(Function),
      setPreferencesFromJwt: expect.any(Function),
      submitAndUpdatePreferences: expect.any(Function)
    })
  })

  test('mapView preferences have correct initial structure', () => {
    const { mapView } = useEdscStore.getState().preferences.preferences

    expect(mapView).toEqual({
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
    })
  })

  describe('setPreferences', () => {
    test('updates preferences by merging with existing preferences', () => {
      const { setPreferences } = useEdscStore.getState().preferences
      const initialPreferences = useEdscStore.getState().preferences.preferences

      const newPreferences = {
        panelState: 'collapsed',
        collectionSort: '-score'
      }

      setPreferences(newPreferences)

      const updatedPreferences = useEdscStore.getState().preferences.preferences
      expect(updatedPreferences.panelState).toBe('collapsed')
      expect(updatedPreferences.collectionSort).toBe('-score')
      expect(updatedPreferences.collectionListView).toBe(initialPreferences.collectionListView)
      expect(updatedPreferences.granuleListView).toBe(initialPreferences.granuleListView)
      expect(updatedPreferences.granuleSort).toBe(initialPreferences.granuleSort)
      expect(updatedPreferences.mapView).toEqual(initialPreferences.mapView)
    })

    test('updates mapView preferences by replacing the entire object', () => {
      const { setPreferences } = useEdscStore.getState().preferences
      const initialMapView = useEdscStore.getState().preferences.preferences.mapView

      const newMapViewPreferences = {
        mapView: {
          ...initialMapView,
          zoom: 5,
          latitude: 45,
          longitude: -95
        }
      }

      setPreferences(newMapViewPreferences)

      const updatedPreferences = useEdscStore.getState().preferences.preferences
      expect(updatedPreferences.mapView.zoom).toBe(5)
      expect(updatedPreferences.mapView.latitude).toBe(45)
      expect(updatedPreferences.mapView.longitude).toBe(-95)
      expect(updatedPreferences.mapView.baseLayer).toBe(initialMapView.baseLayer)
      expect(updatedPreferences.mapView.projection).toBe(initialMapView.projection)
      expect(updatedPreferences.mapView.overlayLayers).toEqual(initialMapView.overlayLayers)
      expect(updatedPreferences.mapView.rotation).toBe(initialMapView.rotation)
    })

    test('completely replaces mapView when provided', () => {
      const { setPreferences } = useEdscStore.getState().preferences

      const newMapView = {
        zoom: 8,
        latitude: 30,
        longitude: -120,
        baseLayer: mapLayers.trueColor,
        projection: projectionCodes.arctic,
        overlayLayers: [mapLayers.coastlines],
        rotation: 45
      }

      setPreferences({ mapView: newMapView })

      const updatedPreferences = useEdscStore.getState().preferences.preferences
      expect(updatedPreferences.mapView).toEqual(newMapView)
    })

    test('updates multiple preference categories at once', () => {
      const { setPreferences } = useEdscStore.getState().preferences

      const newPreferences = {
        panelState: 'collapsed',
        collectionSort: '-score',
        granuleSort: '-start_date',
        collectionListView: 'list',
        granuleListView: 'table',
        mapView: {
          zoom: 6,
          latitude: 40,
          longitude: -110,
          baseLayer: mapLayers.landWaterMap,
          projection: projectionCodes.antarctic,
          overlayLayers: [mapLayers.bordersRoads, mapLayers.coastlines],
          rotation: 90
        }
      }

      setPreferences(newPreferences)

      const updatedPreferences = useEdscStore.getState().preferences.preferences
      expect(updatedPreferences.panelState).toBe('collapsed')
      expect(updatedPreferences.collectionSort).toBe('-score')
      expect(updatedPreferences.granuleSort).toBe('-start_date')
      expect(updatedPreferences.collectionListView).toBe('list')
      expect(updatedPreferences.granuleListView).toBe('table')
      expect(updatedPreferences.mapView).toEqual(newPreferences.mapView)
    })
  })

  describe('setPreferencesFromJwt', () => {
    test('does nothing when no token provided', () => {
      const { setPreferencesFromJwt } = useEdscStore.getState().preferences
      const initialPreferences = useEdscStore.getState().preferences.preferences

      setPreferencesFromJwt('')

      const updatedPreferences = useEdscStore.getState().preferences.preferences
      expect(updatedPreferences.panelState).toBe(initialPreferences.panelState)
    })

    test('updates preferences from valid JWT token', () => {
      const mockDecodedToken = {
        preferences: {
          panelState: 'jwt-panel',
          collectionListView: 'jwt-view',
          mapView: {
            zoom: 10,
            latitude: 50,
            longitude: -100,
            baseLayer: mapLayers.trueColor,
            overlayLayers: [mapLayers.coastlines]
          }
        }
      }

      mockJwt.decode.mockReturnValue(mockDecodedToken)

      const { setPreferencesFromJwt } = useEdscStore.getState().preferences

      setPreferencesFromJwt('valid-jwt-token')

      const updatedPreferences = useEdscStore.getState().preferences.preferences
      expect(updatedPreferences.panelState).toBe('jwt-panel')
      expect(updatedPreferences.collectionListView).toBe('jwt-view')
      expect(updatedPreferences.mapView.zoom).toBe(10)
      expect(updatedPreferences.mapView.latitude).toBe(50)
      expect(updatedPreferences.mapView.longitude).toBe(-100)
      expect(updatedPreferences.mapView.baseLayer).toBe(mapLayers.trueColor)
      expect(updatedPreferences.mapView.overlayLayers).toEqual([mapLayers.coastlines])
    })

    test('migrates legacy layer names', () => {
      const mockDecodedToken = {
        preferences: {
          mapView: {
            baseLayer: 'blueMarble',
            overlayLayers: ['referenceFeatures', 'referenceLabels']
          }
        }
      }

      mockJwt.decode.mockReturnValue(mockDecodedToken)

      const { setPreferencesFromJwt } = useEdscStore.getState().preferences

      setPreferencesFromJwt('legacy-jwt-token')

      const updatedPreferences = useEdscStore.getState().preferences.preferences
      expect(updatedPreferences.mapView.baseLayer).toBe(mapLayers.worldImagery)
      expect(updatedPreferences.mapView.overlayLayers).toEqual([
        mapLayers.bordersRoads,
        mapLayers.placeLabels
      ])
    })
  })

  describe('submitAndUpdatePreferences', () => {
    let mockGetState: jest.Mock
    let mockDispatch: jest.Mock
    let mockPreferencesRequestInstance: { update: jest.Mock }
    let mockHandleError: jest.Mock

    beforeEach(() => {
      mockGetState = jest.fn()
      mockDispatch = jest.fn()
      mockPreferencesRequestInstance = {
        update: jest.fn()
      }

      mockHandleError = jest.fn()

      mockConfigureStore.mockReturnValue({
        getState: mockGetState,
        dispatch: mockDispatch
      })

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      mockPreferencesRequest.mockImplementation(() => mockPreferencesRequestInstance as any)
      mockActions.handleError = mockHandleError
      mockAddToast.mockClear()
    })

    afterEach(() => {
      jest.clearAllMocks()
    })

    test('successfully submits and updates preferences', async () => {
      const mockAuthToken = 'mock-auth-token'
      const mockEarthdataEnvironment = 'prod'
      const mockHeaders = { 'x-auth-token': 'new-token' }
      const mockPreferencesData = {
        panelState: 'collapsed',
        collectionSort: '-score',
        granuleSort: '-start_date',
        collectionListView: 'default',
        granuleListView: 'default',
        mapView: {
          zoom: 3,
          latitude: 0,
          longitude: 0,
          baseLayer: mapLayers.worldImagery,
          projection: projectionCodes.geographic,
          overlayLayers: [mapLayers.bordersRoads, mapLayers.placeLabels],
          rotation: 0
        }
      }
      const mockResponseData = {
        preferences: {
          panelState: 'collapsed',
          collectionSort: '-score',
          granuleSort: '-start_date',
          collectionListView: 'list'
        }
      }

      mockGetState.mockReturnValue({
        authToken: mockAuthToken,
        earthdataEnvironment: mockEarthdataEnvironment
      })

      mockPreferencesRequestInstance.update.mockResolvedValue({
        data: mockResponseData,
        headers: mockHeaders
      })

      const { submitAndUpdatePreferences } = useEdscStore.getState().preferences
      const initialPreferencesState = useEdscStore.getState().preferences

      expect(initialPreferencesState.isSubmitting).toBe(false)

      await submitAndUpdatePreferences({ formData: mockPreferencesData })

      const finalState = useEdscStore.getState().preferences

      expect(mockPreferencesRequest).toHaveBeenCalledWith(mockAuthToken, mockEarthdataEnvironment)
      expect(mockPreferencesRequestInstance.update).toHaveBeenCalledWith({
        preferences: mockPreferencesData
      })

      expect(finalState.isSubmitting).toBe(false)
      expect(finalState.preferences).toEqual(
        expect.objectContaining(mockResponseData.preferences)
      )

      expect(mockAddToast).toHaveBeenCalledWith('Preferences saved!', {
        appearance: 'success',
        autoDismiss: true
      })
    })

    test('sets isSubmitting to true during submission', async () => {
      const mockAuthToken = 'mock-auth-token'
      const mockEarthdataEnvironment = 'prod'
      const mockPreferencesData = {
        panelState: 'collapsed',
        collectionSort: 'default',
        granuleSort: 'default',
        collectionListView: 'default',
        granuleListView: 'default',
        mapView: {
          zoom: 3,
          latitude: 0,
          longitude: 0,
          baseLayer: mapLayers.worldImagery,
          projection: projectionCodes.geographic,
          overlayLayers: [mapLayers.bordersRoads, mapLayers.placeLabels],
          rotation: 0
        }
      }

      mockGetState.mockReturnValue({
        authToken: mockAuthToken,
        earthdataEnvironment: mockEarthdataEnvironment
      })

      mockPreferencesRequestInstance.update.mockImplementation(
        () => new Promise((resolve) => {
          resolve({
            data: { preferences: mockPreferencesData },
            headers: {}
          })
        })
      )

      const { submitAndUpdatePreferences } = useEdscStore.getState().preferences

      const submitPromise = submitAndUpdatePreferences({ formData: mockPreferencesData })

      const stateWhileSubmitting = useEdscStore.getState().preferences
      expect(stateWhileSubmitting.isSubmitting).toBe(true)

      await submitPromise

      const finalState = useEdscStore.getState().preferences
      expect(finalState.isSubmitting).toBe(false)
    })

    test('handles request error and sets isSubmitting to false', async () => {
      const mockAuthToken = 'mock-auth-token'
      const mockEarthdataEnvironment = 'prod'
      const mockPreferencesData = {
        panelState: 'collapsed',
        collectionSort: 'default',
        granuleSort: 'default',
        collectionListView: 'default',
        granuleListView: 'default',
        mapView: {
          zoom: 3,
          latitude: 0,
          longitude: 0,
          baseLayer: mapLayers.worldImagery,
          projection: projectionCodes.geographic,
          overlayLayers: [mapLayers.bordersRoads, mapLayers.placeLabels],
          rotation: 0
        }
      }
      const mockError = new Error('Request failed')

      mockGetState.mockReturnValue({
        authToken: mockAuthToken,
        earthdataEnvironment: mockEarthdataEnvironment
      })

      mockPreferencesRequestInstance.update.mockRejectedValue(mockError)

      const { submitAndUpdatePreferences } = useEdscStore.getState().preferences

      await submitAndUpdatePreferences({ formData: mockPreferencesData })

      const finalState = useEdscStore.getState().preferences
      expect(finalState.isSubmitting).toBe(false)
      expect(mockHandleError).toHaveBeenCalledWith({
        error: mockError,
        action: 'updatePreferences',
        resource: 'preferences',
        requestObject: null,
        notificationType: 'toast'
      })
    })

    test('merges server response with existing preferences', async () => {
      const mockAuthToken = 'mock-auth-token'
      const mockEarthdataEnvironment = 'prod'
      const existingPreferences = {
        panelState: 'expanded',
        collectionSort: 'default',
        granuleSort: 'default',
        collectionListView: 'default'
      }
      const mockPreferencesData = {
        panelState: 'collapsed',
        collectionSort: '-score',
        granuleSort: 'default',
        collectionListView: 'default',
        granuleListView: 'default',
        mapView: {
          zoom: 3,
          latitude: 0,
          longitude: 0,
          baseLayer: mapLayers.worldImagery,
          projection: projectionCodes.geographic,
          overlayLayers: [mapLayers.bordersRoads, mapLayers.placeLabels],
          rotation: 0
        }
      }
      const mockResponseData = {
        preferences: {
          panelState: 'collapsed',
          collectionSort: '-score'
        }
      }

      const { setPreferences } = useEdscStore.getState().preferences
      setPreferences(existingPreferences)

      mockGetState.mockReturnValue({
        authToken: mockAuthToken,
        earthdataEnvironment: mockEarthdataEnvironment
      })

      mockPreferencesRequestInstance.update.mockResolvedValue({
        data: mockResponseData,
        headers: {}
      })

      const { submitAndUpdatePreferences } = useEdscStore.getState().preferences

      await submitAndUpdatePreferences({ formData: mockPreferencesData })

      const finalState = useEdscStore.getState().preferences
      expect(finalState.preferences.panelState).toBe('collapsed')
      expect(finalState.preferences.collectionSort).toBe('-score')
      expect(finalState.preferences.granuleSort).toBe('default')
      expect(finalState.preferences.collectionListView).toBe('default')
    })

    test('handles complex preferences with mapView data', async () => {
      const mockAuthToken = 'mock-auth-token'
      const mockEarthdataEnvironment = 'prod'
      const mockPreferencesData = {
        panelState: 'collapsed',
        collectionSort: 'default',
        granuleSort: 'default',
        collectionListView: 'default',
        granuleListView: 'default',
        mapView: {
          zoom: 5,
          latitude: 40,
          longitude: -100,
          baseLayer: mapLayers.trueColor,
          projection: projectionCodes.antarctic,
          overlayLayers: [mapLayers.coastlines],
          rotation: 0
        }
      }
      const mockResponseData = {
        preferences: mockPreferencesData
      }

      mockGetState.mockReturnValue({
        authToken: mockAuthToken,
        earthdataEnvironment: mockEarthdataEnvironment
      })

      mockPreferencesRequestInstance.update.mockResolvedValue({
        data: mockResponseData,
        headers: {}
      })

      const { submitAndUpdatePreferences } = useEdscStore.getState().preferences

      await submitAndUpdatePreferences({ formData: mockPreferencesData })

      const finalState = useEdscStore.getState().preferences
      expect(finalState.preferences.mapView).toEqual(mockPreferencesData.mapView)
    })

    test('dispatches updateAuthTokenFromHeaders with response headers', async () => {
      const mockAuthToken = 'mock-auth-token'
      const mockEarthdataEnvironment = 'prod'
      const mockHeaders = {
        'x-auth-token': 'new-token',
        'content-type': 'application/json'
      }
      const mockPreferencesData = {
        panelState: 'collapsed',
        collectionSort: 'default',
        granuleSort: 'default',
        collectionListView: 'default',
        granuleListView: 'default',
        mapView: {
          zoom: 3,
          latitude: 0,
          longitude: 0,
          baseLayer: mapLayers.worldImagery,
          projection: projectionCodes.geographic,
          overlayLayers: [mapLayers.bordersRoads, mapLayers.placeLabels],
          rotation: 0
        }
      }

      mockGetState.mockReturnValue({
        authToken: mockAuthToken,
        earthdataEnvironment: mockEarthdataEnvironment
      })

      mockPreferencesRequestInstance.update.mockResolvedValue({
        data: { preferences: mockPreferencesData },
        headers: mockHeaders
      })

      const { submitAndUpdatePreferences } = useEdscStore.getState().preferences

      await submitAndUpdatePreferences({ formData: mockPreferencesData })

      expect(mockDispatch).toHaveBeenCalledWith(expect.any(Function))
    })
  })
})
