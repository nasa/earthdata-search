import projectReducer from '../project'
import {
  ADD_COLLECTION_TO_PROJECT,
  REMOVE_COLLECTION_FROM_PROJECT,
  RESTORE_PROJECT,
  SELECT_ACCESS_METHOD,
  UPDATE_ACCESS_METHOD
} from '../../constants/actionTypes'

const initialState = {
  byId: {},
  collectionIds: []
}

describe('INITIAL_STATE', () => {
  test('is correct', () => {
    const action = { type: 'dummy_action' }

    expect(projectReducer(undefined, action)).toEqual(initialState)
  })
})

describe('ADD_COLLECTION_TO_PROJECT', () => {
  test('returns the correct state', () => {
    const collectionId = 'collectionId'

    const action = {
      type: ADD_COLLECTION_TO_PROJECT,
      payload: collectionId
    }

    const initial = {
      ...initialState,
      collectionIds: ['existingCollectionId']
    }

    const expectedState = {
      ...initial,
      collectionIds: ['existingCollectionId', collectionId]
    }

    expect(projectReducer(initial, action)).toEqual(expectedState)
  })

  test('returns the correct state if collection is already a project collection', () => {
    const collectionId = 'collectionId'

    const action = {
      type: ADD_COLLECTION_TO_PROJECT,
      payload: collectionId
    }

    const initial = {
      ...initialState,
      collectionIds: [collectionId]
    }

    const expectedState = {
      ...initial,
      collectionIds: [collectionId]
    }

    expect(projectReducer(initial, action)).toEqual(expectedState)
  })
})

describe('REMOVE_COLLECTION_FROM_PROJECT', () => {
  test('returns the correct state', () => {
    const collectionId = 'collectionId'

    const action = {
      type: REMOVE_COLLECTION_FROM_PROJECT,
      payload: collectionId
    }

    const initial = {
      ...initialState,
      collectionIds: ['existingCollectionId', collectionId, 'anotherExistingCollectionId']
    }

    const expectedState = {
      ...initial,
      collectionIds: ['existingCollectionId', 'anotherExistingCollectionId']
    }

    expect(projectReducer(initial, action)).toEqual(expectedState)
  })
})

describe('RESTORE_PROJECT', () => {
  test('returns the correct state', () => {
    const collectionIds = ['collectionId']

    const action = {
      type: RESTORE_PROJECT,
      payload: {
        collectionIds
      }
    }

    const expectedState = {
      ...initialState,
      collectionIds: ['collectionId']
    }

    expect(projectReducer(undefined, action)).toEqual(expectedState)
  })
})

describe('SELECT_ACCESS_METHOD', () => {
  test('returns the correct state', () => {
    const collectionId = 'collectionId'

    const action = {
      type: SELECT_ACCESS_METHOD,
      payload: {
        collectionId,
        selectedAccessMethod: 'download'
      }
    }

    const expectedState = {
      ...initialState,
      byId: {
        collectionId: {
          selectedAccessMethod: 'download'
        }
      }
    }

    expect(projectReducer(undefined, action)).toEqual(expectedState)
  })
})

describe('UPDATE_ACCESS_METHOD', () => {
  test('returns the correct state', () => {
    const collectionId = 'collectionId'

    const action = {
      type: UPDATE_ACCESS_METHOD,
      payload: {
        collectionId,
        method: {
          download: {
            type: 'download'
          }
        }
      }
    }

    const expectedState = {
      ...initialState,
      byId: {
        collectionId: {
          accessMethods: {
            download: {
              type: 'download'
            }
          }
        }
      }
    }

    expect(projectReducer(undefined, action)).toEqual(expectedState)
  })
})
