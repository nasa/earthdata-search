import collectionMetadataReducer from '../collectionMetadata'
import {
  RESTORE_FROM_URL,
  UPDATE_COLLECTION_METADATA
} from '../../constants/actionTypes'

const initialState = {}

describe('INITIAL_STATE', () => {
  test('is correct', () => {
    const action = { type: 'dummy_action' }

    expect(collectionMetadataReducer(undefined, action)).toEqual(initialState)
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
