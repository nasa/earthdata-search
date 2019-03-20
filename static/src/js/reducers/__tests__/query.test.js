import queryReducer from '../query'
import { UPDATE_SEARCH_QUERY } from '../../constants/actionTypes'

describe('INITIAL_STATE', () => {
  test('is correct', () => {
    const action = { type: 'dummy_action' }
    const initialState = {
      keyword: '',
      spatial: {}
    }

    expect(queryReducer(undefined, action)).toEqual(initialState)
  })
})

describe('UPDATE_SEARCH_QUERY', () => {
  test('returns the correct state', () => {
    const payload = {
      keyword: 'new keyword',
      spatial: {
        point: '0,0'
      }
    }
    const action = {
      type: UPDATE_SEARCH_QUERY,
      payload
    }

    const expectedState = payload

    expect(queryReducer(undefined, action)).toEqual(expectedState)
  })

  test('does not overwrite existing values', () => {
    const initialState = {
      keyword: 'old keyword'
    }
    const payload = {
      spatial: {
        point: '0,0'
      }
    }
    const action = {
      type: UPDATE_SEARCH_QUERY,
      payload
    }
    const expectedState = {
      keyword: 'old keyword',
      spatial: {
        point: '0,0'
      }
    }

    expect(queryReducer(initialState, action)).toEqual(expectedState)
  })
})
