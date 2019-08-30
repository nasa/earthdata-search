import savedProjectReducer from '../savedProject'
import { UPDATE_SAVED_PROJECT } from '../../constants/actionTypes'

describe('INITIAL_STATE', () => {
  test('is correct', () => {
    const action = { type: 'dummy_action' }
    const initialState = {
      projectId: null,
      name: '',
      path: null
    }

    expect(savedProjectReducer(undefined, action)).toEqual(initialState)
  })
})

describe('UPDATE_SAVED_PROJECT', () => {
  test('returns the correct state', () => {
    const payload = {
      projectId: 1,
      name: 'test project',
      path: '/search'
    }

    const action = {
      type: UPDATE_SAVED_PROJECT,
      payload
    }

    expect(savedProjectReducer(undefined, action)).toEqual(payload)
  })

  test('does not overwrite existing data', () => {
    const initial = {
      projectId: 1,
      path: '/search'
    }

    const payload = {
      name: 'test project'
    }

    const action = {
      type: UPDATE_SAVED_PROJECT,
      payload
    }

    const expectedResult = {
      ...initial,
      ...payload
    }

    expect(savedProjectReducer(initial, action)).toEqual(expectedResult)
  })
})
