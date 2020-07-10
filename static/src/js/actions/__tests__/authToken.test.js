import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import nock from 'nock'
import * as tinyCookie from 'tiny-cookie'

import { UPDATE_AUTH } from '../../constants/actionTypes'
import { logout, updateAuthToken, updateAuthTokenFromHeaders } from '../authToken'

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

    const storeActions = store.getActions()
    expect(storeActions[0]).toEqual({
      type: UPDATE_AUTH,
      payload: token
    })
  })

  test('should not remove the authToken if a header token is not available', () => {
    // mockStore with initialState
    const store = mockStore({
      authToken: 'authToken-token'
    })

    // call the dispatch
    store.dispatch(updateAuthTokenFromHeaders({}))

    const storeActions = store.getActions()

    expect(storeActions.length).toBe(0)
  })
})

describe('logout', () => {
  const { href } = window.location

  afterEach(() => {
    jest.clearAllMocks()
    window.location.href = href
  })

  test('calls LogoutRequest, removes the cookie and redirects to the root url', async () => {
    nock(/localhost/)
      .delete(/logout/)
      .reply(204)

    const store = mockStore({
      authToken: 'mockToken'
    })

    const removeMock = jest.spyOn(tinyCookie, 'remove')

    await store.dispatch(logout()).then(() => {
      expect(removeMock).toBeCalledTimes(1)
      expect(window.location.href).toEqual('http://localhost/')
    })
  })
})
