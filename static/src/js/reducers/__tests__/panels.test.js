import panelsReducer from '../panels'
import {
  PANELS_TOGGLE,
  PANELS_SET_PANEL
} from '../../constants/actionTypes'

const initialState = {
  isOpen: true,
  activePanel: '0.0.0'
}

describe('INITIAL_STATE', () => {
  test('is correct', () => {
    const action = { type: 'dummy_action' }

    expect(panelsReducer(undefined, action)).toEqual(initialState)
  })
})

describe('PANELS_TOGGLE', () => {
  test('returns the correct state', () => {
    const action = {
      type: PANELS_TOGGLE,
      payload: false
    }

    const expectedState = {
      ...initialState,
      isOpen: false
    }

    expect(panelsReducer(undefined, action)).toEqual(expectedState)
  })
})

describe('PANELS_SET_PANEL', () => {
  test('returns the correct state', () => {
    const action = {
      type: PANELS_SET_PANEL,
      payload: '0.0.1'
    }

    const expectedState = {
      ...initialState,
      isOpen: true,
      activePanel: '0.0.1'
    }

    expect(panelsReducer(undefined, action)).toEqual(expectedState)
  })
})
