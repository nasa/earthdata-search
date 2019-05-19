import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import { UPDATE_AUTH } from '../../constants/actionTypes'
import { updateAuth, updateAuthFromHeaders } from '../auth'

const mockStore = configureMockStore([thunk])

beforeEach(() => {
  jest.clearAllMocks()
})

describe('updateAuth', () => {
  test('should create an action to update the auth', () => {
    const payload = 'auth-token'
    const expectedAction = {
      type: UPDATE_AUTH,
      payload
    }
    expect(updateAuth(payload)).toEqual(expectedAction)
  })
})

describe('updateAuthFromHeaders', () => {
  test('should update the auth from a header token if available', () => {
    const token = 'auth-token'

    const payload = {
      'jwt-token': token
    }

    // mockStore with initialState
    const store = mockStore({
      auth: ''
    })

    // call the dispatch
    store.dispatch(updateAuthFromHeaders(payload))

    // Is updateCollectionQuery called with the right payload
    const storeActions = store.getActions()
    expect(storeActions[0]).toEqual({
      type: UPDATE_AUTH,
      payload: token
    })
  })

  test('should remove the auth if a header token is not available', () => {
    // mockStore with initialState
    const store = mockStore({
      auth: 'auth-token'
    })

    // call the dispatch
    store.dispatch(updateAuthFromHeaders({}))

    // Is updateCollectionQuery called with the right payload
    const storeActions = store.getActions()
    expect(storeActions[0]).toEqual({
      type: UPDATE_AUTH,
      payload: ''
    })
  })
})
