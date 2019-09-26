import savedProjectsReducer from '../savedProjects'
import { SET_SAVED_PROJECTS } from '../../constants/actionTypes'

const initialState = []

describe('INITIAL_STATE', () => {
  test('is correct', () => {
    const action = { type: 'dummy_action' }

    expect(savedProjectsReducer(undefined, action)).toEqual(initialState)
  })
})

describe('SET_SAVED_PROJECTS', () => {
  test('returns the correct state', () => {
    const action = {
      type: SET_SAVED_PROJECTS,
      payload: [{
        id: 1,
        name: 'name 1'
      }, {
        id: 2,
        name: 'name 2'
      }]
    }

    const expectedState = [{
      id: 1,
      name: 'name 1'
    }, {
      id: 2,
      name: 'name 2'
    }]

    expect(savedProjectsReducer(undefined, action)).toEqual(expectedState)
  })
})
