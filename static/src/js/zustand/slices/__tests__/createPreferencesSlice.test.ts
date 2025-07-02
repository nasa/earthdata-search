// @ts-expect-error The file does not have types
import jwt from 'jsonwebtoken'

import projectionCodes from '../../../constants/projectionCodes'
import mapLayers from '../../../constants/mapLayers'
import useEdscStore from '../../useEdscStore'
import { initialState } from '../createPreferencesSlice'

jest.mock('jsonwebtoken')
jest.mock('../../../store/configureStore')
jest.mock('../../../util/request/preferencesRequest')
jest.mock('../../../actions')
jest.mock('../../../util/addToast')

const mockJwt = jwt as jest.Mocked<typeof jwt>

describe('createPreferencesSlice', () => {
  beforeEach(() => {
    useEdscStore.setState(useEdscStore.getInitialState())
    jest.clearAllMocks()
  })

  test('sets the default state', () => {
    const zustandState = useEdscStore.getState()
    const { preferences } = zustandState

    expect(preferences).toEqual({
      ...initialState,
      setPreferences: expect.any(Function),
      setIsSubmitting: expect.any(Function),
      setIsSubmitted: expect.any(Function),
      resetPreferences: expect.any(Function),
      setPanelState: expect.any(Function),
      setCollectionListView: expect.any(Function),
      setGranuleListView: expect.any(Function),
      setCollectionSort: expect.any(Function),
      setGranuleSort: expect.any(Function),
      setMapView: expect.any(Function),
      setPreferencesFromJwt: expect.any(Function),
      updatePreferences: expect.any(Function)
    })
  })

  test('setPreferences updates the preferences state', () => {
    const { setPreferences } = useEdscStore.getState().preferences

    setPreferences({
      panelState: 'open',
      collectionListView: 'table'
    })

    const updatedState = useEdscStore.getState()
    expect(updatedState.preferences.panelState).toBe('open')
    expect(updatedState.preferences.collectionListView).toBe('table')
    expect(updatedState.preferences.granuleListView).toBe('default')
  })

  test('setIsSubmitting updates the submitting state', () => {
    const { setIsSubmitting } = useEdscStore.getState().preferences

    expect(useEdscStore.getState().preferences.isSubmitting).toBe(false)

    setIsSubmitting(true)

    expect(useEdscStore.getState().preferences.isSubmitting).toBe(true)
  })

  test('setIsSubmitted updates the submitted state', () => {
    const { setIsSubmitted } = useEdscStore.getState().preferences

    expect(useEdscStore.getState().preferences.isSubmitted).toBe(false)

    setIsSubmitted(true)

    expect(useEdscStore.getState().preferences.isSubmitted).toBe(true)
  })

  test('resetPreferences resets to initial state', () => {
    const { setPreferences, resetPreferences } = useEdscStore.getState().preferences

    // Modify preferences
    setPreferences({
      panelState: 'modified',
      collectionListView: 'table',
      isSubmitting: true
    })

    // Verify they changed
    let currentState = useEdscStore.getState().preferences
    expect(currentState.panelState).toBe('modified')
    expect(currentState.collectionListView).toBe('table')
    expect(currentState.isSubmitting).toBe(true)

    // Reset preferences
    resetPreferences()

    // Verify they're back to initial state
    currentState = useEdscStore.getState().preferences
    expect(currentState.panelState).toBe(initialState.panelState)
    expect(currentState.collectionListView).toBe(initialState.collectionListView)
    expect(currentState.isSubmitting).toBe(initialState.isSubmitting)
  })

  describe('individual setters', () => {
    test('setPanelState updates panel state', () => {
      const { setPanelState } = useEdscStore.getState().preferences

      setPanelState('custom')

      expect(useEdscStore.getState().preferences.panelState).toBe('custom')
    })

    test('setCollectionListView updates collection list view', () => {
      const { setCollectionListView } = useEdscStore.getState().preferences

      setCollectionListView('table')

      expect(useEdscStore.getState().preferences.collectionListView).toBe('table')
    })

    test('setGranuleListView updates granule list view', () => {
      const { setGranuleListView } = useEdscStore.getState().preferences

      setGranuleListView('list')

      expect(useEdscStore.getState().preferences.granuleListView).toBe('list')
    })

    test('setCollectionSort updates collection sort', () => {
      const { setCollectionSort } = useEdscStore.getState().preferences

      setCollectionSort('score')

      expect(useEdscStore.getState().preferences.collectionSort).toBe('score')
    })

    test('setGranuleSort updates granule sort', () => {
      const { setGranuleSort } = useEdscStore.getState().preferences

      setGranuleSort('-start_date')

      expect(useEdscStore.getState().preferences.granuleSort).toBe('-start_date')
    })

    test('setMapView updates map view preferences', () => {
      const { setMapView } = useEdscStore.getState().preferences

      const newMapView = {
        zoom: 5,
        latitude: 10
      }

      setMapView(newMapView)

      const updatedState = useEdscStore.getState().preferences
      expect(updatedState.mapView.zoom).toBe(5)
      expect(updatedState.mapView.latitude).toBe(10)
      expect(updatedState.mapView.longitude).toBe(0)
      expect(updatedState.mapView.baseLayer).toBe(mapLayers.worldImagery)
    })
  })

  test('mapView preferences have correct initial structure', () => {
    const { mapView } = useEdscStore.getState().preferences

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

  test('setPreferences can update mapView preferences', () => {
    const { setPreferences } = useEdscStore.getState().preferences

    const newMapView = {
      zoom: 5,
      latitude: 10,
      longitude: -20,
      baseLayer: mapLayers.trueColor,
      projection: projectionCodes.arctic,
      overlayLayers: [mapLayers.coastlines],
      rotation: 45
    }

    setPreferences({ mapView: newMapView })

    const updatedState = useEdscStore.getState().preferences
    expect(updatedState.mapView).toEqual(newMapView)
  })

  describe('setPreferencesFromJwt', () => {
    test('does nothing when no token provided', () => {
      const { setPreferencesFromJwt } = useEdscStore.getState().preferences
      const initialPreferences = useEdscStore.getState().preferences

      setPreferencesFromJwt('')

      const updatedPreferences = useEdscStore.getState().preferences
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

      const updatedPreferences = useEdscStore.getState().preferences
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

      const updatedPreferences = useEdscStore.getState().preferences
      expect(updatedPreferences.mapView.baseLayer).toBe(mapLayers.worldImagery)
      expect(updatedPreferences.mapView.overlayLayers).toEqual([
        mapLayers.bordersRoads,
        mapLayers.placeLabels
      ])
    })
  })
})
