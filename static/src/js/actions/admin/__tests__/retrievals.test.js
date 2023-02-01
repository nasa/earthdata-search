import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import nock from 'nock'

import * as addToast from '../../../util/addToast'
import actions from '../../index'
import {
  setAdminRetrieval,
  setAdminRetrievals,
  setAdminRetrievalLoading,
  setAdminRetrievalLoaded,
  setAdminRetrievalsLoading,
  setAdminRetrievalsLoaded,
  setAdminRetrievalsPagination,
  fetchAdminRetrieval,
  fetchAdminRetrievals,
  adminViewRetrieval,
  updateAdminRetrievalsSortKey,
  updateAdminRetrievalsPageNum,
  requeueOrder
} from '../retrievals'
import {
  SET_ADMIN_RETRIEVAL,
  SET_ADMIN_RETRIEVALS,
  SET_ADMIN_RETRIEVAL_LOADING,
  SET_ADMIN_RETRIEVAL_LOADED,
  SET_ADMIN_RETRIEVALS_LOADING,
  SET_ADMIN_RETRIEVALS_LOADED,
  SET_ADMIN_RETRIEVALS_PAGINATION,
  UPDATE_ADMIN_RETRIEVALS_SORT_KEY,
  UPDATE_ADMIN_RETRIEVALS_PAGE_NUM
} from '../../../constants/actionTypes'

const mockStore = configureMockStore([thunk])

beforeEach(() => {
  jest.clearAllMocks()
  jest.restoreAllMocks()
})

describe('setAdminRetrieval', () => {
  test('should create an action to set the admin retrieval data', () => {
    const payload = {
      mock: 'data'
    }

    const expectedAction = {
      type: SET_ADMIN_RETRIEVAL,
      payload
    }

    expect(setAdminRetrieval(payload)).toEqual(expectedAction)
  })
})

describe('setAdminRetrievals', () => {
  test('should create an action to update the admin retrievals list', () => {
    const payload = [
      {
        mock: 'data'
      },
      {
        mock: 'more data'
      }
    ]

    const expectedAction = {
      type: SET_ADMIN_RETRIEVALS,
      payload
    }

    expect(setAdminRetrievals(payload)).toEqual(expectedAction)
  })
})

describe('setAdminRetrievalsLoading', () => {
  test('should create an action to update the admin retrievals loading state', () => {
    const expectedAction = {
      type: SET_ADMIN_RETRIEVALS_LOADING
    }

    expect(setAdminRetrievalsLoading()).toEqual(expectedAction)
  })
})

describe('setAdminRetrievalsLoaded', () => {
  test('should create an action to update the admin retrievals loaded state', () => {
    const expectedAction = {
      type: SET_ADMIN_RETRIEVALS_LOADED
    }

    expect(setAdminRetrievalsLoaded()).toEqual(expectedAction)
  })
})

describe('setAdminRetrievalLoading', () => {
  test('should create an action to update an admin retrieval loading state', () => {
    const payload = 123

    const expectedAction = {
      type: SET_ADMIN_RETRIEVAL_LOADING,
      payload
    }

    expect(setAdminRetrievalLoading(123)).toEqual(expectedAction)
  })
})

describe('setAdminRetrievalLoaded', () => {
  test('should create an action to update an admin retrieval loaded state', () => {
    const payload = 123

    const expectedAction = {
      type: SET_ADMIN_RETRIEVAL_LOADED,
      payload
    }

    expect(setAdminRetrievalLoaded(123)).toEqual(expectedAction)
  })
})

describe('setAdminRetrievalsPagination', () => {
  test('should create an action to update the admin retrievals pagination state', () => {
    const payload = {
      mock: 'data'
    }

    const expectedAction = {
      type: SET_ADMIN_RETRIEVALS_PAGINATION,
      payload
    }

    expect(setAdminRetrievalsPagination(payload)).toEqual(expectedAction)
  })
})

describe('fetchAdminRetrieval', () => {
  test('fetches a single admin retrieval', async () => {
    const data = {
      mock: 'data'
    }

    nock(/localhost/)
      .get(/admin\/retrieval/)
      .reply(200, data)

    const id = 123

    const store = mockStore({
      authToken: 'mockToken',
      admin: {
        isAuthorized: true
      }
    })

    await store.dispatch(fetchAdminRetrieval(id)).then(() => {
      const storeActions = store.getActions()
      expect(storeActions[0]).toEqual({
        type: SET_ADMIN_RETRIEVAL_LOADING,
        payload: id
      })
      expect(storeActions[1]).toEqual({
        type: SET_ADMIN_RETRIEVAL_LOADED,
        payload: id
      })
      expect(storeActions[2]).toEqual({
        type: SET_ADMIN_RETRIEVAL,
        payload: data
      })
    })
  })

  test('calls handleError when there is an error', async () => {
    const handleErrorMock = jest.spyOn(actions, 'handleError')
    const consoleMock = jest.spyOn(console, 'error').mockImplementationOnce(() => jest.fn())

    const id = 123

    nock(/localhost/)
      .get(/admin\/retrieval/)
      .reply(500)

    nock(/localhost/)
      .post(/error_logger/)
      .reply(200)

    const store = mockStore({
      authToken: 'mockToken',
      admin: {
        isAuthorized: true
      }
    })

    await store.dispatch(fetchAdminRetrieval(id))

    const storeActions = store.getActions()
    expect(storeActions[0]).toEqual({
      type: SET_ADMIN_RETRIEVAL_LOADING,
      payload: id
    })

    expect(handleErrorMock).toHaveBeenCalledTimes(1)
    expect(handleErrorMock).toHaveBeenCalledWith(expect.objectContaining({
      action: 'fetchAdminRetrieval',
      resource: 'admin retrieval'
    }))

    expect(consoleMock).toHaveBeenCalledTimes(1)
  })
})

describe('fetchAdminRetrievals', () => {
  test('fetches the list of admin retrievals', async () => {
    const data = {
      pagination: {
        pageNum: 1,
        pageSize: 20,
        pageCount: 1,
        totalResults: 1
      },
      results: [{ mock: 'data' }]
    }

    nock(/localhost/)
      .get(/admin\/retrieval/)
      .reply(200, data)

    const store = mockStore({
      authToken: 'mockToken',
      admin: {
        isAuthorized: true,
        retrievals: {
          sortKey: '-created_at',
          pagination: {
            pageNum: 1,
            pageSize: 20
          }
        }
      }
    })

    await store.dispatch(fetchAdminRetrievals()).then(() => {
      const storeActions = store.getActions()
      expect(storeActions[0]).toEqual({
        type: SET_ADMIN_RETRIEVALS_LOADING
      })
      expect(storeActions[1]).toEqual({
        type: SET_ADMIN_RETRIEVALS_LOADED
      })
      expect(storeActions[2]).toEqual({
        type: SET_ADMIN_RETRIEVALS_PAGINATION,
        payload: data.pagination
      })
      expect(storeActions[3]).toEqual({
        type: SET_ADMIN_RETRIEVALS,
        payload: data.results
      })
    })
  })

  test('calls handleError when there is an error', async () => {
    const handleErrorMock = jest.spyOn(actions, 'handleError')
    const consoleMock = jest.spyOn(console, 'error').mockImplementationOnce(() => jest.fn())

    nock(/localhost/)
      .get(/admin\/retrieval/)
      .reply(500)

    nock(/localhost/)
      .post(/error_logger/)
      .reply(200)

    const store = mockStore({
      authToken: 'mockToken',
      admin: {
        isAuthorized: true,
        retrievals: {
          sortKey: '-created_at',
          pagination: {
            pageNum: 1,
            pageSize: 20
          }
        }
      }
    })

    await store.dispatch(fetchAdminRetrievals())

    const storeActions = store.getActions()
    expect(storeActions[0]).toEqual({
      type: SET_ADMIN_RETRIEVALS_LOADING
    })

    expect(handleErrorMock).toHaveBeenCalledTimes(1)
    expect(handleErrorMock).toHaveBeenCalledWith(expect.objectContaining({
      action: 'fetchAdminRetrievals',
      resource: 'admin retrievals'
    }))

    expect(consoleMock).toHaveBeenCalledTimes(1)
  })
})

describe('adminViewRetrieval', () => {
  test('should create an action to change the URL', () => {
    const store = mockStore({
      router: {
        location: {
          pathname: '/admin'
        }
      }
    })

    store.dispatch(adminViewRetrieval(123))

    const storeActions = store.getActions()
    expect(storeActions[0]).toEqual({
      payload: {
        args: [
          {
            pathname: '/admin/retrievals/123'
          }
        ],
        method: 'push'
      },
      type: '@@router/CALL_HISTORY_METHOD'
    })
  })
})

describe('updateAdminRetrievalsSortKey', () => {
  test('should create an action to update the sort key and call fetchAdminRetrievals', () => {
    const sortKey = '+username'

    const fetchAdminRetrievalsMock = jest.spyOn(actions, 'fetchAdminRetrievals')
    fetchAdminRetrievalsMock.mockImplementation(() => jest.fn())

    const store = mockStore({
      admin: {
        retrievals: {
          sortKey: '-created_at'
        }
      }
    })

    // call the dispatch
    store.dispatch(updateAdminRetrievalsSortKey(sortKey))

    // Is updateFeatureFacet called with the right payload
    const storeActions = store.getActions()
    expect(storeActions[0]).toEqual({
      type: UPDATE_ADMIN_RETRIEVALS_SORT_KEY,
      payload: sortKey
    })

    expect(fetchAdminRetrievalsMock).toHaveBeenCalledTimes(1)
  })
})

describe('updateAdminRetrievalsPageNum', () => {
  test('should create an action to update the page num and call fetchAdminRetrievals', () => {
    const pageNum = 2

    const fetchAdminRetrievalsMock = jest.spyOn(actions, 'fetchAdminRetrievals')
    fetchAdminRetrievalsMock.mockImplementation(() => jest.fn())

    const store = mockStore({
      admin: {
        retrievals: {
          pagination: {
            pageNum: 1
          }
        }
      }
    })

    // call the dispatch
    store.dispatch(updateAdminRetrievalsPageNum(pageNum))

    // Is updateFeatureFacet called with the right payload
    const storeActions = store.getActions()
    expect(storeActions[0]).toEqual({
      type: UPDATE_ADMIN_RETRIEVALS_PAGE_NUM,
      payload: pageNum
    })

    expect(fetchAdminRetrievalsMock).toHaveBeenCalledTimes(1)
  })
})

describe('requeueOrder', () => {
  test('sends request to requeue order', async () => {
    const addToastMock = jest.spyOn(addToast, 'addToast')

    const orderId = 1234

    nock(/localhost/)
      .post(/requeue/)
      .reply(200)

    const store = mockStore({
      authToken: 'mockToken'
    })

    await store.dispatch(requeueOrder(orderId))

    expect(addToastMock).toHaveBeenCalledTimes(1)
    expect(addToastMock).toHaveBeenCalledWith(
      'Order Requeued for processing',
      {
        appearance: 'success',
        autoDismiss: true
      }
    )
  })

  test('calls handleError when there is an error', async () => {
    const handleErrorMock = jest.spyOn(actions, 'handleError')
    const consoleMock = jest.spyOn(console, 'error').mockImplementationOnce(() => jest.fn())

    const orderId = 1234

    nock(/localhost/)
      .post(/requeue/)
      .reply(500)

    nock(/localhost/)
      .post(/error_logger/)
      .reply(200)

    const store = mockStore({
      authToken: 'mockToken'
    })

    await store.dispatch(requeueOrder(orderId))

    expect(handleErrorMock).toHaveBeenCalledTimes(1)
    expect(handleErrorMock).toHaveBeenCalledWith(expect.objectContaining({
      action: 'requeueOrder',
      notificationType: 'toast',
      resource: 'admin retrievals'
    }))

    expect(consoleMock).toHaveBeenCalledTimes(1)
  })
})
