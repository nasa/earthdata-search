import collectionMetadataReducer from '../collectionMetadata'
import {
  UPDATE_COLLECTION_METADATA,
  EXCLUDE_GRANULE_ID,
  ADD_COLLECTION_GRANULES,
  UNDO_EXCLUDE_GRANULE_ID,
  RESTORE_COLLECTIONS,
  CLEAR_COLLECTION_GRANULES
} from '../../constants/actionTypes'

const initialState = {
  allIds: [],
  byId: {},
  projectIds: []
}

describe('INITIAL_STATE', () => {
  test('is correct', () => {
    const action = { type: 'dummy_action' }

    expect(collectionMetadataReducer(undefined, action)).toEqual(initialState)
  })
})

describe('CLEAR_COLLECTION_GRANULES', () => {
  test('return the correct state', () => {
    const action = {
      type: CLEAR_COLLECTION_GRANULES
    }

    const initial = {
      allIds: ['collection1', 'collection2'],
      byId: {
        collection1: {
          excludedGranuleIds: ['granule1'],
          granules: {
            allIds: ['collection1-granule1', 'collection1-granule2'],
            byId: {
              'collection1-granule1': {
                mock: 'granule1'
              },
              'collection1-granule2': {
                mock: 'granule2'
              }
            }
          },
          metadata: {
            mock: 'collection1'
          }
        },
        collection2: {
          excludedGranuleIds: [],
          granules: {
            allIds: ['collection2-granule1', 'collection2-granule2'],
            byId: {
              'collection2-granule1': {
                mock: 'granule1'
              },
              'collection2-granule2': {
                mock: 'granule2'
              }
            }
          },
          metadata: {
            mock: 'collection2'
          }
        }
      },
      projectIds: []
    }

    const expectedState = {
      ...initialState,
      allIds: ['collection1', 'collection2'],
      byId: {
        collection1: {
          excludedGranuleIds: ['granule1'],
          granules: {},
          metadata: {
            mock: 'collection1'
          }
        },
        collection2: {
          excludedGranuleIds: [],
          granules: {},
          metadata: {
            mock: 'collection2'
          }
        }
      }
    }

    expect(collectionMetadataReducer(initial, action)).toEqual(expectedState)
  })
})

describe('UPDATE_COLLECTION_METADATA', () => {
  test('returns the correct state when collection has not been visited yet', () => {
    const action = {
      type: UPDATE_COLLECTION_METADATA,
      payload: {
        collectionId: {
          mock: 'data'
        }
      }
    }

    const expectedState = {
      ...initialState,
      allIds: ['collectionId'],
      byId: {
        collectionId: {
          excludedGranuleIds: [],
          granules: {},
          metadata: {
            mock: 'data'
          }
        }
      }
    }

    expect(collectionMetadataReducer(undefined, action)).toEqual(expectedState)
  })

  test('returns the correct state when collection has been visited yet', () => {
    const action = {
      type: UPDATE_COLLECTION_METADATA,
      payload: {
        collectionId: {
          mock: 'data'
        }
      }
    }

    const initial = {
      ...initialState,
      allIds: ['collectionId'],
      byId: {
        collectionId: {
          excludedGranuleIds: ['granuleId1'],
          granules: {
            allIds: ['granuleId1'],
            byId: {
              granuleId1: {
                mock: 'data'
              }
            }
          },
          metadata: {
            mock: 'data'
          }
        }
      }
    }

    const expectedState = {
      ...initialState,
      allIds: ['collectionId'],
      byId: {
        collectionId: {
          excludedGranuleIds: ['granuleId1'],
          granules: {},
          metadata: {
            mock: 'data'
          }
        }
      }
    }

    expect(collectionMetadataReducer(initial, action)).toEqual(expectedState)
  })
})

describe('RESTORE_COLLECTIONS', () => {
  test('return the correct state', () => {
    const payload = {
      allIds: ['collectionId'],
      byId: {
        collectionId: {
          excludedGranuleIds: ['granuleId1'],
          granules: {},
          metadata: {}
        }
      },
      projectIds: []
    }
    const action = {
      type: RESTORE_COLLECTIONS,
      payload
    }

    const expectedState = {
      ...initialState,
      ...payload
    }

    expect(collectionMetadataReducer(undefined, action)).toEqual(expectedState)
  })
})


describe('EXCLUDE_GRANULE_ID', () => {
  test('returns the correct state', () => {
    const action = {
      type: EXCLUDE_GRANULE_ID,
      payload: {
        collectionId: 'collectionId',
        granuleId: 'granuleId1'
      }
    }

    const initial = {
      ...initialState,
      allIds: ['collectionId'],
      byId: {
        collectionId: {
          excludedGranuleIds: [],
          granules: {},
          metadata: {
            mock: 'data'
          }
        }
      }
    }

    const expectedState = {
      ...initialState,
      allIds: ['collectionId'],
      byId: {
        collectionId: {
          excludedGranuleIds: ['granuleId1'],
          granules: {},
          metadata: {
            mock: 'data'
          }
        }
      }
    }

    expect(collectionMetadataReducer(initial, action)).toEqual(expectedState)
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
      allIds: ['collectionId'],
      byId: {
        collectionId: {
          excludedGranuleIds: ['granuleId1', 'granuleId2'],
          granules: {},
          metadata: {
            mock: 'data'
          }
        }
      }
    }

    const expectedState = {
      ...initialState,
      allIds: ['collectionId'],
      byId: {
        collectionId: {
          excludedGranuleIds: ['granuleId1'],
          granules: {},
          metadata: {
            mock: 'data'
          }
        }
      }
    }

    expect(collectionMetadataReducer(initial, action)).toEqual(expectedState)
  })
})

describe('ADD_COLLECTION_GRANULES', () => {
  test('returns the correct state', () => {
    const granules = {
      allIds: ['mockGranuleId1'],
      byId: {
        mockGranuleId1: {
          id: 'mockGranuleId1',
          mockGranuleData: 'goes here 1'
        }
      },
      isCwic: false,
      hits: 1
    }
    const action = {
      type: ADD_COLLECTION_GRANULES,
      payload: {
        collectionId: 'collectionId',
        granules
      }
    }

    const expectedState = {
      ...initialState,
      byId: {
        collectionId: {
          granules
        }
      }
    }

    expect(collectionMetadataReducer(undefined, action)).toEqual(expectedState)
  })
})
