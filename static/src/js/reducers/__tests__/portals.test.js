import portalsReducer from '../portals'
import { RESTORE_FROM_URL } from '../../constants/actionTypes'

describe('INITIAL_STATE', () => {
  test('is correct', () => {
    const action = { type: 'dummy_action' }
    const initialState = {
      portalId: ''
    }

    expect(portalsReducer(undefined, action)).toEqual(initialState)
  })
})

describe('RESTORE_FROM_URL', () => {
  test('returns the correct state', () => {
    const payload = {
      portal: {
        portalId: 'example',
        hasStyles: false,
        hasScripts: false,
        query: {
          echoCollectionId: 'C203234523-LAADS'
        },
        title: 'Example'
      }
    }

    const action = {
      type: RESTORE_FROM_URL,
      payload
    }

    expect(portalsReducer(undefined, action)).toEqual(payload.portal)
  })
})
