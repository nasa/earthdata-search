import focusedCollectionReducer from '../focusedCollection'
import { UPDATE_FOCUSED_COLLECTION, RESTORE_FROM_URL } from '../../constants/actionTypes'

describe('INITIAL_STATE', () => {
  test('is correct', () => {
    const action = { type: 'dummy_action' }
    const initialState = ''

    expect(focusedCollectionReducer(undefined, action)).toEqual(initialState)
  })
})

describe('UPDATE_FOCUSED_COLLECTION', () => {
  test('returns the correct state', () => {
    const payload = 'newCollectionId'

    const action = {
      type: UPDATE_FOCUSED_COLLECTION,
      payload
    }

    const expectedState = payload

    expect(focusedCollectionReducer(undefined, action)).toEqual(expectedState)
  })
})

describe('RESTORE_FROM_URL', () => {
  test('returns the correct state', () => {
    const action = {
      type: RESTORE_FROM_URL,
      payload: {
        focusedCollection: ''
      }
    }

    const expectedState = ''

    expect(focusedCollectionReducer(undefined, action)).toEqual(expectedState)
  })
})
