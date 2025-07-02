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
  test('sets the default state', () => {
    const zustandState = useEdscStore.getState()
    const { preferences } = zustandState

    expect(preferences).toEqual({
      ...initialState,
      setPreferences: expect.any(Function),
      setIsSubmitting: expect.any(Function),
      setPreferencesFromJwt: expect.any(Function),
      submitAndUpdatePreferences: expect.any(Function)
    })
  })

  test('setIsSubmitting updates the submitting state', () => {
    const { setIsSubmitting } = useEdscStore.getState().preferences

    expect(useEdscStore.getState().preferences.isSubmitting).toBe(false)

    setIsSubmitting(true)

    expect(useEdscStore.getState().preferences.isSubmitting).toBe(true)
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
