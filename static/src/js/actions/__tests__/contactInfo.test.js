import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import nock from 'nock'

import { UPDATE_CONTACT_INFO } from '../../constants/actionTypes'
import {
  fetchContactInfo,
  setContactInfoFromJwt,
  updateContactInfo,
  updateNotificationLevel
} from '../contactInfo'

import * as addToast from '../../util/addToast'
import { testJwtToken } from './mocks'

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

describe('setContactInfoFromJwt', () => {
  test('should create an action to update the store', () => {
    const contactInfo = {
      ursProfile: {
        first_name: 'test'
      }
    }

    const store = mockStore({})
    store.dispatch(setContactInfoFromJwt(testJwtToken))

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
  test('calls updateContactInfo on success', async () => {
    const addToastMock = jest.spyOn(addToast, 'addToast')

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

      expect(addToastMock.mock.calls.length).toBe(1)
      expect(addToastMock.mock.calls[0][0]).toEqual('Notification Preference Level updated')
      expect(addToastMock.mock.calls[0][1].appearance).toEqual('success')
      expect(addToastMock.mock.calls[0][1].autoDismiss).toEqual(true)
    })
  })

  test('does not call updateContactInfo on error', async () => {
    nock(/localhost/)
      .post(/contact_info/)
      .reply(500, {
        errors: ['An error occured.']
      })

    nock(/localhost/)
      .post(/error_logger/)
      .reply(200)

    const store = mockStore({
      authToken: 'mockToken',
      contactInfo: {}
    })

    const consoleMock = jest.spyOn(console, 'error').mockImplementationOnce(() => jest.fn())

    await store.dispatch(updateNotificationLevel('INFO')).then(() => {
      expect(consoleMock).toHaveBeenCalledTimes(1)
    })
  })
})
