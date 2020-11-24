import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import nock from 'nock'
import jwt from 'jsonwebtoken'

import { UPDATE_CONTACT_INFO } from '../../constants/actionTypes'
import {
  fetchContactInfo,
  setContactInfoFromJwt,
  updateContactInfo,
  updateNotificationLevel
} from '../contactInfo'

const mockStore = configureMockStore([thunk])

beforeEach(() => {
  jest.clearAllMocks()
})

describe('updateContactInfo', () => {
  test('should create an action to update the contact info', () => {
    const payload = { mock: 'payload' }
    const expectedAction = {
      type: UPDATE_CONTACT_INFO,
      payload
    }
    expect(updateContactInfo(payload)).toEqual(expectedAction)
  })
})

describe('setPreferencesFromJwt', () => {
  test('should create an action to update the store', () => {
    const contactInfo = {
      ursProfile: {
        first_name: 'Test'
      }
    }

    jest.spyOn(jwt, 'decode').mockImplementation(() => (contactInfo))

    const store = mockStore({})
    store.dispatch(setContactInfoFromJwt('mockJwt'))

    const storeActions = store.getActions()
    expect(storeActions[0]).toEqual({
      type: UPDATE_CONTACT_INFO,
      payload: contactInfo
    })
  })

  test('does not create an action if payload doesn\'t exist', () => {
    const store = mockStore({})
    store.dispatch(setContactInfoFromJwt())
    const storeActions = store.getActions()
    expect(storeActions.length).toBe(0)
  })
})

describe('fetchContactInfo', () => {
  test('should update the contact info with data from lambda', async () => {
    nock(/localhost/)
      .get(/contact_info/)
      .reply(200, {
        echo_preferences: { mock: 'echo' },
        urs_profile: { mock: 'urs' }
      })

    // mockStore with initialState
    const store = mockStore({
      authToken: 'mockToken'
    })

    // call the dispatch
    await store.dispatch(fetchContactInfo()).then(() => {
      const storeActions = store.getActions()
      expect(storeActions[0]).toEqual({
        type: UPDATE_CONTACT_INFO,
        payload: {
          echoPreferences: { mock: 'echo' },
          ursProfile: { mock: 'urs' }
        }
      })
    })
  })
})

describe('updateNotificationLevel', () => {
  const { href } = window.location

  afterEach(() => {
    jest.clearAllMocks()
    window.location.href = href
  })

  test('calls LogoutRequest, removes the cookie and redirects to the root url', async () => {
    nock(/localhost/)
      .post(/contact_info/)
      .reply(201, {
        preferences: { mock: 'echo' }
      })

    const store = mockStore({
      authToken: 'mockToken',
      contactInfo: {}
    })

    await store.dispatch(updateNotificationLevel('INFO')).then(() => {
      const storeActions = store.getActions()
      expect(storeActions[0]).toEqual({
        type: UPDATE_CONTACT_INFO,
        payload: {
          echoPreferences: { mock: 'echo' }
        }
      })
    })
  })
})
