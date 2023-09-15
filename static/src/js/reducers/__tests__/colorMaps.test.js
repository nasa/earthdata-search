import colorMapsReducer from '../colorMaps'

import {
  ERRORED_COLOR_MAPS,
  SET_COLOR_MAPS_LOADING,
  SET_COLOR_MAPS_LOADED
} from '../../constants/actionTypes'

const initialState = {}

describe('INITIAL_STATE', () => {
  test('is correct', () => {
    const action = { type: 'dummy_action' }

    expect(colorMapsReducer(undefined, action)).toEqual(initialState)
  })
})

describe('SET_COLOR_MAPS_LOADING', () => {
  test('returns the correct state', () => {
    const product = 'AMSR2_Cloud_Liquid_Water_Day'

    const action = {
      type: SET_COLOR_MAPS_LOADING,
      payload: { product }
    }

    const expectedState = {
      ...initialState,
      [product]: {
        isLoading: true,
        isErrored: false,
        isLoaded: false,
        jsondata: {}
      }
    }

    expect(colorMapsReducer(undefined, action)).toEqual(expectedState)
  })
})

describe('SET_COLOR_MAPS_LOADED', () => {
  test('returns the correct state', () => {
    const product = 'AMSR2_Cloud_Liquid_Water_Day'

    const action = {
      type: SET_COLOR_MAPS_LOADED,
      payload: { product, jsondata: { hello: 1 } }
    }

    const expectedState = {
      ...initialState,
      [product]: {
        isLoading: false,
        isErrored: false,
        isLoaded: true,
        jsondata: { hello: 1 }
      }
    }

    expect(colorMapsReducer(undefined, action)).toEqual(expectedState)
  })
})

describe('SET_COLOR_MAPS_ERRORED', () => {
  test('returns the correct state', () => {
    const product = 'AMSR2_Cloud_Liquid_Water_Day'

    const action = {
      type: ERRORED_COLOR_MAPS,
      payload: { product }
    }

    const expectedState = {
      ...initialState,
      [product]: {
        isLoading: false,
        isErrored: true,
        isLoaded: false,
        jsondata: {}
      }
    }

    expect(colorMapsReducer(undefined, action)).toEqual(expectedState)
  })
})
