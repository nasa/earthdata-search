import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import nock from 'nock'
import * as tinyCookie from 'tiny-cookie'

import { UPDATE_AUTH } from '../../constants/actionTypes'
import { logout, updateAuthToken } from '../authToken'

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

describe('logout', () => {
  const { assign } = window.location

  afterEach(() => {
    jest.clearAllMocks()
    window.location.assign = assign
  })

  test('calls LogoutRequest, removes the cookie and redirects to the root url', async () => {
    nock(/localhost/)
      .delete(/logout/)
      .reply(204)

    const store = mockStore({
      authToken: 'mockToken',
      earthdataEnvironment: 'prod'
    })

    delete window.location
    window.location = { assign: jest.fn() }

    const removeMock = jest.spyOn(tinyCookie, 'remove')

    await store.dispatch(logout()).then(() => {
      expect(removeMock).toBeCalledTimes(1)
      expect(window.location.assign).toBeCalledTimes(1)
      expect(window.location.assign).toBeCalledWith('/search?ee=prod')
    })
  })
})
