import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import nock from 'nock'

import actions from '../../index'
import {
  fetchAdminMetricsRetrievals,
  setAdminMetricRetrievals,
  setAdminMetricRetrievalsLoaded,
  setAdminMetricRetrievalsLoading,
  updateAdminMetricsRetrievalsEndDate,
  updateAdminMetricsRetrievalsStartDate
} from '../retrievalMetrics'
import {
  SET_ADMIN_METRICS_RETRIEVALS_LOADED,
  SET_ADMIN_METRICS_RETRIEVALS_LOADING,
  SET_ADMIN_METRICS_RETRIEVALS,
  UPDATE_ADMIN_METRICS_RETRIEVALS_END_DATE,
  UPDATE_ADMIN_METRICS_RETRIEVALS_START_DATE
} from '../../../constants/actionTypes'

const mockStore = configureMockStore([thunk])

beforeEach(() => {
  jest.clearAllMocks()
  jest.restoreAllMocks()
})

describe('setAdminRetrieval', () => {
  test('should create an action to set the admin retrievals metrics data', () => {
    const payload = {
      mock: 'data'
    }

    const expectedAction = {
      type: SET_ADMIN_METRICS_RETRIEVALS,
      payload
    }

    expect(setAdminMetricRetrievals(payload)).toEqual(expectedAction)
  })
})

describe('setAdminRetrievals', () => {
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
      type: SET_ADMIN_METRICS_RETRIEVALS,
      payload
    }

    expect(setAdminMetricRetrievals(payload)).toEqual(expectedAction)
  })
})

describe('setAdminRetrievalsLoading', () => {
  test('should create an action to update the admin metric retrievals loading state', () => {
    const expectedAction = {
      type: SET_ADMIN_METRICS_RETRIEVALS_LOADING
    }

    expect(setAdminMetricRetrievalsLoading()).toEqual(expectedAction)
  })
})

describe('setAdminMetricsRetrievalsLoaded', () => {
  test('should create an action to update the admin retrievals loaded state', () => {
    const expectedAction = {
      type: SET_ADMIN_METRICS_RETRIEVALS_LOADED
    }

    expect(setAdminMetricRetrievalsLoaded()).toEqual(expectedAction)
  })
})

// describe('setAdminRetrievalsMetricsStartDate', () => {
//   test('should create an action to update the admin retrievals start date state', () => {
//     const payload = {
//       mock: 'data'
//     }

//     const expectedAction = {
//       type: UPDATE_ADMIN_METRICS_RETRIEVALS_START_DATE,
//       payload
//     }

//     expect(updateAdminMetricsRetrievalsStartDate(payload)).toEqual(expectedAction)
//   })
// })

// describe('setAdminRetrievalsMetricsStartDate', () => {
//   test('should create an action to update the admin retrievals end date state', () => {
//     const payload = {
//       mock: 'data'
//     }

//     const expectedAction = {
//       type: UPDATE_ADMIN_METRICS_RETRIEVALS_END_DATE,
//       payload
//     }

//     expect(updateAdminMetricsRetrievalsEndDate(payload)).toEqual(expectedAction)
//   })
// })

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

    // call the dispatch
    store.dispatch(updateAdminMetricsRetrievalsStartDate(startDate))

    const storeActions = store.getActions()
    expect(storeActions[0]).toEqual({
      type: UPDATE_ADMIN_METRICS_RETRIEVALS_START_DATE,
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

    // call the dispatch
    store.dispatch(updateAdminMetricsRetrievalsEndDate(endDate))

    const storeActions = store.getActions()
    expect(storeActions[0]).toEqual({
      type: UPDATE_ADMIN_METRICS_RETRIEVALS_END_DATE,
      payload: endDate
    })
  })
})

// describe('fetchAdminMetricsRetrievals', () => {
//   test('fetches a single admin retrieval', async () => {
//     const data = {
//       mock: 'data'
//     }

//     nock(/localhost/)
//       .get(/admin\/retrievalsMetrics/)
//       .reply(200, data)

//     const id = 123

//     const store = mockStore({
//       authToken: 'mockToken',
//       admin: {
//         isAuthorized: true,
//         metricsRetrievals: {}
//       }
//     })

//     await store.dispatch(fetchAdminRetrieval(id)).then(() => {
//       const storeActions = store.getActions()
//       expect(storeActions[0]).toEqual({
//         type: SET_ADMIN_METRICS_RETRIEVALS_LOADING,
//         payload: id
//       })
//       expect(storeActions[1]).toEqual({
//         type: SET_ADMIN_RETRIEVAL_LOADED,
//         payload: id
//       })
//       expect(storeActions[2]).toEqual({
//         type: SET_ADMIN_RETRIEVAL,
//         payload: data
//       })
//     })
//   })

//   test('calls handleError when there is an error', async () => {
//     const handleErrorMock = jest.spyOn(actions, 'handleError')
//     const consoleMock = jest.spyOn(console, 'error').mockImplementationOnce(() => jest.fn())

//     const id = 123

//     nock(/localhost/)
//       .get(/admin\/retrieval/)
//       .reply(500)

//     nock(/localhost/)
//       .post(/error_logger/)
//       .reply(200)

//     const store = mockStore({
//       authToken: 'mockToken',
//       admin: {
//         isAuthorized: true
//       }
//     })

//     await store.dispatch(fetchAdminRetrieval(id))

//     const storeActions = store.getActions()
//     expect(storeActions[0]).toEqual({
//       type: SET_ADMIN_RETRIEVAL_LOADING,
//       payload: id
//     })

//     expect(handleErrorMock).toHaveBeenCalledTimes(1)
//     expect(handleErrorMock).toHaveBeenCalledWith(expect.objectContaining({
//       action: 'fetchAdminRetrieval',
//       resource: 'admin retrieval'
//     }))

//     expect(consoleMock).toHaveBeenCalledTimes(1)
//   })
// })

describe('fetchAdminRetrfetchAdminMetricsRetrievalsievals', () => {
  test('fetches the list of admin metrics retrievals', async () => {
    const data = {
      results: [{ mock: 'data' }]
    }

    nock(/localhost/)
      .get(/admin\/retrievalsMetrics/)
      .reply(200, data)

    const store = mockStore({
      authToken: 'mockToken',
      admin: {
        isAuthorized: true,
        metricsRetrievals: {
        }
      }
    })

    await store.dispatch(fetchAdminMetricsRetrievals()).then(() => {
      const storeActions = store.getActions()
      expect(storeActions[0]).toEqual({
        type: SET_ADMIN_METRICS_RETRIEVALS_LOADING
      })
      expect(storeActions[1]).toEqual({
        type: SET_ADMIN_METRICS_RETRIEVALS_LOADED
      })
      expect(storeActions[2]).toEqual({
        type: SET_ADMIN_METRICS_RETRIEVALS,
        payload: data.results
      })
    })
  })

  test('calls handleError when there is an error', async () => {
    const handleErrorMock = jest.spyOn(actions, 'handleError')
    const consoleMock = jest.spyOn(console, 'error').mockImplementationOnce(() => jest.fn())

    nock(/localhost/)
      .get(/admin\/retrievalsMetrics/)
      .reply(500)

    nock(/localhost/)
      .post(/error_logger/)
      .reply(200)

    const store = mockStore({
      authToken: 'mockToken',
      admin: {
        isAuthorized: true,
        metricsRetrievals: {
        }
      }
    })

    await store.dispatch(fetchAdminMetricsRetrievals())

    const storeActions = store.getActions()
    expect(storeActions[0]).toEqual({
      type: SET_ADMIN_METRICS_RETRIEVALS_LOADING
    })

    expect(handleErrorMock).toHaveBeenCalledTimes(1)
    expect(handleErrorMock).toHaveBeenCalledWith(expect.objectContaining({
      action: 'fetchAdminMetricsRetrievals',
      resource: 'admin metrics retrievals'
    }))

    expect(consoleMock).toHaveBeenCalledTimes(1)
  })
})

// describe('adminViewRetrieval', () => {
//   test('should create an action to change the URL', () => {
//     const store = mockStore({
//       router: {
//         location: {
//           pathname: '/admin'
//         }
//       }
//     })

//     store.dispatch(adminViewRetrieval(123))

//     const storeActions = store.getActions()
//     expect(storeActions[0]).toEqual({
//       payload: {
//         args: [
//           {
//             pathname: '/admin/retrievals/123'
//           }
//         ],
//         method: 'push'
//       },
//       type: '@@router/CALL_HISTORY_METHOD'
//     })
//   })
// })

// describe('updateAdminRetrievalsSortKey', () => {
//   test('should create an action to update the sort key and call fetchAdminRetrievals', () => {
//     const sortKey = '+username'

//     const fetchAdminRetrievalsMock = jest.spyOn(actions, 'fetchAdminRetrievals')
//     fetchAdminRetrievalsMock.mockImplementation(() => jest.fn())

//     const store = mockStore({
//       admin: {
//         retrievals: {
//           sortKey: '-created_at'
//         }
//       }
//     })

//     // call the dispatch
//     store.dispatch(updateAdminRetrievalsSortKey(sortKey))

//     // Is updateFeatureFacet called with the right payload
//     const storeActions = store.getActions()
//     expect(storeActions[0]).toEqual({
//       type: UPDATE_ADMIN_RETRIEVALS_SORT_KEY,
//       payload: sortKey
//     })

//     expect(fetchAdminRetrievalsMock).toHaveBeenCalledTimes(1)
//   })
// })

// describe('updateAdminRetrievalsPageNum', () => {
//   test('should create an action to update the page num and call fetchAdminRetrievals', () => {
//     const pageNum = 2

//     const fetchAdminRetrievalsMock = jest.spyOn(actions, 'fetchAdminRetrievals')
//     fetchAdminRetrievalsMock.mockImplementation(() => jest.fn())

//     const store = mockStore({
//       admin: {
//         retrievals: {
//           pagination: {
//             pageNum: 1
//           }
//         }
//       }
//     })

//     // call the dispatch
//     store.dispatch(updateAdminRetrievalsPageNum(pageNum))

//     // Is updateFeatureFacet called with the right payload
//     const storeActions = store.getActions()
//     expect(storeActions[0]).toEqual({
//       type: UPDATE_ADMIN_RETRIEVALS_PAGE_NUM,
//       payload: pageNum
//     })

//     expect(fetchAdminRetrievalsMock).toHaveBeenCalledTimes(1)
//   })
// })

// describe('requeueOrder', () => {
//   test('sends request to requeue order', async () => {
//     const addToastMock = jest.spyOn(addToast, 'addToast')

//     const orderId = 1234

//     nock(/localhost/)
//       .post(/requeue/)
//       .reply(200)

//     const store = mockStore({
//       authToken: 'mockToken'
//     })

//     await store.dispatch(requeueOrder(orderId))

//     expect(addToastMock).toHaveBeenCalledTimes(1)
//     expect(addToastMock).toHaveBeenCalledWith(
//       'Order Requeued for processing',
//       {
//         appearance: 'success',
//         autoDismiss: true
//       }
//     )
//   })

//   test('calls handleError when there is an error', async () => {
//     const handleErrorMock = jest.spyOn(actions, 'handleError')
//     const consoleMock = jest.spyOn(console, 'error').mockImplementationOnce(() => jest.fn())

//     const orderId = 1234

//     nock(/localhost/)
//       .post(/requeue/)
//       .reply(500)

//     nock(/localhost/)
//       .post(/error_logger/)
//       .reply(200)

//     const store = mockStore({
//       authToken: 'mockToken'
//     })

//     await store.dispatch(requeueOrder(orderId))

//     expect(handleErrorMock).toHaveBeenCalledTimes(1)
//     expect(handleErrorMock).toHaveBeenCalledWith(expect.objectContaining({
//       action: 'requeueOrder',
//       notificationType: 'toast',
//       resource: 'admin retrievals'
//     }))

//     expect(consoleMock).toHaveBeenCalledTimes(1)
//   })
// })
