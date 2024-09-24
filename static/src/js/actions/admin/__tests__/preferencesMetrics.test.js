import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import nock from 'nock'

import actions from '../../index'
import {
  fetchAdminPreferencesMetrics,
  setAdminPreferencesMetrics,
  setAdminPreferencesMetricsLoaded,
  setAdminPreferencesMetricsLoading
} from '../preferencesMetrics'
import {
  SET_ADMIN_PREFERENCES_METRICS,
  SET_ADMIN_PREFERENCES_METRICS_LOADING,
  SET_ADMIN_PREFERENCES_METRICS_LOADED
} from '../../../constants/actionTypes'

const mockStore = configureMockStore([thunk])

beforeEach(() => {
  jest.clearAllMocks()
  jest.restoreAllMocks()
})

describe('setAdminPreferencesMetrics', () => {
  test('should create an action to set the admin preferences metrics data', () => {
    const payload = {
      mock: 'data'
    }

    const expectedAction = {
      type: SET_ADMIN_PREFERENCES_METRICS,
      payload
    }

    expect(setAdminPreferencesMetrics(payload)).toEqual(expectedAction)
  })
})

describe('setAdminPreferencesMetrics', () => {
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
      type: SET_ADMIN_PREFERENCES_METRICS,
      payload
    }

    expect(setAdminPreferencesMetrics(payload)).toEqual(expectedAction)
  })
})

describe('setAdminPreferencesMetricsLoading', () => {
  test('should create an action to update the admin metric preferences loading state', () => {
    const expectedAction = {
      type: SET_ADMIN_PREFERENCES_METRICS_LOADING
    }

    expect(setAdminPreferencesMetricsLoading()).toEqual(expectedAction)
  })
})

describe('setAdminPreferencesMetricsLoaded', () => {
  test('should create an action to update the admin preferences loaded state', () => {
    const expectedAction = {
      type: SET_ADMIN_PREFERENCES_METRICS_LOADED
    }

    expect(setAdminPreferencesMetricsLoaded()).toEqual(expectedAction)
  })
})

describe('setAdminPreferencesMetrics', () => {
  test('fetches the list of admin preferences metrics', async () => {
    const data = {
      results: [{ mock: 'data' }]
    }

    nock(/localhost/)
      .get(/admin\/preferences_metrics/)
      .reply(200, data)

    const store = mockStore({
      authToken: 'mockToken',
      admin: {
        isAuthorized: true,
        retrievalsMetrics: {
        }
      }
    })

    await store.dispatch(fetchAdminPreferencesMetrics()).then(() => {
      const storeActions = store.getActions()
      expect(storeActions[0]).toEqual({
        type: SET_ADMIN_PREFERENCES_METRICS_LOADING
      })

      expect(storeActions[1]).toEqual({
        type: SET_ADMIN_PREFERENCES_METRICS_LOADED
      })

      expect(storeActions[2]).toEqual({
        type: SET_ADMIN_PREFERENCES_METRICS,
        payload: data.results
      })
    })
  })

  test('calls handleError when there is an error', async () => {
    const handleErrorMock = jest.spyOn(actions, 'handleError')
    const consoleMock = jest.spyOn(console, 'error').mockImplementationOnce(() => jest.fn())

    nock(/localhost/)
      .get(/admin\/preferences_metrics/)
      .reply(500)

    nock(/localhost/)
      .post(/error_logger/)
      .reply(200)

    const store = mockStore({
      authToken: 'mockToken',
      admin: {
        isAuthorized: true,
        preferencesMetrics: {
        }
      }
    })

    await store.dispatch(fetchAdminPreferencesMetrics())

    const storeActions = store.getActions()
    expect(storeActions[0]).toEqual({
      type: SET_ADMIN_PREFERENCES_METRICS_LOADING
    })

    expect(handleErrorMock).toHaveBeenCalledTimes(1)
    expect(handleErrorMock).toHaveBeenCalledWith(expect.objectContaining({
      action: 'fetchAdminPreferencesMetrics',
      resource: 'admin preferences metrics'
    }))

    expect(consoleMock).toHaveBeenCalledTimes(1)
  })
})
