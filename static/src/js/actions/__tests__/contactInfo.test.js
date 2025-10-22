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

import addToast from '../../util/addToast'
import useEdscStore from '../../zustand/useEdscStore'
import { testJwtToken } from './mocks'

jest.mock('../../util/addToast', () => ({
  __esModule: true,
  default: jest.fn()
}))

const mockStore = configureMockStore([thunk])

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
        cmr_preferences: { mock: 'cmr' },
        urs_profile: { mock: 'urs' }
      })

    // MockStore with initialState
    const store = mockStore({
      authToken: 'mockToken'
    })

    // Call the dispatch
    await store.dispatch(fetchContactInfo()).then(() => {
      const storeActions = store.getActions()
      expect(storeActions[0]).toEqual({
        type: UPDATE_CONTACT_INFO,
        payload: {
          cmrPreferences: { mock: 'cmr' },
          ursProfile: { mock: 'urs' }
        }
      })
    })
  })
})

describe('updateNotificationLevel', () => {
  test('calls updateContactInfo on success', async () => {
    nock(/localhost/)
      .post(/contact_info/)
      .reply(200, {
        mock: 'cmr'
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
          cmrPreferences: { mock: 'cmr' }
        }
      })

      expect(addToast).toHaveBeenCalledTimes(1)
      expect(addToast).toHaveBeenCalledWith('Notification Preference Level updated', {
        appearance: 'success',
        autoDismiss: true
      })
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

    const mockHandleError = jest.fn()
    useEdscStore.setState({
      errors: {
        ...useEdscStore.getState().errors,
        handleError: mockHandleError
      }
    })

    const store = mockStore({
      authToken: 'mockToken',
      contactInfo: {}
    })

    await store.dispatch(updateNotificationLevel('INFO')).then(() => {
      expect(mockHandleError).toHaveBeenCalledTimes(1)
      expect(mockHandleError).toHaveBeenCalledWith(expect.objectContaining({
        action: 'updateNotificationLevel',
        resource: 'contactInfo',
        verb: 'updating'
      }))
    })
  })
})
