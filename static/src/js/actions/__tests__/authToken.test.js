import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import { UPDATE_AUTH } from '../../constants/actionTypes'
import { updateAuthToken, updateAuthTokenFromHeaders } from '../authToken'

const mockStore = configureMockStore([thunk])

beforeEach(() => {
  jest.clearAllMocks()
})

describe('updateAuthToken', () => {
  test('should create an action to update the authToken', () => {
    const payload = 'authToken-token'
    const expectedAction = {
      type: UPDATE_AUTH,
      payload
    }
    expect(updateAuthToken(payload)).toEqual(expectedAction)
  })
})

describe('updateAuthTokenFromHeaders', () => {
  test('should update the authToken from a header token if available', () => {
    const token = 'authToken-token'

    const payload = {
      'jwt-token': token
    }

    // mockStore with initialState
    const store = mockStore({
      authToken: ''
    })

    // call the dispatch
    store.dispatch(updateAuthTokenFromHeaders(payload))

    // Is updateCollectionQuery called with the right payload
    const storeActions = store.getActions()
    expect(storeActions[0]).toEqual({
      type: UPDATE_AUTH,
      payload: token
    })
  })

  test('should remove the authToken if a header token is not available', () => {
    // mockStore with initialState
    const store = mockStore({
      authToken: 'authToken-token'
    })

    // call the dispatch
    store.dispatch(updateAuthTokenFromHeaders({}))

    // Is updateCollectionQuery called with the right payload
    const storeActions = store.getActions()
    expect(storeActions[0]).toEqual({
      type: UPDATE_AUTH,
      payload: ''
    })
  })
})
