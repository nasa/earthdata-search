import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import nock from 'nock'

import {
  fetchAdminRetrievalsMetrics,
  setAdminRetrievalsMetrics,
  setAdminRetrievalsMetricsLoaded,
  setAdminRetrievalsMetricsLoading,
  updateAdminRetrievalsMetricsEndDate,
  updateAdminRetrievalsMetricsStartDate
} from '../retrievalMetrics'
import {
  SET_ADMIN_RETRIEVALS_METRICS_LOADED,
  SET_ADMIN_RETRIEVALS_METRICS_LOADING,
  SET_ADMIN_RETRIEVALS_METRICS,
  UPDATE_ADMIN_RETRIEVALS_METRICS_END_DATE,
  UPDATE_ADMIN_RETRIEVALS_METRICS_START_DATE
} from '../../../constants/actionTypes'

import useEdscStore from '../../../zustand/useEdscStore'

const mockStore = configureMockStore([thunk])

beforeEach(() => {
  jest.clearAllMocks()
  jest.restoreAllMocks()
})

describe('setAdminRetrievalsMetrics', () => {
  test('should create an action to set the admin retrievals metrics data', () => {
    const payload = {
      mock: 'data'
    }

    const expectedAction = {
      type: SET_ADMIN_RETRIEVALS_METRICS,
      payload
    }

    expect(setAdminRetrievalsMetrics(payload)).toEqual(expectedAction)
  })
})

describe('setAdminRetrievalsMetrics', () => {
  test('should create an action to update the admin retrievals metrics list', () => {
    const payload = [
      {
        mock: 'data'
      },
      {
        mock: 'more data'
      }
    ]

    const expectedAction = {
      type: SET_ADMIN_RETRIEVALS_METRICS,
      payload
    }

    expect(setAdminRetrievalsMetrics(payload)).toEqual(expectedAction)
  })
})

describe('setAdminRetrievalsMetricsLoading', () => {
  test('should create an action to update the admin metric retrievals loading state', () => {
    const expectedAction = {
      type: SET_ADMIN_RETRIEVALS_METRICS_LOADING
    }

    expect(setAdminRetrievalsMetricsLoading()).toEqual(expectedAction)
  })
})

describe('setAdminRetrievalsMetricsLoaded', () => {
  test('should create an action to update the admin retrievals loaded state', () => {
    const expectedAction = {
      type: SET_ADMIN_RETRIEVALS_METRICS_LOADED
    }

    expect(setAdminRetrievalsMetricsLoaded()).toEqual(expectedAction)
  })
})

describe('updateAdminRetrievalsMetricsStartDate', () => {
  test('should create an action to update the start_date', () => {
    const startDate = 'mock-start-date'
    const store = mockStore({
      admin: {
        retrievals: {
          startDate: 'previous-mock-start-date'
        }
      }
    })

    // Call the dispatch
    store.dispatch(updateAdminRetrievalsMetricsStartDate(startDate))

    const storeActions = store.getActions()
    expect(storeActions[0]).toEqual({
      type: UPDATE_ADMIN_RETRIEVALS_METRICS_START_DATE,
      payload: startDate
    })
  })
})

describe('updateAdminRetrievalsMetricsEndDate', () => {
  test('should create an action to update the end_date', () => {
    const endDate = 'mock-date'
    const store = mockStore({
      admin: {
        retrievals: {
          endDate: 'previous-mock-end-date'
        }
      }
    })

    // Call the dispatch
    store.dispatch(updateAdminRetrievalsMetricsEndDate(endDate))

    const storeActions = store.getActions()
    expect(storeActions[0]).toEqual({
      type: UPDATE_ADMIN_RETRIEVALS_METRICS_END_DATE,
      payload: endDate
    })
  })
})

describe('fetchAdminRetrievalsMetrics', () => {
  test('fetches the list of admin metrics retrievals', async () => {
    const data = {
      results: [{ mock: 'data' }]
    }

    nock(/localhost/)
      .get(/admin\/retrievals_metrics/)
      .reply(200, data)

    const store = mockStore({
      authToken: 'mockToken',
      admin: {
        isAuthorized: true,
        retrievalsMetrics: {
        }
      }
    })

    await store.dispatch(fetchAdminRetrievalsMetrics()).then(() => {
      const storeActions = store.getActions()
      expect(storeActions[0]).toEqual({
        type: SET_ADMIN_RETRIEVALS_METRICS_LOADING
      })

      expect(storeActions[1]).toEqual({
        type: SET_ADMIN_RETRIEVALS_METRICS_LOADED
      })

      expect(storeActions[2]).toEqual({
        type: SET_ADMIN_RETRIEVALS_METRICS,
        payload: data.results
      })
    })
  })

  test('calls handleError when there is an error', async () => {
    useEdscStore.setState((state) => {
      // eslint-disable-next-line no-param-reassign
      state.errors.handleError = jest.fn()
    })

    nock(/localhost/)
      .get(/admin\/retrievals_metrics/)
      .reply(500)

    nock(/localhost/)
      .post(/error_logger/)
      .reply(200)

    const store = mockStore({
      authToken: 'mockToken',
      admin: {
        isAuthorized: true,
        retrievalsMetrics: {
        }
      }
    })

    await store.dispatch(fetchAdminRetrievalsMetrics())

    const storeActions = store.getActions()
    expect(storeActions[0]).toEqual({
      type: SET_ADMIN_RETRIEVALS_METRICS_LOADING
    })

    const { errors } = useEdscStore.getState()
    expect(errors.handleError).toHaveBeenCalledTimes(1)
    expect(errors.handleError).toHaveBeenCalledWith(expect.objectContaining({
      action: 'fetchAdminRetrievalsMetrics',
      resource: 'admin retrievals metrics'
    }))
  })
})
