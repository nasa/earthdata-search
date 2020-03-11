import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import actions from '../index'
import { updateCollectionQuery, updateGranuleQuery } from '../search'
import {
  CLEAR_EXCLUDE_GRANULE_ID,
  UPDATE_COLLECTION_QUERY,
  UPDATE_GRANULE_QUERY,
  CLEAR_SHAPEFILE,
  CLEAR_COLLECTION_GRANULES,
  UPDATE_TIMELINE_INTERVALS,
  TOGGLE_DRAWING_NEW_LAYER,
  UPDATE_ADVANCED_SEARCH
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

describe('updateGranuleQuery', () => {
  test('should create an action to update the search query', () => {
    const payload = {
      pageNum: 1
    }
    const expectedAction = {
      type: UPDATE_GRANULE_QUERY,
      payload
    }
    expect(updateGranuleQuery(payload)).toEqual(expectedAction)
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
      metadata: {},
      project: {},
      router: {
        location: {
          pathname: ''
        }
      }
    })

    // call the dispatch
    store.dispatch(actions.changeQuery({ ...newQuery }))

    // Is updateCollectionQuery called with the right payload
    const storeActions = store.getActions()
    expect(storeActions[0]).toEqual({
      type: CLEAR_EXCLUDE_GRANULE_ID
    })
    expect(storeActions[1]).toEqual({
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

    // was getCollections called
    expect(getCollectionsMock).toHaveBeenCalledTimes(1)
  })

  test('should wipe excluded granule ids when overideTemporal is modified', () => {
    const newQuery = {
      collection: {
        overideTemporal: {
          endDate: '2019-02-09T00:17:36.267Z',
          startDate: '2018-12-28T23:04:23.677Z'
        }
      }
    }

    // mockStore with initialState
    const store = mockStore({
      focusedCollection: '',
      metadata: {},
      query: {
        collection: {}
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

    // Is updateCollectionQuery called with the right payload
    const storeActions = store.getActions()
    expect(storeActions[0]).toEqual({
      type: CLEAR_EXCLUDE_GRANULE_ID
    })
  })

  test('should wipe excluded granule ids when gridName is modified', () => {
    const newQuery = {
      collection: {
        gridName: 'Test Grid'
      }
    }

    // mockStore with initialState
    const store = mockStore({
      focusedCollection: '',
      metadata: {},
      query: {
        collection: {}
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

    // Is updateCollectionQuery called with the right payload
    const storeActions = store.getActions()
    expect(storeActions[0]).toEqual({
      type: CLEAR_EXCLUDE_GRANULE_ID
    })
  })
})

describe('changeProjectQuery', () => {
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
    const getProjectCollectionsMock = jest.spyOn(actions, 'getProjectCollections')
    getProjectCollectionsMock.mockImplementation(() => jest.fn())

    // mockStore with initialState
    const store = mockStore({
      focusedCollection: '',
      query: {
        collection: {
          keyword: 'old stuff'
        }
      },
      metadata: {},
      router: {
        location: {
          pathname: ''
        }
      }
    })

    // call the dispatch
    store.dispatch(actions.changeProjectQuery({ ...newQuery }))

    // Is updateCollectionQuery called with the right payload
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

    // was getCollections called
    expect(getProjectCollectionsMock).toHaveBeenCalledTimes(1)
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

    // Is updateCollectionQuery called with the right payload
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

    // mock getGranules
    const getGranulesMock = jest.spyOn(actions, 'getGranules')
    getGranulesMock.mockImplementation(() => jest.fn())

    // mockStore with initialState
    const store = mockStore({
      metadata: {
        collections: {
          allIds: [collectionId],
          byId: {
            collectionId: {
              granules: {
                allIds: ['123', '456'],
                hits: 100
              }
            }
          }
        }
      },
      query: {
        collection: {},
        granule: { pageNum: 1 }
      }
    })

    // call the dispatch
    store.dispatch(actions.changeGranulePageNum({ collectionId, pageNum }))

    // Is updateGranuleQuery called with the right payload
    const storeActions = store.getActions()
    expect(storeActions[0]).toEqual({
      type: UPDATE_GRANULE_QUERY,
      payload: {
        pageNum: 2
      }
    })

    // was getCollections called
    expect(getGranulesMock).toHaveBeenCalledTimes(1)
  })

  test('should not update the collection query and call getCollections if there are no more granules', () => {
    const collectionId = 'collectionId'
    const pageNum = 2

    // mock getGranules
    const getGranulesMock = jest.spyOn(actions, 'getGranules')
    getGranulesMock.mockImplementation(() => jest.fn())

    // mockStore with initialState
    const store = mockStore({
      metadata: {
        collections: {
          allIds: [collectionId],
          byId: {
            collectionId: {
              granules: {
                allIds: ['123', '456'],
                hits: 2
              }
            }
          }
        }
      },
      query: {
        collection: {},
        granule: { pageNum: 1 }
      }
    })

    // call the dispatch
    store.dispatch(actions.changeGranulePageNum({ collectionId, pageNum }))

    // Is updateGranuleQuery called with the right payload
    const storeActions = store.getActions()
    expect(storeActions.length).toBe(0)

    expect(getGranulesMock).toHaveBeenCalledTimes(0)
  })
})

describe('changeGranuleGridCoords', () => {
  test('should update the collection query and call getCollections', () => {
    const coords = 'Test Grid Coords'

    // mock getGranules
    const getGranulesMock = jest.spyOn(actions, 'getGranules')
    getGranulesMock.mockImplementation(() => jest.fn())

    // mockStore with initialState
    const store = mockStore({
      query: {
        collection: {},
        granule: { pageNum: 1 }
      }
    })

    // call the dispatch
    store.dispatch(actions.changeGranuleGridCoords(coords))

    // Is updateGranuleQuery called with the right payload
    const storeActions = store.getActions()
    expect(storeActions[0]).toEqual({
      type: UPDATE_GRANULE_QUERY,
      payload: {
        gridCoords: coords
      }
    })

    // was getCollections called
    expect(getGranulesMock).toHaveBeenCalledTimes(1)
  })
})

describe('removeGridFilter', () => {
  test('should remove the grid query', () => {
    // mockStore with initialState
    const store = mockStore({
      query: {
        collection: {
          spatial: {},
          temporal: {},
          gridName: 'mock grid'
        },
        granule: {
          gridCoords: 'mock coords'
        }
      },
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
    store.dispatch(actions.removeGridFilter())

    // Is updateCollectionQuery called with the right payload
    const storeActions = store.getActions()
    expect(storeActions[0]).toEqual({
      type: CLEAR_EXCLUDE_GRANULE_ID
    })
    expect(storeActions[1]).toEqual({
      type: UPDATE_COLLECTION_QUERY,
      payload: {
        gridName: '',
        pageNum: 1
      }
    })
    expect(storeActions[2]).toEqual({
      type: UPDATE_GRANULE_QUERY,
      payload: {
        gridCoords: '',
        pageNum: 1
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

    // Is updateCollectionQuery called with the right payload
    const storeActions = store.getActions()
    expect(storeActions[0]).toEqual({
      type: CLEAR_EXCLUDE_GRANULE_ID
    })
    expect(storeActions[1]).toEqual({
      type: UPDATE_COLLECTION_QUERY,
      payload: {
        pageNum: 1,
        spatial: {}
      }
    })
    expect(storeActions[2]).toEqual({
      type: UPDATE_GRANULE_QUERY,
      payload: {
        pageNum: 1
      }
    })
    expect(storeActions[3]).toEqual({
      type: CLEAR_COLLECTION_GRANULES
    })
    expect(storeActions[4]).toEqual({
      type: UPDATE_TIMELINE_INTERVALS,
      payload: {
        results: []
      }
    })
    expect(storeActions[5]).toEqual({
      type: TOGGLE_DRAWING_NEW_LAYER,
      payload: false
    })
    expect(storeActions[6]).toEqual({
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

    // Is updateCollectionQuery called with the right payload
    const storeActions = store.getActions()
    expect(storeActions[0]).toEqual({
      type: CLEAR_EXCLUDE_GRANULE_ID
    })
    expect(storeActions[1]).toEqual({
      type: UPDATE_COLLECTION_QUERY,
      payload: {
        pageNum: 1,
        temporal: {}
      }
    })
  })
})

describe('clearFilters', () => {
  test('clears the query and calls getCollections', () => {
    const query = {
      focusedCollection: '',
      query: {
        collection: {
          keyword: 'keyword search',
          spatial: {
            point: '0,0'
          }
        },
        granule: {
          gridCoords: ''
        }
      },
      metadata: {},
      router: {
        location: {
          pathname: ''
        }
      }
    }
    const emptyQuery = {
      gridName: '',
      keyword: '',
      pageNum: 1,
      spatial: {},
      temporal: {}
    }

    // mockStore with initialState
    const store = mockStore(query)

    // mock getCollections
    const getCollectionsMock = jest.spyOn(actions, 'getCollections')
    getCollectionsMock.mockImplementation(() => jest.fn())

    // call the dispatch
    store.dispatch(actions.clearFilters())
    const storeActions = store.getActions()

    // Is updateCollectionQuery called with the right payload
    expect(storeActions[0]).toEqual({
      type: UPDATE_ADVANCED_SEARCH,
      payload: {}
    })
    expect(storeActions[1]).toEqual({
      type: CLEAR_EXCLUDE_GRANULE_ID
    })
    expect(storeActions[2]).toEqual({
      type: UPDATE_COLLECTION_QUERY,
      payload: emptyQuery
    })
    expect(storeActions[3]).toEqual({
      type: UPDATE_GRANULE_QUERY,
      payload: {
        gridCoords: '',
        pageNum: 1
      }
    })
    expect(storeActions[4]).toEqual({
      type: CLEAR_COLLECTION_GRANULES
    })
    expect(storeActions[5]).toEqual({
      type: UPDATE_TIMELINE_INTERVALS,
      payload: {
        results: []
      }
    })
    expect(storeActions[6]).toEqual({
      type: CLEAR_SHAPEFILE
    })

    // was getCollections called
    expect(getCollectionsMock).toHaveBeenCalledTimes(1)
  })
})
