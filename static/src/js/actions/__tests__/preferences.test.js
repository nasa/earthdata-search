import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import nock from 'nock'

import {
  SET_PREFERENCES_IS_SUBMITTING,
  SET_PREFERENCES,
  UPDATE_AUTH,
  UPDATE_MAP
} from '../../constants/actionTypes'

import {
  setIsSubmitting,
  setPreferences,
  setPreferencesFromJwt,
  updatePreferences
} from '../preferences'

import actions from '..'

import * as addToast from '../../util/addToast'
import { testJwtToken } from './mocks'
import mapLayers from '../../constants/mapLayers'
import projectionCodes from '../../constants/projectionCodes'

const mockStore = configureMockStore([thunk])

beforeEach(() => {
  jest.clearAllMocks()
})

describe('setIsSubmitting', () => {
  test('should create an action to update the store', () => {
    const expectedAction = {
      type: SET_PREFERENCES_IS_SUBMITTING,
      payload: true
    }

    expect(setIsSubmitting(true)).toEqual(expectedAction)
  })
})

describe('setPreferences', () => {
  test('should create an action to update the store', () => {
    const payload = {
      panelState: 'default'
    }
    const expectedAction = {
      type: SET_PREFERENCES,
      payload
    }

    expect(setPreferences(payload)).toEqual(expectedAction)
  })
})

describe('setPreferencesFromJwt', () => {
  test('should create an action to update the store', () => {
    const preferences = {
      mapView: {
        zoom: 4,
        latitude: 39,
        baseLayer: mapLayers.worldImagery,
        longitude: -95,
        projection: projectionCodes.geographic,
        overlayLayers: [
          mapLayers.bordersRoads,
          mapLayers.placeLabels
        ]
      },
      panelState: 'default',
      granuleSort: 'default',
      collectionSort: 'default',
      granuleListView: 'default',
      collectionListView: 'default'
    }

    const store = mockStore({})
    store.dispatch(setPreferencesFromJwt(testJwtToken))

    const storeActions = store.getActions()
    expect(storeActions[0]).toEqual({
      type: SET_PREFERENCES,
      payload: preferences
    })
  })

  test('does not create an action if payload doesn\'t exist', () => {
    const store = mockStore({})
    store.dispatch(setPreferencesFromJwt())
    const storeActions = store.getActions()
    expect(storeActions.length).toBe(0)
  })

  describe('when setting map preferences', () => {
    test('calls changeMap if map preferences exist and the map state equals the initial state', () => {
      const preferences = {
        mapView: {
          zoom: 4,
          latitude: 39,
          baseLayer: mapLayers.worldImagery,
          longitude: -95,
          projection: projectionCodes.geographic,
          overlayLayers: [
            mapLayers.bordersRoads,
            mapLayers.placeLabels
          ]
        },
        panelState: 'default',
        granuleSort: 'default',
        collectionSort: 'default',
        granuleListView: 'default',
        collectionListView: 'default'
      }

      const store = mockStore({
        map: {
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
          zoom: 3
        }
      })

      store.dispatch(setPreferencesFromJwt(testJwtToken))

      const storeActions = store.getActions()
      expect(storeActions.length).toBe(2)

      expect(storeActions[0]).toEqual({
        type: SET_PREFERENCES,
        payload: preferences
      })

      expect(storeActions[1]).toEqual({
        type: UPDATE_MAP,
        payload: {
          base: {
            worldImagery: true
          },
          latitude: 39,
          longitude: -95,
          overlays: {
            bordersRoads: true,
            placeLabels: true
          },
          projection: projectionCodes.geographic,
          zoom: 4
        }
      })
    })

    test('does not call changeMap if map preferences exist and the map state does not equal the initial state', () => {
      const preferences = {
        mapView: {
          zoom: 4,
          latitude: 39,
          baseLayer: mapLayers.worldImagery,
          longitude: -95,
          projection: projectionCodes.geographic,
          overlayLayers: [
            mapLayers.bordersRoads,
            mapLayers.placeLabels
          ]
        },
        panelState: 'default',
        granuleSort: 'default',
        collectionSort: 'default',
        granuleListView: 'default',
        collectionListView: 'default'
      }

      const store = mockStore({
        map: {
          base: {
            worldImagery: true,
            trueColor: false,
            landWaterMap: false
          },
          latitude: -120,
          longitude: 47,
          overlays: {
            bordersRoads: true,
            coastlines: false,
            placeLabels: true
          },
          projection: projectionCodes.geographic,
          rotation: 0,
          zoom: 3
        }
      })

      store.dispatch(setPreferencesFromJwt(testJwtToken))

      const storeActions = store.getActions()

      // Does not call UPDATE_MAP because the map state does not equal the initial state
      expect(storeActions.length).toBe(1)

      expect(storeActions[0]).toEqual({
        type: SET_PREFERENCES,
        payload: preferences
      })
    })
  })

  // TODO Remove in EDSC-4443
  describe('when setting map preferences with old layer names', () => {
    test('translate the layer names correctly', () => {
      // Translate blueMarble to worldImagery
      // Translate referenceFeatures to bordersRoads
      // Translate referenceLabels to placeLabels

      const preferences = {
        mapView: {
          zoom: 4,
          latitude: 39,
          baseLayer: 'blueMarble',
          longitude: -95,
          projection: projectionCodes.geographic,
          overlayLayers: [
            'referenceFeatures',
            'referenceLabels'
          ]
        },
        panelState: 'default',
        granuleSort: 'default',
        collectionSort: 'default',
        granuleListView: 'default',
        collectionListView: 'default'
      }
      const store = mockStore({
        map: {
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
          zoom: 3
        }
      })
      store.dispatch(setPreferencesFromJwt(testJwtToken))
      const storeActions = store.getActions()
      expect(storeActions.length).toBe(2)
      expect(storeActions[0]).toEqual({
        type: SET_PREFERENCES,
        payload: {
          ...preferences,
          mapView: {
            ...preferences.mapView,
            baseLayer: mapLayers.worldImagery,
            overlayLayers: [
              mapLayers.bordersRoads,
              mapLayers.placeLabels
            ]
          }
        }
      })
    })
  })
})

describe('updatePreferences', () => {
  test('should create an action to update the store', async () => {
    const addToastMock = jest.spyOn(addToast, 'addToast')

    const preferences = {
      panelState: 'default'
    }

    nock(/localhost/)
      .post(/preferences/)
      .reply(
        200,
        JSON.stringify({ preferences }),
        {
          'jwt-token': 'token'
        }
      )

    const store = mockStore({
      authToken: 'token'
    })

    await store.dispatch(updatePreferences(preferences)).then(() => {
      const storeActions = store.getActions()
      expect(storeActions[0]).toEqual({
        type: SET_PREFERENCES_IS_SUBMITTING,
        payload: true
      })

      expect(storeActions[1]).toEqual({
        type: UPDATE_AUTH,
        payload: 'token'
      })

      expect(storeActions[2]).toEqual({
        type: SET_PREFERENCES,
        payload: preferences
      })

      expect(storeActions[3]).toEqual({
        type: SET_PREFERENCES_IS_SUBMITTING,
        payload: false
      })

      expect(addToastMock.mock.calls.length).toBe(1)
      expect(addToastMock.mock.calls[0][0]).toBe('Preferences saved!')
      expect(addToastMock.mock.calls[0][1].appearance).toBe('success')
      expect(addToastMock.mock.calls[0][1].autoDismiss).toBe(true)
    })
  })

  test('does not call setPreferences on error', async () => {
    const addToastMock = jest.spyOn(addToast, 'addToast')

    const handleErrorMock = jest.spyOn(actions, 'handleError')

    nock(/localhost/)
      .post(/preferences/)
      .reply(500)

    nock(/localhost/)
      .post(/error_logger/)
      .reply(200)

    const store = mockStore({
      authToken: 'token'
    })

    const consoleMock = jest.spyOn(console, 'error').mockImplementationOnce(() => jest.fn())

    const preferences = {
      panelState: 'default'
    }

    await store.dispatch(updatePreferences(preferences)).then(() => {
      const storeActions = store.getActions()
      expect(storeActions[0]).toEqual({
        type: SET_PREFERENCES_IS_SUBMITTING,
        payload: true
      })

      expect(storeActions[1]).toEqual({
        type: SET_PREFERENCES_IS_SUBMITTING,
        payload: false
      })

      expect(handleErrorMock).toHaveBeenCalledTimes(1)
      expect(handleErrorMock).toBeCalledWith(expect.objectContaining({
        action: 'updatePreferences',
        notificationType: 'toast',
        resource: 'preferences'
      }))

      expect(consoleMock).toHaveBeenCalledTimes(1)

      expect(addToastMock.mock.calls.length).toBe(1)
      expect(addToastMock.mock.calls[0][1].appearance).toBe('error')
      expect(addToastMock.mock.calls[0][1].autoDismiss).toBe(false)
    })
  })
})
