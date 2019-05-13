import collectionsReducer from '../collections'
import {
  UPDATE_COLLECTIONS,
  EXCLUDE_GRANULE_ID,
  ADD_COLLECTION_GRANULES
} from '../../constants/actionTypes'

const initialState = {
  allIds: [],
  byId: {},
  projectIds: []
}

describe('INITIAL_STATE', () => {
  test('is correct', () => {
    const action = { type: 'dummy_action' }

    expect(collectionsReducer(undefined, action)).toEqual(initialState)
  })
})

describe('UPDATE_COLLECTIONS', () => {
  test('returns the correct state when collection has not been visited yet', () => {
    const action = {
      type: UPDATE_COLLECTIONS,
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

    expect(collectionsReducer(undefined, action)).toEqual(expectedState)
  })

  test('returns the correct state when collection has been visited yet', () => {
    const action = {
      type: UPDATE_COLLECTIONS,
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

    expect(collectionsReducer(initial, action)).toEqual(expectedState)
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

    expect(collectionsReducer(initial, action)).toEqual(expectedState)
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

    expect(collectionsReducer(undefined, action)).toEqual(expectedState)
  })
})
