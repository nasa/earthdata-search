import preferencesReducer from '../preferences'
import {
  SET_PREFERENCES, SET_PREFERENCES_IS_SUBMITTING
} from '../../constants/actionTypes'

const initialState = {
  preferences: {
    panelState: 'default',
    collectionListView: 'default',
    granuleListView: 'default',
    mapView: {
      zoom: 2,
      latitude: 0,
      baseLayer: 'blueMarble',
      longitude: 0,
      projection: 'epsg4326',
      overlayLayers: [
        'referenceFeatures',
        'referenceLabels'
      ]
    }
  },
  isSubmitting: false,
  isSubmitted: false
}

describe('INITIAL_STATE', () => {
  test('is correct', () => {
    const action = { type: 'dummy_action' }

    expect(preferencesReducer(undefined, action)).toEqual(initialState)
  })
})

describe('SET_PREFERENCES', () => {
  test('returns the correct state', () => {
    const action = {
      type: SET_PREFERENCES,
      payload: {
        panelState: 'default'
      }
    }

    const expectedState = {
      ...initialState,
      preferences: {
        panelState: 'default'
      }
    }

    expect(preferencesReducer(undefined, action)).toEqual(expectedState)
  })

  test('returns the initial state if the payload is empty', () => {
    const action = {
      type: SET_PREFERENCES,
      payload: {}
    }

    expect(preferencesReducer(undefined, action)).toEqual(initialState)
  })
})

describe('SET_PREFERENCES_IS_SUBMITTING', () => {
  test('returns the correct state', () => {
    const action = {
      type: SET_PREFERENCES_IS_SUBMITTING,
      payload: true
    }

    const expectedState = {
      ...initialState,
      isSubmitting: true
    }

    expect(preferencesReducer(undefined, action)).toEqual(expectedState)
  })
})
