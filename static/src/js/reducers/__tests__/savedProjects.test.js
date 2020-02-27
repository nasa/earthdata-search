import savedProjectsReducer from '../savedProjects'
import {
  SET_SAVED_PROJECTS,
  SET_SAVED_PROJECTS_LOADING,
  REMOVE_SAVED_PROJECT
} from '../../constants/actionTypes'

const initialState = {
  projects: [],
  isLoading: false,
  isLoaded: false
}

describe('INITIAL_STATE', () => {
  test('is correct', () => {
    const action = { type: 'dummy_action' }

    expect(savedProjectsReducer(undefined, action)).toEqual(initialState)
  })
})

describe('SET_SAVED_PROJECTS_LOADING', () => {
  test('returns the correct state', () => {
    const action = {
      type: SET_SAVED_PROJECTS_LOADING
    }

    const expectedState = {
      projects: [],
      isLoading: true,
      isLoaded: false
    }

    expect(savedProjectsReducer(undefined, action)).toEqual(expectedState)
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

    const expectedState = {
      projects: [{
        id: 1,
        name: 'name 1'
      }, {
        id: 2,
        name: 'name 2'
      }],
      isLoading: false,
      isLoaded: true
    }

    expect(savedProjectsReducer(undefined, action)).toEqual(expectedState)
  })
})

describe('REMOVE_SAVED_PROJECT', () => {
  test('returns the correct state when data has been provided', () => {
    const action = {
      type: REMOVE_SAVED_PROJECT,
      payload: 2
    }

    const initial = {
      projects: [
        {
          id: 1,
          name: 'name 1'
        },
        {
          id: 2,
          name: 'name 2'
        },
        {
          id: 3,
          name: 'name 3'
        }
      ],
      isLoading: false,
      isLoaded: true
    }

    const expectedState = {
      projects: [
        {
          id: 1,
          name: 'name 1'
        },
        {
          id: 3,
          name: 'name 3'
        }
      ],
      isLoading: false,
      isLoaded: true
    }

    expect(savedProjectsReducer(initial, action)).toEqual(expectedState)
  })
})
