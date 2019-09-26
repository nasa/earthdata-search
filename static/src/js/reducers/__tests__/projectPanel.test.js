import projectPanelsReducer from '../projectPanels'
import {
  PROJECT_PANELS_TOGGLE,
  PROJECT_PANELS_SET_PANEL
} from '../../constants/actionTypes'

const initialState = {
  isOpen: true,
  activePanel: '0.0.0'
}

describe('INITIAL_STATE', () => {
  test('is correct', () => {
    const action = { type: 'dummy_action' }

    expect(projectPanelsReducer(undefined, action)).toEqual(initialState)
  })
})

describe('PROJECT_PANELS_TOGGLE', () => {
  test('returns the correct state', () => {
    const action = {
      type: PROJECT_PANELS_TOGGLE,
      payload: false
    }

    const expectedState = {
      ...initialState,
      isOpen: false
    }

    expect(projectPanelsReducer(undefined, action)).toEqual(expectedState)
  })
})

describe('PROJECT_PANELS_SET_PANEL', () => {
  test('returns the correct state', () => {
    const action = {
      type: PROJECT_PANELS_SET_PANEL,
      payload: '0.0.1'
    }

    const expectedState = {
      ...initialState,
      isOpen: true,
      activePanel: '0.0.1'
    }

    expect(projectPanelsReducer(undefined, action)).toEqual(expectedState)
  })
})
