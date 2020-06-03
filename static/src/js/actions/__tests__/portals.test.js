import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import { ADD_PORTAL } from '../../constants/actionTypes'
import { addPortal, loadPortalConfig } from '../portals'

const mockStore = configureMockStore([thunk])

beforeEach(() => {
  jest.clearAllMocks()
})

describe('addPortal', () => {
  test('should create an action to add portal configs', () => {
    const payload = {
      portalId: 'simple',
      query: {
        echoCollectionId: 'C203234523-LAADS'
      },
      title: 'Simple'
    }

    const expectedAction = {
      type: ADD_PORTAL,
      payload
    }

    expect(addPortal(payload)).toEqual(expectedAction)
  })
})

describe('loadPortalConfig', () => {
  test('should load the portal config from a file', () => {
    const portalId = 'simple'

    const payload = {
      portalId: 'simple',
      hasStyles: false,
      hasScripts: false,
      query: {
        echoCollectionId: 'C203234523-LAADS'
      }
    }

    // mockStore with initialState
    const store = mockStore()

    // call the dispatch
    store.dispatch(loadPortalConfig(portalId))

    const storeActions = store.getActions()
    expect(storeActions[0]).toEqual({
      type: ADD_PORTAL,
      payload
    })
  })
})
