import moxios from 'moxios'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import {
  submitOrder
} from '../orders'

const mockStore = configureMockStore([thunk])

beforeEach(() => {
  jest.clearAllMocks()
})

describe('submitOrder', () => {
  beforeEach(() => {
    moxios.install()

    jest.clearAllMocks()
  })

  afterEach(() => {
    moxios.uninstall()
  })

  test('calls lambda to submit an order', async () => {
    moxios.stubRequest(/orders.*/, {
      status: 200,
      response: {
        body: 'what should this look like?'
      },
      headers: {}
    })

    // mockStore with initialState
    const store = mockStore({
      authToken: 'mockToken',
      metadata: {
        collections: {
          allIds: ['collectionId'],
          byId: {
            collectionId: {
              granules: {},
              metadata: {}
            }
          }
        }
      },
      query: {
        collection: {
          pageNum: 1,
          keyword: 'search keyword'
        },
        granule: {
          pageNum: 1
        }
      },
      project: {
        byId: {
          collectionId: {
            accessMethods: {
              download: {
                type: 'download'
              }
            },
            selectedAccessMethod: 'download'
          }
        },
        collectionIds: ['collectionId']
      }
    })

    const consoleMock = jest.spyOn(console, 'log').mockImplementation(() => jest.fn())

    // call the dispatch
    await store.dispatch(submitOrder()).then(() => {
      expect(consoleMock).toHaveBeenCalledTimes(1)
    })
  })

  test('does not call updateCollectionResults on error', async () => {
    moxios.stubRequest(/orders.*/, {
      status: 500,
      response: {}
    })

    const store = mockStore({
      authToken: 'mockToken',
      metadata: {
        collections: {
          allIds: ['collectionId'],
          byId: {
            collectionId: {
              granules: {},
              metadata: {}
            }
          }
        }
      },
      query: {
        collection: {
          pageNum: 1,
          keyword: 'search keyword'
        },
        granule: {
          pageNum: 1
        }
      },
      project: {
        byId: {
          collectionId: {
            accessMethods: {
              download: {
                type: 'download'
              }
            },
            selectedAccessMethod: 'download'
          }
        },
        collectionIds: ['collectionId']
      }
    })

    const consoleMock = jest.spyOn(console, 'log').mockImplementation(() => jest.fn())

    await store.dispatch(submitOrder()).then(() => {
      expect(consoleMock).toHaveBeenCalledTimes(1)
    })
  })
})
