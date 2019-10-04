import portalsReducer from '../portals'
import { ADD_PORTAL } from '../../constants/actionTypes'

describe('INITIAL_STATE', () => {
  test('is correct', () => {
    const action = { type: 'dummy_action' }
    const initialState = {
      portalId: ''
    }

    expect(portalsReducer(undefined, action)).toEqual(initialState)
  })
})

describe('ADD_PORTAL', () => {
  test('returns the correct state', () => {
    const payload = {
      portalId: 'simple',
      hasStyles: false,
      hasScripts: false,
      query: {
        echoCollectionId: 'C203234523-LAADS'
      },
      title: 'Simple'
    }

    const action = {
      type: ADD_PORTAL,
      payload
    }

    expect(portalsReducer(undefined, action)).toEqual(payload)
  })
})
