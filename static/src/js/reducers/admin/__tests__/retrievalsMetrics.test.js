import {
  SET_ADMIN_METRICS_RETRIEVALS,
  SET_ADMIN_METRICS_RETRIEVALS_LOADING,
  SET_ADMIN_METRICS_RETRIEVALS_LOADED,
  UPDATE_ADMIN_METRICS_RETRIEVALS_START_DATE,
  UPDATE_ADMIN_METRICS_RETRIEVALS_END_DATE
} from '../../../constants/actionTypes'

import adminRetrievalsMetricsReducer from '../retrievalsMetrics'

const initialState = {
  allAccessMethodTypes: [],
  accessMethodType: {},
  multCollectionResponse: [],
  isLoading: false,
  isLoaded: false,
  startDate: '',
  endDate: ''
}

describe('INITIAL_STATE', () => {
  test('is correct', () => {
    const action = { type: 'dummy_action' }

    expect(adminRetrievalsMetricsReducer(undefined, action)).toEqual(initialState)
  })
})

describe('SET_ADMIN_METRICS_RETRIEVALS_LOADED', () => {
  test('returns the correct state', () => {
    const action = {
      type: SET_ADMIN_METRICS_RETRIEVALS_LOADED
    }

    const expectedState = {
      ...initialState,
      isLoaded: true,
      isLoading: false
    }

    expect(adminRetrievalsMetricsReducer(undefined, action)).toEqual(expectedState)
  })
})

describe('SET_ADMIN_METRICS_RETRIEVALS_LOADING', () => {
  test('returns the correct state', () => {
    const action = {
      type: SET_ADMIN_METRICS_RETRIEVALS_LOADING
    }

    const expectedState = {
      ...initialState,
      isLoaded: false,
      isLoading: true
    }

    expect(adminRetrievalsMetricsReducer(undefined, action)).toEqual(expectedState)
  })
})

describe('SET_ADMIN_RETRIEVALS', () => {
  test('returns the correct state', () => {
    const payload = {
      retrievalResponse: [
        {
          access_method_type: 'Harmony',
          total_times_access_method_used: '1',
          average_granule_count: '59416',
          average_granule_link_count: null,
          total_granules_retrieved: '59416',
          max_granule_link_count: null,
          min_granule_link_count: null
        },
        {
          access_method_type: 'download',
          total_times_access_method_used: '135',
          average_granule_count: '188',
          average_granule_link_count: '9',
          total_granules_retrieved: '25326',
          max_granule_link_count: 167,
          min_granule_link_count: 0
        }
      ],
      multCollectionResponse: [
        {
          retrieval_id: 112,
          count: '2'
        }
      ]
    }
    const action = {
      type: SET_ADMIN_METRICS_RETRIEVALS,
      payload
    }

    const expectedState = {
      ...initialState,
      byAccessMethodType: {
        Harmony: {
          access_method_type: 'Harmony',
          average_granule_count: '59416',
          average_granule_link_count: null,
          max_granule_link_count: null,
          min_granule_link_count: null,
          total_granules_retrieved: '59416',
          total_times_access_method_used: '1'
        },
        download:
        {
          access_method_type: 'download',
          average_granule_count: '188',
          average_granule_link_count: '9',
          max_granule_link_count: 167,
          min_granule_link_count: 0,
          total_granules_retrieved: '25326',
          total_times_access_method_used: '135'
        }
      },
      allAccessMethodTypes: ['Harmony', 'download'],
      multCollectionResponse: [
        {
          retrieval_id: 112,
          count: '2'
        }
      ]
    }

    expect(adminRetrievalsMetricsReducer(undefined, action)).toEqual(expectedState)
  })
})

describe('UPDATE_ADMIN_METRICS_RETRIEVALS_START_DATE', () => {
  test('returns the correct state', () => {
    const payload = '2022-09-28 20:32:08.666525'

    const action = {
      type: UPDATE_ADMIN_METRICS_RETRIEVALS_START_DATE,
      payload
    }

    const expectedState = {
      ...initialState,
      startDate: payload
    }

    expect(adminRetrievalsMetricsReducer(undefined, action)).toEqual(expectedState)
  })
})

describe('UPDATE_ADMIN_METRICS_RETRIEVALS_END_DATE', () => {
  test('returns the correct state', () => {
    const payload = '2023-09-28 20:32:08.666525'

    const action = {
      type: UPDATE_ADMIN_METRICS_RETRIEVALS_END_DATE,
      payload
    }

    const expectedState = {
      ...initialState,
      endDate: payload
    }

    expect(adminRetrievalsMetricsReducer(undefined, action)).toEqual(expectedState)
  })
})
