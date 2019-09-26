import errorsReducer from '../errors'
import { ADD_ERROR, REMOVE_ERROR } from '../../constants/actionTypes'

describe('INITIAL_STATE', () => {
  test('is correct', () => {
    const action = { type: 'dummy_action' }
    const initialState = []

    expect(errorsReducer(undefined, action)).toEqual(initialState)
  })
})

describe('ADD_ERROR', () => {
  test('returns the correct state', () => {
    const payload = {
      id: 1,
      title: 'Test Error',
      message: 'error message'
    }

    const action = {
      type: ADD_ERROR,
      payload
    }

    const expectedState = [payload]

    expect(errorsReducer(undefined, action)).toEqual(expectedState)
  })
})

describe('REMOVE_ERROR', () => {
  test('returns the correct state', () => {
    const payload = 1

    const action = {
      type: REMOVE_ERROR,
      payload
    }

    const initial = [{
      id: 1,
      title: 'Test Error',
      message: 'error message'
    }, {
      id: 2,
      title: 'Test Error 2',
      message: 'error message 2'
    }]

    const expectedState = [{
      id: 2,
      title: 'Test Error 2',
      message: 'error message 2'
    }]

    expect(errorsReducer(initial, action)).toEqual(expectedState)
  })
})
