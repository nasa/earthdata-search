import {
  SET_ADMIN_PREFERENCES_METRICS,
  SET_ADMIN_PREFERENCES_METRICS_LOADING,
  SET_ADMIN_PREFERENCES_METRICS_LOADED
} from '../../../constants/actionTypes'
import mapLayers from '../../../constants/mapLayers'
import projectionCodes from '../../../constants/projectionCodes'

import adminPreferencesMetricsReducer from '../preferencesMetrics'

const initialState = {
  isLoaded: false,
  isLoading: false,
  preferences: {
    zoom: [],
    latitude: [],
    longitude: [],
    projection: [],
    overlayLayers: [],
    baseLayer: [],
    panelState: [],
    granuleSort: [],
    collectionSort: [],
    granuleListView: [],
    collectionListView: []
  }
}

describe('INITIAL_STATE', () => {
  test('is correct', () => {
    const action = { type: 'dummy_action' }

    expect(adminPreferencesMetricsReducer(undefined, action)).toEqual(initialState)
  })
})

describe('SET_ADMIN_PREFERENCES_METRICS_LOADED', () => {
  test('returns the correct state', () => {
    const action = {
      type: SET_ADMIN_PREFERENCES_METRICS_LOADED
    }

    const expectedState = {
      ...initialState,
      isLoaded: true,
      isLoading: false
    }

    expect(adminPreferencesMetricsReducer(undefined, action)).toEqual(expectedState)
  })
})

describe('SET_ADMIN_PREFERENCES_METRICS_LOADING', () => {
  test('returns the correct state', () => {
    const action = {
      type: SET_ADMIN_PREFERENCES_METRICS_LOADING
    }

    const expectedState = {
      ...initialState,
      isLoaded: false,
      isLoading: true
    }

    expect(adminPreferencesMetricsReducer(undefined, action)).toEqual(expectedState)
  })
})

describe('SET_ADMIN_PREFERENCES_METRICS', () => {
  test('returns the correct state', () => {
    const payload = {
      preferences: {
        panelState: [
          ['open', '100% (2)']
        ],
        granuleSort: [
          ['start_date', '50% (1)'],
          ['-start_date', '50% (1)']
        ],
        granuleListView: [
          ['default', '100% (2)']
        ],
        collectionSort: [
          ['-score', '100% (2)']
        ],
        collectionListView: [
          ['list', '50% (1)'],
          ['default', '50% (1)']
        ],
        zoom: [
          [2, '100% (2)']
        ],
        latitude: [
          [0, '100% (2)']
        ],
        longitude: [
          [0, '100% (2)']
        ],
        projection: [
          [projectionCodes.geographic, '100% (2)']
        ],
        overlayLayers: [
          [mapLayers.bordersRoads, '100% (2)'],
          [mapLayers.placeLabels, '100% (2)']
        ],
        baseLayer: [
          [mapLayers.worldImagery, '100% (2)']
        ]
      }
    }
    const action = {
      type: SET_ADMIN_PREFERENCES_METRICS,
      payload
    }

    const expectedState = {
      ...initialState,
      preferences: {
        panelState: [
          ['open', '100% (2)']
        ],
        granuleSort: [
          ['start_date', '50% (1)'],
          ['-start_date', '50% (1)']
        ],
        granuleListView: [
          ['default', '100% (2)']
        ],
        collectionSort: [
          ['-score', '100% (2)']
        ],
        collectionListView: [
          ['list', '50% (1)'],
          ['default', '50% (1)']
        ],
        zoom: [
          [2, '100% (2)']
        ],
        latitude: [
          [0, '100% (2)']
        ],
        longitude: [
          [0, '100% (2)']
        ],
        projection: [
          [projectionCodes.geographic, '100% (2)']
        ],
        overlayLayers: [
          [mapLayers.bordersRoads, '100% (2)'],
          [mapLayers.placeLabels, '100% (2)']
        ],
        baseLayer: [
          [mapLayers.worldImagery, '100% (2)']
        ]
      }
    }

    expect(adminPreferencesMetricsReducer(undefined, action)).toEqual(expectedState)
  })
})
