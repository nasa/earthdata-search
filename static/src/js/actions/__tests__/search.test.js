import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import actions from '../index'
import { updateCollectionQuery } from '../search'
import {
  CLEAR_FILTERS,
  CLEAR_SHAPEFILE,
  REMOVE_SUBSCRIPTION_DISABLED_FIELDS,
  TOGGLE_DRAWING_NEW_LAYER,
  UPDATE_COLLECTION_QUERY,
  UPDATE_GRANULE_SEARCH_QUERY,
  UPDATE_REGION_QUERY
} from '../../constants/actionTypes'

const mockStore = configureMockStore([thunk])

beforeEach(() => {
  jest.clearAllMocks()
})

describe('updateCollectionQuery', () => {
  test('should create an action to update the search query', () => {
    const payload = {
      keyword: 'new keyword',
      pageNum: 1,
      spatial: {
        point: '0,0'
      }
    }
    const expectedAction = {
      type: UPDATE_COLLECTION_QUERY,
      payload
    }
    expect(updateCollectionQuery(payload)).toEqual(expectedAction)
  })
})

describe('changeQuery', () => {
  test('should update the search query and call getCollections', () => {
    const newQuery = {
      collection: {
        keyword: 'new keyword',
        spatial: {
          point: '0,0'
        },
        temporal: {}
      }
    }

    // mock getCollections
    const getCollectionsMock = jest.spyOn(actions, 'getCollections')
    getCollectionsMock.mockImplementation(() => jest.fn())

    // mockStore with initialState
    const store = mockStore({
      focusedCollection: '',
      query: {
        collection: {
          keyword: 'old stuff',
          spatial: {}
        }
      },
      project: {},
      router: {
        location: {
          pathname: ''
        }
      }
    })

    // call the dispatch
    store.dispatch(actions.changeQuery({ ...newQuery }))

    const storeActions = store.getActions()
    expect(storeActions[0]).toEqual({
      type: UPDATE_COLLECTION_QUERY,
      payload: {
        keyword: 'new keyword',
        pageNum: 1,
        spatial: {
          point: '0,0'
        },
        temporal: {}
      }
    })
    expect(storeActions[1]).toEqual({
      type: REMOVE_SUBSCRIPTION_DISABLED_FIELDS
    })

    // was getCollections called
    expect(getCollectionsMock).toHaveBeenCalledTimes(1)
  })

  test('should update the updateGranuleSearchQuery when a collection is focused', () => {
    const newQuery = {
      collection: {
        keyword: 'new keyword',
        spatial: {
          point: '0,0'
        },
        temporal: {}
      }
    }

    // mock getCollections
    const getCollectionsMock = jest.spyOn(actions, 'getCollections')
    getCollectionsMock.mockImplementation(() => jest.fn())
    const getSearchGranulesMock = jest.spyOn(actions, 'getSearchGranules')
    getSearchGranulesMock.mockImplementation(() => jest.fn())

    // mockStore with initialState
    const store = mockStore({
      focusedCollection: 'C10000-EDSC',
      query: {
        collection: {
          keyword: 'old stuff',
          spatial: {}
        }
      },
      project: {},
      router: {
        location: {
          pathname: ''
        }
      }
    })

    // call the dispatch
    store.dispatch(actions.changeQuery({ ...newQuery }))

    const storeActions = store.getActions()
    expect(storeActions[0]).toEqual({
      type: UPDATE_COLLECTION_QUERY,
      payload: {
        keyword: 'new keyword',
        pageNum: 1,
        spatial: {
          point: '0,0'
        },
        temporal: {}
      }
    })
    expect(storeActions[1]).toEqual({
      type: UPDATE_GRANULE_SEARCH_QUERY,
      payload: {
        collectionId: 'C10000-EDSC',
        pageNum: 1
      }
    })
    expect(storeActions[2]).toEqual({
      type: REMOVE_SUBSCRIPTION_DISABLED_FIELDS
    })

    // was getCollections called
    expect(getCollectionsMock).toHaveBeenCalledTimes(1)
    expect(getSearchGranulesMock).toHaveBeenCalledTimes(1)
  })

  test('should call getProjectGranules', () => {
    const newQuery = {
      collection: {
        keyword: 'new keyword',
        spatial: {
          point: '0,0'
        },
        temporal: {}
      }
    }

    // mock getCollections
    const getCollectionsMock = jest.spyOn(actions, 'getCollections')
    getCollectionsMock.mockImplementation(() => jest.fn())
    const getSearchGranulesMock = jest.spyOn(actions, 'getSearchGranules')
    getSearchGranulesMock.mockImplementation(() => jest.fn())
    const getProjectGranulesMock = jest.spyOn(actions, 'getProjectGranules')
    getProjectGranulesMock.mockImplementation(() => jest.fn())

    // mockStore with initialState
    const store = mockStore({
      focusedCollection: 'C10000-EDSC',
      query: {
        collection: {
          keyword: 'old stuff',
          spatial: {}
        }
      },
      project: {
        collections: {
          allIds: ['C10000-EDSC']
        }
      },
      router: {
        location: {
          pathname: ''
        }
      }
    })

    // call the dispatch
    store.dispatch(actions.changeQuery({ ...newQuery }))

    const storeActions = store.getActions()
    expect(storeActions[0]).toEqual({
      type: UPDATE_COLLECTION_QUERY,
      payload: {
        keyword: 'new keyword',
        pageNum: 1,
        spatial: {
          point: '0,0'
        },
        temporal: {}
      }
    })
    expect(storeActions[1]).toEqual({
      type: UPDATE_GRANULE_SEARCH_QUERY,
      payload: {
        collectionId: 'C10000-EDSC',
        pageNum: 1
      }
    })
    expect(storeActions[2]).toEqual({
      type: REMOVE_SUBSCRIPTION_DISABLED_FIELDS
    })

    // was getCollections called
    expect(getCollectionsMock).toHaveBeenCalledTimes(1)
    expect(getSearchGranulesMock).toHaveBeenCalledTimes(1)
    expect(getProjectGranulesMock).toHaveBeenCalledTimes(1)
  })
})

describe('changeProjectQuery', () => {
  test('should update the search query', () => {
    const newQuery = {
      collection: {
        keyword: 'new keyword',
        spatial: {
          point: '0,0'
        },
        temporal: {}
      }
    }

    // mockStore with initialState
    const store = mockStore({
      focusedCollection: '',
      query: {
        collection: {
          keyword: 'old stuff'
        }
      },
      project: {
        collections: {
          allIds: [],
          byId: {}
        }
      },
      router: {
        location: {
          pathname: ''
        }
      }
    })

    // call the dispatch
    store.dispatch(actions.changeProjectQuery({ ...newQuery }))

    const storeActions = store.getActions()
    expect(storeActions[0]).toEqual({
      type: UPDATE_COLLECTION_QUERY,
      payload: {
        keyword: 'new keyword',
        spatial: {
          point: '0,0'
        },
        temporal: {}
      }
    })
  })
})

describe('changeCollectionPageNum', () => {
  test('should update the collection query and call getCollections', () => {
    const pageNum = 2

    // mock getCollections
    const getCollectionsMock = jest.spyOn(actions, 'getCollections')
    getCollectionsMock.mockImplementation(() => jest.fn())

    // mockStore with initialState
    const store = mockStore({
      query: {
        collection: { pageNum: 1 }
      }
    })

    // call the dispatch
    store.dispatch(actions.changeCollectionPageNum(pageNum))

    const storeActions = store.getActions()
    expect(storeActions[0]).toEqual({
      type: UPDATE_COLLECTION_QUERY,
      payload: {
        pageNum: 2
      }
    })

    // was getCollections called
    expect(getCollectionsMock).toHaveBeenCalledTimes(1)
  })
})

describe('changeGranulePageNum', () => {
  test('should update the collection query and call getCollections', () => {
    const collectionId = 'collectionId'
    const pageNum = 2

    // mock getSearchGranules
    const getSearchGranulesMock = jest.spyOn(actions, 'getSearchGranules')
    getSearchGranulesMock.mockImplementation(() => jest.fn())

    // mockStore with initialState
    const store = mockStore({
      metadata: {
        collections: {
          collectionId: {}
        }
      },
      query: {
        collection: {}
      },
      searchResults: {
        collections: {
          byId: {
            collectionId: {
              granules: {
                allIds: ['123', '456'],
                hits: 100
              }
            }
          }
        }
      }
    })

    // call the dispatch
    store.dispatch(actions.changeGranulePageNum({ collectionId, pageNum }))

    // Is updateGranuleQuery called with the right payload
    const storeActions = store.getActions()
    expect(storeActions[0]).toEqual({
      type: UPDATE_GRANULE_SEARCH_QUERY,
      payload: {
        collectionId: 'collectionId',
        pageNum: 2
      }
    })

    // was getCollections called
    expect(getSearchGranulesMock).toHaveBeenCalledTimes(1)
  })

  test('should not update the collection query and call getCollections if there are no more granules', () => {
    const collectionId = 'collectionId'
    const pageNum = 2

    // mock getSearchGranules
    const getSearchGranulesMock = jest.spyOn(actions, 'getSearchGranules')
    getSearchGranulesMock.mockImplementation(() => jest.fn())

    // mockStore with initialState
    const store = mockStore({
      metadata: {
        collections: {
          collectionId: {}
        }
      },
      query: {
        collection: {}
      },
      searchResults: {
        collections: {
          byId: {
            collectionId: {
              granules: {
                allIds: ['123', '456'],
                hits: 100
              }
            }
          }
        }
      }
    })

    // call the dispatch
    store.dispatch(actions.changeGranulePageNum({ collectionId, pageNum }))

    // Is updateGranuleQuery called with the right payload
    const storeActions = store.getActions()
    expect(storeActions[0]).toEqual({
      type: UPDATE_GRANULE_SEARCH_QUERY,
      payload: {
        collectionId: 'collectionId',
        pageNum: 2
      }
    })
  })
})

describe('removeSpatialFilter', () => {
  test('should remove the spatial query', () => {
    // mockStore with initialState
    const store = mockStore({
      query: {
        collection: {
          spatial: {
            point: '0,0'
          },
          temporal: {}
        }
      },
      project: {},
      router: {
        location: {
          pathname: ''
        }
      },
      timeline: {
        query: {}
      }
    })

    // call the dispatch
    store.dispatch(actions.removeSpatialFilter())

    const storeActions = store.getActions()

    expect(storeActions[0]).toEqual({
      type: UPDATE_COLLECTION_QUERY,
      payload: {
        pageNum: 1,
        spatial: {}
      }
    })
    expect(storeActions[1]).toEqual({
      type: REMOVE_SUBSCRIPTION_DISABLED_FIELDS
    })
    expect(storeActions[2]).toEqual({
      type: TOGGLE_DRAWING_NEW_LAYER,
      payload: false
    })
    expect(storeActions[3]).toEqual({
      type: CLEAR_SHAPEFILE
    })
  })
})

describe('removeTemporalFilter', () => {
  test('should remove the temporal query', () => {
    // mockStore with initialState
    const store = mockStore({
      query: {
        collection: {
          spatial: {},
          temporal: {
            endDate: '2019-02-09T00:17:36.267Z',
            startDate: '2018-12-28T23:04:23.677Z'
          }
        }
      },
      project: {},
      router: {
        location: {
          pathname: ''
        }
      },
      timeline: {
        query: {}
      }
    })

    // call the dispatch
    store.dispatch(actions.removeTemporalFilter())

    const storeActions = store.getActions()
    expect(storeActions[0]).toEqual({
      type: UPDATE_COLLECTION_QUERY,
      payload: {
        pageNum: 1,
        temporal: {}
      }
    })
  })
})

describe('changeRegionQuery', () => {
  test('clears the query and calls getCollections', () => {
    const query = {
      exact: false,
      endpoint: 'region',
      keyword: 'test value'
    }

    // mockStore with initialState
    const store = mockStore({})

    // mock getRegionsMock
    const getRegionsMock = jest.spyOn(actions, 'getRegions')
    getRegionsMock.mockImplementation(() => jest.fn())

    // call the dispatch
    store.dispatch(actions.changeRegionQuery(query))
    const storeActions = store.getActions()

    expect(storeActions[0]).toEqual({
      type: UPDATE_REGION_QUERY,
      payload: query
    })

    // was getCollections called
    expect(getRegionsMock).toHaveBeenCalledTimes(1)
  })
})

describe('clearFilters', () => {
  test('clears the query and calls getCollections', () => {
    // mockStore with initialState
    const store = mockStore({
      router: {
        location: {
          pathname: '/search/granules'
        }
      }
    })

    // mock getCollections
    const getCollectionsMock = jest.spyOn(actions, 'getCollections')
    getCollectionsMock.mockImplementation(() => jest.fn())

    const getProjectCollectionsMock = jest.spyOn(actions, 'getProjectCollections')
    getProjectCollectionsMock.mockImplementation(() => jest.fn())

    const getSearchGranulesMock = jest.spyOn(actions, 'getSearchGranules')
    getSearchGranulesMock.mockImplementation(() => jest.fn())

    const getTimelineMock = jest.spyOn(actions, 'getTimeline')
    getTimelineMock.mockImplementation(() => jest.fn())

    // call the dispatch
    store.dispatch(actions.clearFilters())
    const storeActions = store.getActions()

    expect(storeActions[0]).toEqual({
      type: CLEAR_FILTERS
    })

    // was getCollections called
    expect(getCollectionsMock).toHaveBeenCalledTimes(1)
    expect(getProjectCollectionsMock).toHaveBeenCalledTimes(1)
    expect(getSearchGranulesMock).toHaveBeenCalledTimes(1)
    expect(getTimelineMock).toHaveBeenCalledTimes(1)
  })

  test('does not call getGranules on the collections page', () => {
    // mockStore with initialState
    const store = mockStore({
      router: {
        location: {
          pathname: '/search'
        }
      }
    })

    // mock getCollections
    const getCollectionsMock = jest.spyOn(actions, 'getCollections')
    getCollectionsMock.mockImplementation(() => jest.fn())

    const getProjectCollectionsMock = jest.spyOn(actions, 'getProjectCollections')
    getProjectCollectionsMock.mockImplementation(() => jest.fn())

    const getSearchGranulesMock = jest.spyOn(actions, 'getSearchGranules')
    getSearchGranulesMock.mockImplementation(() => jest.fn())

    const getTimelineMock = jest.spyOn(actions, 'getTimeline')
    getTimelineMock.mockImplementation(() => jest.fn())

    // call the dispatch
    store.dispatch(actions.clearFilters())
    const storeActions = store.getActions()

    expect(storeActions[0]).toEqual({
      type: CLEAR_FILTERS
    })

    // was getCollections called
    expect(getCollectionsMock).toHaveBeenCalledTimes(1)
    expect(getProjectCollectionsMock).toHaveBeenCalledTimes(1)
    expect(getSearchGranulesMock).toHaveBeenCalledTimes(0)
    expect(getTimelineMock).toHaveBeenCalledTimes(0)
  })
})
