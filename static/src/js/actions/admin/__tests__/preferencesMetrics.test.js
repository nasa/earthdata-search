import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import nock from 'nock'

import actions from '../../index'
import {
  fetchAdminMetricsPreferences,
  setAdminMetricPreferences,
  setAdminMetricPreferencesLoaded,
  setAdminMetricPreferencesLoading
} from '../preferencesMetrics'
import {
  SET_ADMIN_METRICS_PREFERENCES,
  SET_ADMIN_METRICS_PREFERENCES_LOADING,
  SET_ADMIN_METRICS_PREFERENCES_LOADED
} from '../../../constants/actionTypes'

const mockStore = configureMockStore([thunk])

beforeEach(() => {
  jest.clearAllMocks()
  jest.restoreAllMocks()
})

describe('setAdminMetricPreferences', () => {
  test('should create an action to set the admin preferences metrics data', () => {
    const payload = {
      mock: 'data'
    }

    const expectedAction = {
      type: SET_ADMIN_METRICS_PREFERENCES,
      payload
    }

    expect(setAdminMetricPreferences(payload)).toEqual(expectedAction)
  })
})

describe('setAdminMetricPreferences', () => {
  test('should create an action to update the admin preferences metrics list', () => {
    const payload = [
      {
        mock: 'data'
      },
      {
        mock: 'more data'
      }
    ]

    const expectedAction = {
      type: SET_ADMIN_METRICS_PREFERENCES,
      payload
    }

    expect(setAdminMetricPreferences(payload)).toEqual(expectedAction)
  })
})

describe('setAdminMetricPreferencesLoading', () => {
  test('should create an action to update the admin metric preferences loading state', () => {
    const expectedAction = {
      type: SET_ADMIN_METRICS_PREFERENCES_LOADING
    }

    expect(setAdminMetricPreferencesLoading()).toEqual(expectedAction)
  })
})

describe('setAdminMetricPreferencesLoaded', () => {
  test('should create an action to update the admin preferences loaded state', () => {
    const expectedAction = {
      type: SET_ADMIN_METRICS_PREFERENCES_LOADED
    }

    expect(setAdminMetricPreferencesLoaded()).toEqual(expectedAction)
  })
})

describe('fetchAdminMetricsPreferences', () => {
  test('fetches the list of admin metrics preferences', async () => {
    const data = {
      results: [{ mock: 'data' }]
    }

    nock(/localhost/)
      .get(/admin\/preferencesMetrics/)
      .reply(200, data)

    const store = mockStore({
      authToken: 'mockToken',
      admin: {
        isAuthorized: true,
        metricsRetrievals: {
        }
      }
    })

    await store.dispatch(fetchAdminMetricsPreferences()).then(() => {
      const storeActions = store.getActions()
      expect(storeActions[0]).toEqual({
        type: SET_ADMIN_METRICS_PREFERENCES_LOADING
      })

      expect(storeActions[1]).toEqual({
        type: SET_ADMIN_METRICS_PREFERENCES_LOADED
      })

      expect(storeActions[2]).toEqual({
        type: SET_ADMIN_METRICS_PREFERENCES,
        payload: data.results
      })
    })
  })

  test('calls handleError when there is an error', async () => {
    const handleErrorMock = jest.spyOn(actions, 'handleError')
    const consoleMock = jest.spyOn(console, 'error').mockImplementationOnce(() => jest.fn())

    nock(/localhost/)
      .get(/admin\/preferencesMetrics/)
      .reply(500)

    nock(/localhost/)
      .post(/error_logger/)
      .reply(200)

    const store = mockStore({
      authToken: 'mockToken',
      admin: {
        isAuthorized: true,
        metricsPreferences: {
        }
      }
    })

    await store.dispatch(fetchAdminMetricsPreferences())

    const storeActions = store.getActions()
    expect(storeActions[0]).toEqual({
      type: SET_ADMIN_METRICS_PREFERENCES_LOADING
    })

    expect(handleErrorMock).toHaveBeenCalledTimes(1)
    expect(handleErrorMock).toHaveBeenCalledWith(expect.objectContaining({
      action: 'fetchAdminMetricsPreferences',
      resource: 'admin metrics preferences'
    }))

    expect(consoleMock).toHaveBeenCalledTimes(1)
  })
})
