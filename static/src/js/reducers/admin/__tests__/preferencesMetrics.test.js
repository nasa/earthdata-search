import {
  SET_ADMIN_METRICS_PREFERENCES,
  SET_ADMIN_METRICS_PREFERENCES_LOADING,
  SET_ADMIN_METRICS_PREFERENCES_LOADED
} from '../../../constants/actionTypes'

import adminMetricsPreferencesReducer from '../preferencesMetrics'

const initialState = {
  isLoaded: false,
  isLoading: false,
  preferences: {
    panelState: {},
    granuleSort: {},
    granuleListView: {},
    collectionSort: {},
    collectionListView: {},
    zoom: {},
    latitude: {},
    longitude: {},
    projection: {},
    overlayLayers: {},
    baseLayer: {}
  }
}

describe('INITIAL_STATE', () => {
  test('is correct', () => {
    const action = { type: 'dummy_action' }

    expect(adminMetricsPreferencesReducer(undefined, action)).toEqual(initialState)
  })
})

describe('SET_ADMIN_METRICS_PREFERENCES_LOADED', () => {
  test('returns the correct state', () => {
    const action = {
      type: SET_ADMIN_METRICS_PREFERENCES_LOADED
    }

    const expectedState = {
      ...initialState,
      isLoaded: true,
      isLoading: false
    }

    expect(adminMetricsPreferencesReducer(undefined, action)).toEqual(expectedState)
  })
})

describe('SET_ADMIN_METRICS_PREFERENCES_LOADING', () => {
  test('returns the correct state', () => {
    const action = {
      type: SET_ADMIN_METRICS_PREFERENCES_LOADING
    }

    const expectedState = {
      ...initialState,
      isLoaded: false,
      isLoading: true
    }

    expect(adminMetricsPreferencesReducer(undefined, action)).toEqual(expectedState)
  })
})

describe('SET_ADMIN_METRICS_PREFERENCES', () => {
  test('returns the correct state', () => {
    const payload = {
      preferences: {
        panelState: {
          open: '100% (2)'
        },
        granuleSort: {
          start_date: '50% (1)',
          '-start_date': '50% (1)'
        },
        granuleListView: {
          default: '100% (2)'
        },
        collectionSort: {
          '-score': '100% (2)'
        },
        collectionListView: {
          list: '50% (1)',
          default: '50% (1)'
        },
        zoom: {
          2: '100% (2)'
        },
        latitude: {
          0: '100% (2)'
        },
        longitude: {
          0: '100% (2)'
        },
        projection: {
          epsg4326: '100% (2)'
        },
        overlayLayers: {
          referenceFeatures: '100% (2)',
          referenceLabels: '100% (2)'
        },
        baseLayer: {
          blueMarble: '100% (2)'
        }
      }
    }
    const action = {
      type: SET_ADMIN_METRICS_PREFERENCES,
      payload
    }

    const expectedState = {
      ...initialState,
      preferences: {
        panelState: {
          open: '100% (2)'
        },
        granuleSort: {
          start_date: '50% (1)',
          '-start_date': '50% (1)'
        },
        granuleListView: {
          default: '100% (2)'
        },
        collectionSort: {
          '-score': '100% (2)'
        },
        collectionListView: {
          list: '50% (1)',
          default: '50% (1)'
        },
        zoom: {
          2: '100% (2)'
        },
        latitude: {
          0: '100% (2)'
        },
        longitude: {
          0: '100% (2)'
        },
        projection: {
          epsg4326: '100% (2)'
        },
        overlayLayers: {
          referenceFeatures: '100% (2)',
          referenceLabels: '100% (2)'
        },
        baseLayer: {
          blueMarble: '100% (2)'
        }
      }
    }

    expect(adminMetricsPreferencesReducer(undefined, action)).toEqual(expectedState)
  })
})
