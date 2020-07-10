import panelsReducer from '../panels'
import {
  PANELS_TOGGLE,
  PANELS_SET_PANEL,
  PANELS_SET_PANEL_GROUP,
  PANELS_SET_PANEL_SECTION
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

describe('PANELS_SET_PANEL_GROUP', () => {
  test('returns the correct state', () => {
    const action = {
      type: PANELS_SET_PANEL_GROUP,
      payload: '1'
    }

    const expectedState = {
      ...initialState,
      isOpen: true,
      activePanel: '0.1.0'
    }

    expect(panelsReducer(undefined, action)).toEqual(expectedState)
  })
})

describe('PANELS_SET_PANEL_SECTION', () => {
  test('returns the correct state', () => {
    const action = {
      type: PANELS_SET_PANEL_SECTION,
      payload: '1'
    }

    const expectedState = {
      ...initialState,
      isOpen: true,
      activePanel: '1.0.0'
    }

    expect(panelsReducer(undefined, action)).toEqual(expectedState)
  })
})
