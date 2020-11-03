import queryReducer, { initialGranuleState } from '../query'
import {
  CLEAR_FILTERS,
  EXCLUDE_GRANULE_ID,
  INITIALIZE_COLLECTION_GRANULES_QUERY,
  RESTORE_FROM_URL,
  UNDO_EXCLUDE_GRANULE_ID,
  UPDATE_COLLECTION_QUERY,
  UPDATE_GRANULE_FILTERS,
  UPDATE_GRANULE_SEARCH_QUERY,
  UPDATE_REGION_QUERY
} from '../../constants/actionTypes'

const initialState = {
  collection: {
    byId: {},
    keyword: '',
    hasGranulesOrCwic: true,
    pageNum: 1,
    spatial: {},
    temporal: {}
  },
  region: {
    exact: false
  }
}

describe('INITIAL_STATE', () => {
  test('is correct', () => {
    const action = { type: 'dummy_action' }

    expect(queryReducer(undefined, action)).toEqual(initialState)
  })
})

describe('UPDATE_COLLECTION_QUERY', () => {
  test('returns the correct state', () => {
    const payload = {
      keyword: 'new keyword',
      pageNum: 1,
      spatial: {
        point: '0,0'
      },
      temporal: {}
    }
    const action = {
      type: UPDATE_COLLECTION_QUERY,
      payload
    }

    const expectedState = {
      collection: {
        ...payload,
        byId: {},
        hasGranulesOrCwic: true
      },
      region: {
        exact: false
      }
    }

    expect(queryReducer(undefined, action)).toEqual(expectedState)
  })

  test('does not overwrite existing values', () => {
    const initialState = {
      collection: { keyword: 'old keyword' }
    }
    const payload = {
      spatial: {
        point: '0,0'
      }
    }
    const action = {
      type: UPDATE_COLLECTION_QUERY,
      payload
    }
    const expectedState = {
      collection: {
        keyword: 'old keyword',
        spatial: {
          point: '0,0'
        }
      }
    }

    expect(queryReducer(initialState, action)).toEqual(expectedState)
  })
})

describe('UPDATE_REGION_QUERY', () => {
  test('returns the correct state', () => {
    const payload = {
      exact: false,
      endpoint: 'region',
      keyword: 'test value'
    }
    const action = {
      type: UPDATE_REGION_QUERY,
      payload
    }

    const expectedState = {
      ...initialState,
      region: {
        ...payload
      }
    }

    expect(queryReducer(undefined, action)).toEqual(expectedState)
  })
})

describe('RESTORE_FROM_URL', () => {
  test('returns the correct state', () => {
    const query = {
      collection: { pageNum: 1 },
      granule: { pageNum: 1 },
      region: {
        exact: true
      }
    }

    const action = {
      type: RESTORE_FROM_URL,
      payload: {
        query
      }
    }

    const expectedState = query

    expect(queryReducer(undefined, action)).toEqual(expectedState)
  })
})

describe('CLEAR_FILTERS', () => {
  test('returns the correct state', () => {
    const action = { type: CLEAR_FILTERS }

    expect(queryReducer(undefined, action)).toEqual(initialState)
  })
})

describe('EXCLUDE_GRANULE_ID', () => {
  test('returns the correct state', () => {
    const action = {
      type: EXCLUDE_GRANULE_ID,
      payload: {
        collectionId: 'collectionId',
        granuleId: 'granuleId'
      }
    }

    const expectedState = {
      ...initialState,
      collection: {
        ...initialState.collection,
        byId: {
          collectionId: {
            granules: {
              excludedGranuleIds: ['granuleId'],
              pageNum: 1
            }
          }
        }
      }
    }

    expect(queryReducer(undefined, action)).toEqual(expectedState)
  })
})

describe('UNDO_EXCLUDE_GRANULE_ID', () => {
  test('returns the correct state', () => {
    const action = {
      type: UNDO_EXCLUDE_GRANULE_ID,
      payload: 'collectionId'
    }

    const initial = {
      ...initialState,
      collection: {
        ...initialState.collection,
        byId: {
          collectionId: {
            granules: {
              excludedGranuleIds: ['granuleId']
            }
          }
        }
      }
    }

    const expectedState = {
      ...initialState,
      collection: {
        ...initialState.collection,
        byId: {
          collectionId: {
            granules: {
              excludedGranuleIds: []
            }
          }
        }
      }
    }

    expect(queryReducer(initial, action)).toEqual(expectedState)
  })
})

describe('UPDATE_GRANULE_FILTERS', () => {
  test('returns the correct state', () => {
    const action = {
      type: UPDATE_GRANULE_FILTERS,
      payload: {
        collectionId: 'collectionId',
        pageNum: 2
      }
    }

    const initial = {
      ...initialState,
      collection: {
        ...initialState.collection,
        byId: {
          collectionId: {
            granules: {
              ...initialGranuleState
            }
          }
        }
      }
    }

    const expectedState = {
      ...initialState,
      collection: {
        ...initialState.collection,
        byId: {
          collectionId: {
            granules: {
              ...initialGranuleState,
              collectionId: 'collectionId',
              pageNum: 2
            }
          }
        }
      }
    }

    expect(queryReducer(initial, action)).toEqual(expectedState)
  })

  test('returns the correct state when removing values', () => {
    const action = {
      type: UPDATE_GRANULE_FILTERS,
      payload: {
        collectionId: 'collectionId',
        pageNum: 2
      }
    }

    const initial = {
      ...initialState,
      collection: {
        ...initialState.collection,
        byId: {
          collectionId: {
            granules: {
              ...initialGranuleState,
              browseOnly: true
            }
          }
        }
      }
    }

    const expectedState = {
      ...initialState,
      collection: {
        ...initialState.collection,
        byId: {
          collectionId: {
            granules: {
              ...initialGranuleState,
              collectionId: 'collectionId',
              pageNum: 2
            }
          }
        }
      }
    }

    expect(queryReducer(initial, action)).toEqual(expectedState)
  })
})

describe('UPDATE_GRANULE_SEARCH_QUERY', () => {
  test('returns the correct state', () => {
    const action = {
      type: UPDATE_GRANULE_SEARCH_QUERY,
      payload: {
        collectionId: 'collectionId',
        pageNum: 2
      }
    }

    const initial = {
      ...initialState,
      collection: {
        ...initialState.collection,
        byId: {
          collectionId: {
            granules: {
              ...initialGranuleState
            }
          }
        }
      }
    }

    const expectedState = {
      ...initialState,
      collection: {
        ...initialState.collection,
        byId: {
          collectionId: {
            granules: {
              ...initialGranuleState,
              collectionId: 'collectionId',
              pageNum: 2
            }
          }
        }
      }
    }

    expect(queryReducer(initial, action)).toEqual(expectedState)
  })
})

describe('INITIALIZE_COLLECTION_GRANULES_QUERY', () => {
  test('returns the correct state', () => {
    const action = {
      type: INITIALIZE_COLLECTION_GRANULES_QUERY,
      payload: 'collectionId'
    }

    const initial = {
      ...initialState,
      collection: {
        ...initialState.collection,
        byId: {
          collectionId: {}
        }
      }
    }

    const expectedState = {
      ...initialState,
      collection: {
        ...initialState.collection,
        byId: {
          collectionId: {
            granules: {
              ...initialGranuleState,
              pageNum: 1
            }
          }
        }
      }
    }

    expect(queryReducer(initial, action)).toEqual(expectedState)
  })
})
