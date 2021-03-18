import collectionsResultsReducer, { initialGranuleState } from '../collectionsResults'

import {
  ADD_MORE_COLLECTION_RESULTS,
  ADD_MORE_GRANULE_RESULTS,
  FINISHED_COLLECTIONS_TIMER,
  FINISHED_GRANULES_TIMER,
  INITIALIZE_COLLECTION_GRANULES_RESULTS,
  LOADED_COLLECTIONS,
  LOADED_GRANULES,
  LOADING_COLLECTIONS,
  LOADING_GRANULES,
  RESET_GRANULE_RESULTS,
  STARTED_COLLECTIONS_TIMER,
  STARTED_GRANULES_TIMER,
  UPDATE_COLLECTION_RESULTS,
  UPDATE_GRANULE_RESULTS
} from '../../constants/actionTypes'

const initialState = {
  hits: null,
  allIds: [],
  isLoading: false,
  isLoaded: false,
  loadTime: 0,
  timerStart: null
}

describe('INITIAL_STATE', () => {
  test('is correct', () => {
    const action = { type: 'dummy_action' }

    expect(collectionsResultsReducer(undefined, action)).toEqual(initialState)
  })
})

describe('STARTED_COLLECTIONS_TIMER', () => {
  test('returns the correct state', () => {
    const action = {
      type: STARTED_COLLECTIONS_TIMER
    }

    // Mock current time to equal 5
    jest.spyOn(Date, 'now').mockImplementation(() => 5)

    const expectedState = {
      ...initialState,
      timerStart: 5
    }

    expect(collectionsResultsReducer(undefined, action)).toEqual(expectedState)
  })
})

describe('FINISHED_COLLECTIONS_TIMER', () => {
  test('returns the correct state', () => {
    const action = {
      type: FINISHED_COLLECTIONS_TIMER
    }

    // Set current time to 10, and future time to 15
    // Load time will equal 5
    jest.spyOn(Date, 'now').mockImplementation(() => 15)

    const start = 10

    const expectedState = {
      ...initialState,
      timerStart: null,
      loadTime: 5
    }

    expect(collectionsResultsReducer({ ...initialState, timerStart: start }, action))
      .toEqual(expectedState)
  })
})

describe('UPDATE_COLLECTION_RESULTS', () => {
  test('returns the correct state', () => {
    const action = {
      type: UPDATE_COLLECTION_RESULTS,
      payload: {
        results: [{
          id: 'mockCollectionId',
          mockCollectionData: 'goes here'
        }],
        hits: 0
      }
    }

    const expectedState = {
      ...initialState,
      hits: 0,
      allIds: ['mockCollectionId']
    }

    expect(collectionsResultsReducer(undefined, action)).toEqual(expectedState)
  })
})

describe('ADD_MORE_COLLECTION_RESULTS', () => {
  test('returns the correct state', () => {
    const action = {
      type: ADD_MORE_COLLECTION_RESULTS,
      payload: {
        results: [{
          id: 'mockCollectionId2',
          mockCollectionData: 'goes here 2'
        }],
        hits: 0
      }
    }

    const initial = {
      ...initialState,
      allIds: ['mockCollectionId1']
    }

    const expectedState = {
      ...initialState,
      allIds: ['mockCollectionId1', 'mockCollectionId2']
    }

    expect(collectionsResultsReducer(initial, action)).toEqual(expectedState)
  })
})

describe('LOADING_COLLECTIONS', () => {
  test('returns the correct state', () => {
    const action = {
      type: LOADING_COLLECTIONS
    }

    const expectedState = {
      ...initialState,
      isLoading: true,
      isLoaded: false
    }

    expect(collectionsResultsReducer(undefined, action)).toEqual(expectedState)
  })
})

describe('LOADED_COLLECTIONS', () => {
  test('returns the correct state', () => {
    const action = {
      type: LOADED_COLLECTIONS,
      payload: {
        loaded: true
      }
    }

    const expectedState = {
      ...initialState,
      isLoading: false,
      isLoaded: true
    }

    expect(collectionsResultsReducer(undefined, action)).toEqual(expectedState)
  })
})

describe('INITIALIZE_COLLECTION_GRANULES_RESULTS', () => {
  test('returns the correct state', () => {
    const action = {
      type: INITIALIZE_COLLECTION_GRANULES_RESULTS,
      payload: 'mockCollectionId1'
    }
    const initial = {
      ...initialState,
      allIds: ['mockCollectionId1']
    }
    const expectedState = {
      ...initialState,
      allIds: ['mockCollectionId1'],
      byId: {
        mockCollectionId1: {
          granules: {
            ...initialGranuleState
          }
        }
      }
    }
    expect(collectionsResultsReducer(initial, action)).toEqual(expectedState)
  })
})

describe('STARTED_GRANULES_TIMER', () => {
  test('returns the correct state', () => {
    const action = {
      type: STARTED_GRANULES_TIMER,
      payload: 'collectionId'
    }

    jest.spyOn(Date, 'now').mockImplementation(() => 5)

    const expectedState = {
      ...initialState,
      byId: {
        collectionId: {
          granules: {
            allIds: [],
            excludedGranuleIds: [],
            hits: null,
            isOpenSearch: null,
            isLoaded: false,
            isLoading: false,
            loadTime: 0,
            timerStart: 5
          }
        }
      }
    }

    expect(collectionsResultsReducer(undefined, action)).toEqual(expectedState)
  })
})

describe('FINISHED_GRANULES_TIMER', () => {
  test('returns the correct state', () => {
    const action = {
      type: FINISHED_GRANULES_TIMER,
      payload: 'collectionId'
    }

    const initial = {
      ...initialState,
      byId: {
        collectionId: {
          granules: {
            allIds: [],
            excludedGranuleIds: [],
            hits: null,
            isOpenSearch: null,
            isLoaded: false,
            isLoading: false,
            loadTime: 0,
            timerStart: 5
          }
        }
      }
    }

    jest.spyOn(Date, 'now').mockImplementation(() => 7)

    const expectedState = {
      ...initialState,
      byId: {
        collectionId: {
          granules: {
            allIds: [],
            excludedGranuleIds: [],
            hits: null,
            isOpenSearch: null,
            isLoaded: false,
            isLoading: false,
            loadTime: 2,
            timerStart: null
          }
        }
      }
    }

    expect(collectionsResultsReducer(initial, action)).toEqual(expectedState)
  })
})

describe('RESET_GRANULE_RESULTS', () => {
  test('returns the correct state', () => {
    const action = {
      type: RESET_GRANULE_RESULTS,
      payload: 'collectionId'
    }

    const initial = {
      ...initialState,
      byId: {
        collectionId: {
          granules: {
            allIds: ['granuleId1', 'granuleId2']
          }
        }
      }
    }

    const expectedState = {
      ...initialState,
      byId: {
        collectionId: {
          granules: {
            allIds: [],
            excludedGranuleIds: [],
            hits: null,
            isOpenSearch: null,
            isLoaded: false,
            isLoading: false,
            loadTime: 0,
            timerStart: null
          }
        }
      }
    }

    expect(collectionsResultsReducer(initial, action)).toEqual(expectedState)
  })
})

describe('LOADING_GRANULES', () => {
  test('returns the correct state', () => {
    const action = {
      type: LOADING_GRANULES,
      payload: 'collectionId'
    }

    const initial = {
      ...initialState,
      byId: {
        collectionId: {
          granules: {
            isLoaded: false,
            isLoading: false
          }
        }
      }
    }

    const expectedState = {
      ...initialState,
      byId: {
        collectionId: {
          granules: {
            isLoaded: false,
            isLoading: true
          }
        }
      }
    }

    expect(collectionsResultsReducer(initial, action)).toEqual(expectedState)
  })
})

describe('LOADED_GRANULES', () => {
  test('returns the correct state', () => {
    const action = {
      type: LOADED_GRANULES,
      payload: {
        collectionId: 'collectionId',
        loaded: true
      }
    }

    const initial = {
      ...initialState,
      byId: {
        collectionId: {
          granules: {
            isLoaded: false,
            isLoading: false
          }
        }
      }
    }

    const expectedState = {
      ...initialState,
      byId: {
        collectionId: {
          granules: {
            isLoaded: true,
            isLoading: false
          }
        }
      }
    }

    expect(collectionsResultsReducer(initial, action)).toEqual(expectedState)
  })
})

describe('UPDATE_GRANULE_RESULTS', () => {
  test('returns the correct state', () => {
    const action = {
      type: UPDATE_GRANULE_RESULTS,
      payload: {
        collectionId: 'collectionId',
        hits: 1,
        isOpenSearch: false,
        results: [{
          mock: 'metadata',
          id: 'granuleId1'
        }],
        totalSize: {
          size: '42',
          unit: 'KB'
        },
        singleGranuleSize: 42
      }
    }

    const initial = {
      ...initialState,
      byId: {
        collectionId: {
          granules: {
            allIds: ['granuleIdOld']
          }
        }
      }
    }

    const expectedState = {
      ...initialState,
      byId: {
        collectionId: {
          granules: {
            hits: 1,
            isOpenSearch: false,
            allIds: ['granuleId1'],
            totalSize: {
              size: '42',
              unit: 'KB'
            },
            singleGranuleSize: 42
          }
        }
      }
    }

    expect(collectionsResultsReducer(initial, action)).toEqual(expectedState)
  })
})

describe('ADD_MORE_GRANULE_RESULTS', () => {
  test('returns the correct state', () => {
    const action = {
      type: ADD_MORE_GRANULE_RESULTS,
      payload: {
        collectionId: 'collectionId',
        results: [{
          mock: 'metadata',
          id: 'granuleId2'
        }]
      }
    }

    const initial = {
      ...initialState,
      byId: {
        collectionId: {
          granules: {
            hits: 1,
            isOpenSearch: false,
            allIds: ['granuleId1'],
            totalSize: {
              size: '42',
              unit: 'KB'
            },
            singleGranuleSize: 42
          }
        }
      }
    }

    const expectedState = {
      ...initialState,
      byId: {
        collectionId: {
          granules: {
            hits: 1,
            isOpenSearch: false,
            allIds: ['granuleId1', 'granuleId2'],
            totalSize: {
              size: '42',
              unit: 'KB'
            },
            singleGranuleSize: 42
          }
        }
      }
    }

    expect(collectionsResultsReducer(initial, action)).toEqual(expectedState)
  })
})
