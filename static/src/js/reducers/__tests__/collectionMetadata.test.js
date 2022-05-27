import collectionMetadataReducer from '../collectionMetadata'
import {
  DELETE_COLLECTION_SUBSCRIPTION,
  RESTORE_FROM_URL,
  UPDATE_COLLECTION_METADATA,
  UPDATE_GRANULE_SUBSCRIPTION,
  UPDATE_GRANULE_SUBSCRIPTIONS
} from '../../constants/actionTypes'

const initialState = {}

describe('INITIAL_STATE', () => {
  test('is correct', () => {
    const action = { type: 'dummy_action' }

    expect(collectionMetadataReducer(undefined, action)).toEqual(initialState)
  })
})

describe('UPDATE_GRANULE_SUBSCRIPTIONS', () => {
  test('returns the correct state', () => {
    const action = {
      type: UPDATE_GRANULE_SUBSCRIPTIONS,
      payload: {
        collectionId: 'collectionId',
        subscriptions: {
          items: [
            'new items'
          ]
        }
      }
    }

    const initial = {
      collectionId: {
        id: 'collectionId',
        conceptId: 'collectionId',
        subscriptions: {
          items: [
            'original items'
          ]
        }
      }
    }

    const expectedState = {
      collectionId: {
        id: 'collectionId',
        conceptId: 'collectionId',
        subscriptions: {
          items: [
            'new items'
          ]
        }
      }
    }

    expect(collectionMetadataReducer(initial, action)).toEqual(expectedState)
  })
})

describe('DELETE_COLLECTION_SUBSCRIPTION', () => {
  test('returns the correct state', () => {
    const action = {
      type: DELETE_COLLECTION_SUBSCRIPTION,
      payload: {
        collectionConceptId: 'collectionId',
        conceptId: 'SUB-1'
      }
    }

    const initial = {
      collectionId: {
        id: 'collectionId',
        conceptId: 'collectionId',
        subscriptions: {
          count: 2,
          items: [
            {
              conceptId: 'SUB-1'
            },
            {
              conceptId: 'SUB-2'
            }
          ]
        }
      }
    }

    const expectedState = {
      collectionId: {
        id: 'collectionId',
        conceptId: 'collectionId',
        subscriptions: {
          count: 1,
          items: [
            {
              conceptId: 'SUB-2'
            }
          ]
        }
      }
    }

    expect(collectionMetadataReducer(initial, action)).toEqual(expectedState)
  })
})

describe('UPDATE_GRANULE_SUBSCRIPTION', () => {
  test('returns the correct state', () => {
    const action = {
      type: UPDATE_GRANULE_SUBSCRIPTION,
      payload: {
        collectionConceptId: 'collectionId',
        conceptId: 'SUB-1',
        query: 'query=updated'
      }
    }

    const initial = {
      collectionId: {
        id: 'collectionId',
        conceptId: 'collectionId',
        subscriptions: {
          count: 2,
          items: [
            {
              conceptId: 'SUB-1',
              query: 'query=one'
            },
            {
              conceptId: 'SUB-2',
              query: 'query=two'
            }
          ]
        }
      }
    }

    const expectedState = {
      collectionId: {
        id: 'collectionId',
        conceptId: 'collectionId',
        subscriptions: {
          count: 2,
          items: [
            {
              conceptId: 'SUB-1',
              query: 'query=updated'
            },
            {
              conceptId: 'SUB-2',
              query: 'query=two'
            }
          ]
        }
      }
    }

    expect(collectionMetadataReducer(initial, action)).toEqual(expectedState)
  })
})

describe('UPDATE_COLLECTION_METADATA', () => {
  test('returns the correct state', () => {
    const action = {
      type: UPDATE_COLLECTION_METADATA,
      payload: [{
        id: 'collectionId',
        graphqlMock: 'new metadata'
      }]
    }

    const initial = {
      collectionId: {
        id: 'collectionId',
        conceptId: 'collectionId',
        mock: 'metadata'
      }
    }

    const expectedState = {
      collectionId: {
        id: 'collectionId',
        conceptId: 'collectionId',
        mock: 'metadata',
        graphqlMock: 'new metadata'
      }
    }

    expect(collectionMetadataReducer(initial, action)).toEqual(expectedState)
  })
})

describe('RESTORE_FROM_URL', () => {
  test('return the correct state', () => {
    const payload = {
      allIds: ['collectionId'],
      byId: {
        collectionId: {
          excludedGranuleIds: ['granuleId1'],
          granules: {},
          metadata: {}
        }
      }
    }
    const action = {
      type: RESTORE_FROM_URL,
      payload: { collections: payload }
    }

    const expectedState = {
      ...initialState,
      ...payload
    }

    expect(collectionMetadataReducer(undefined, action)).toEqual(expectedState)
  })
})
