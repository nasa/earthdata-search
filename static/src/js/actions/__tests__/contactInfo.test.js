import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import nock from 'nock'

import { UPDATE_CONTACT_INFO } from '../../constants/actionTypes'
import { fetchContactInfo, updateContactInfo, updateNotificationLevel } from '../contactInfo'

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
