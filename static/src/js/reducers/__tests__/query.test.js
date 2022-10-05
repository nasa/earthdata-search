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
    sortKey: ['-usage_score'],
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
        hasGranulesOrCwic: true,
        sortKey: ['-usage_score']
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
  describe('with the default collection sort preference', () => {
    test('returns the correct state', () => {
      const query = {
        collection: { pageNum: 1 },
        collectionSortPreference: 'default',
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

      const expectedState = {
        ...initialState,
        ...query,
        collection: {
          ...initialState.collection,
          ...query.collection
        }
      }

      expect(queryReducer(undefined, action)).toEqual(expectedState)
    })
  })

  describe('with the relevance collection sort preference', () => {
    test('returns the correct state', () => {
      const query = {
        collection: { pageNum: 1 },
        collectionSortPreference: 'relevance',
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

      const expectedState = {
        ...initialState,
        ...query,
        collection: {
          ...initialState.collection,
          ...query.collection,
          sortKey: undefined
        }
      }

      expect(queryReducer(undefined, action)).toEqual(expectedState)
    })
  })

  describe('with the collection sort preference selected', () => {
    test('returns the correct state', () => {
      const query = {
        collection: { pageNum: 1 },
        collectionSortPreference: '-ongoing',
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

      const expectedState = {
        ...initialState,
        ...query,
        collection: {
          ...initialState.collection,
          ...query.collection,
          sortKey: ['-ongoing']
        }
      }

      expect(queryReducer(undefined, action)).toEqual(expectedState)
    })
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
  describe('when the granule sort preference is the default', () => {
    test('returns the correct state', () => {
      const action = {
        type: INITIALIZE_COLLECTION_GRANULES_QUERY,
        payload: {
          collectionId: 'collectionId',
          granuleSortPreference: 'default'
        }
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

  describe('when the granule sort preference set', () => {
    test('returns the correct state', () => {
      const action = {
        type: INITIALIZE_COLLECTION_GRANULES_QUERY,
        payload: {
          collectionId: 'collectionId',
          granuleSortPreference: 'start_date'
        }
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
                sortKey: 'start_date',
                pageNum: 1
              }
            }
          }
        }
      }

      expect(queryReducer(initial, action)).toEqual(expectedState)
    })
  })
})
