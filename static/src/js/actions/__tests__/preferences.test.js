import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import nock from 'nock'
import jwt from 'jsonwebtoken'

import { SET_PREFERENCES_IS_SUBMITTING, SET_PREFERENCES, UPDATE_AUTH } from '../../constants/actionTypes'
import {
  setIsSubmitting,
  setPreferences,
  setPreferencesFromJwt,
  updatePreferences
} from '../preferences'

const mockStore = configureMockStore([thunk])

beforeEach(() => {
  jest.clearAllMocks()
})

describe('setIsSubmitting', () => {
  test('should create an action to update the store', () => {
    const expectedAction = {
      type: SET_PREFERENCES_IS_SUBMITTING,
      payload: true
    }

    expect(setIsSubmitting(true)).toEqual(expectedAction)
  })
})

describe('setPreferences', () => {
  test('should create an action to update the store', () => {
    const payload = {
      panelState: 'default'
    }
    const expectedAction = {
      type: SET_PREFERENCES,
      payload
    }

    expect(setPreferences(payload)).toEqual(expectedAction)
  })
})

describe('setPreferencesFromJwt', () => {
  test('should create an action to update the store', () => {
    const preferences = {
      panelState: 'default'
    }

    jest.spyOn(jwt, 'decode').mockImplementation(() => ({ preferences }))

    const store = mockStore({})
    store.dispatch(setPreferencesFromJwt('mockJwt'))

    const storeActions = store.getActions()
    expect(storeActions[0]).toEqual({
      type: SET_PREFERENCES,
      payload: preferences
    })
  })

  test('does not create an action if payload doesn\'t exist', () => {
    const store = mockStore({})
    store.dispatch(setPreferencesFromJwt())
    const storeActions = store.getActions()
    expect(storeActions.length).toBe(0)
  })
})

describe('updatePreferences', () => {
  test('should create an action to update the store', async () => {
    const preferences = {
      panelState: 'default'
    }

    nock(/localhost/)
      .post(/preferences/)
      .reply(200, {
        jwtToken: 'token'
      })

    jest.spyOn(jwt, 'decode').mockImplementation(() => ({ preferences }))

    const store = mockStore({
      authToken: 'token'
    })
    await store.dispatch(updatePreferences(preferences)).then(() => {
      const storeActions = store.getActions()
      expect(storeActions[0]).toEqual({
        type: SET_PREFERENCES_IS_SUBMITTING,
        payload: true
      })
      expect(storeActions[1]).toEqual({
        type: UPDATE_AUTH,
        payload: 'token'
      })
      expect(storeActions[2]).toEqual({
        type: SET_PREFERENCES,
        payload: preferences
      })
      expect(storeActions[3]).toEqual({
        type: SET_PREFERENCES_IS_SUBMITTING,
        payload: false
      })
    })
  })
})
