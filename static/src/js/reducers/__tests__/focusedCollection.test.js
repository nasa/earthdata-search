import focusedCollectionReducer from '../focusedCollection'
import { UPDATE_FOCUSED_COLLECTION } from '../../constants/actionTypes'

describe('INITIAL_STATE', () => {
  test('is correct', () => {
    const action = { type: 'dummy_action' }
    const initialState = {}

    expect(focusedCollectionReducer(undefined, action)).toEqual(initialState)
  })
})

describe('UPDATE_FOCUSED_COLLECTION', () => {
  test('returns the correct state', () => {
    const payload = {
      collectionId: 'newCollectionId',
      metadata: { metadata: 'here' }
    }

    const action = {
      type: UPDATE_FOCUSED_COLLECTION,
      payload
    }

    const expectedState = payload

    expect(focusedCollectionReducer(undefined, action)).toEqual(expectedState)
  })
})
