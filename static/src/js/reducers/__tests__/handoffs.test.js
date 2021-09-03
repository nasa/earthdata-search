import handoffsReducer from '../handoffs'
import { SET_SOTO_LAYERS } from '../../constants/actionTypes'

describe('INITIAL_STATE', () => {
  test('is correct', () => {
    const action = { type: 'dummy_action' }
    const initialState = {
      sotoLayers: []
    }

    expect(handoffsReducer(undefined, action)).toEqual(initialState)
  })
})

describe('SET_SOTO_LAYERS', () => {
  test('returns the correct state', () => {
    const action = {
      type: SET_SOTO_LAYERS,
      payload: ['layer1']
    }

    const expectedState = {
      sotoLayers: ['layer1']
    }

    expect(handoffsReducer(undefined, action)).toEqual(expectedState)
  })
})
