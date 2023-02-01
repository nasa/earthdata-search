import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import { SET_USER } from '../../constants/actionTypes'
import {
  setUser,
  setUserFromJwt
} from '../user'
import { testJwtToken } from './mocks'

const mockStore = configureMockStore([thunk])

beforeEach(() => {
  jest.clearAllMocks()
})

describe('setUser', () => {
  test('should create an action to update the user', () => {
    const payload = { mock: 'payload' }
    const expectedAction = {
      type: SET_USER,
      payload
    }

    expect(setUser(payload)).toEqual(expectedAction)
  })
})

describe('setUserFromJwt', () => {
  test('should create an action to update the store', () => {
    const user = {
      username: 'testuser'
    }

    const store = mockStore({})
    store.dispatch(setUserFromJwt(testJwtToken))

    const storeActions = store.getActions()
    expect(storeActions[0]).toEqual({
      type: SET_USER,
      payload: user
    })
  })
})
