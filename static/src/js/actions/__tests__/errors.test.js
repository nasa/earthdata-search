import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import nock from 'nock'
import { ADD_ERROR, REMOVE_ERROR } from '../../constants/actionTypes'
import {
  addError,
  removeError,
  handleError
} from '../errors'

import * as addToast from '../../util/addToast'

const mockStore = configureMockStore([thunk])

describe('addError', () => {
  test('should call addToast with correct params', async () => {
    const addToastMock = jest.spyOn(addToast, 'addToast')

    const store = mockStore({})
    const toastPayload = {
      id: 1,
      title: 'title',
      message: 'message',
      notificationType: 'toast'
    }

    const bannerPayload = {
      id: 1,
      title: 'title',
      message: 'Banner payload message.',
      notificationType: 'banner'
    }

    const nonePayload = {
      id: 1,
      title: 'title',
      message: 'message',
      notificationType: 'none'
    }

    const expectedAction0 = {
      type: ADD_ERROR,
      payload: bannerPayload
    }

    await store.dispatch(addError(toastPayload))

    let storeActions = store.getActions()

    // No action should be pushed
    expect(storeActions.length).toEqual(0)
    expect(addToastMock).toHaveBeenCalledTimes(1)
    expect(addToastMock).toHaveBeenCalledWith(toastPayload.message, {
      appearance: 'error',
      autoDismiss: false
    })

    await store.dispatch(addError(bannerPayload))

    storeActions = store.getActions()

    // Action does get pushed
    expect(storeActions[0]).toEqual(expectedAction0)
    expect(storeActions[0].type).toEqual(ADD_ERROR)

    await store.dispatch(addError(nonePayload))

    storeActions = store.getActions()

    // No new action pushed
    expect(storeActions.length).toEqual(1)
  })
})

describe('removeError', () => {
  test('should create an action to update the authToken', () => {
    const payload = 1

    const expectedAction = {
      type: REMOVE_ERROR,
      payload
    }

    expect(removeError(payload)).toEqual(expectedAction)
  })
})

describe('handleError', () => {
  let consoleMock

  beforeEach(() => {
    consoleMock = jest.spyOn(console, 'error').mockImplementation(() => jest.fn())

    nock(/localhost/)
      .post(/error_logger/)
      .reply(200)
  })

  afterEach(() => {
    consoleMock.mockRestore()
  })

  test('should handle tophat alerts button click when onAlertsClick is triggered', async () => {
    const mockClick = jest.fn()
    const mockButton = { click: mockClick }
    const mockQuerySelector = jest.spyOn(document, 'querySelector').mockReturnValue(mockButton)

    jest.useFakeTimers()

    const store = mockStore({})

    await store.dispatch(handleError({
      error: new Error('CMR error'),
      action: 'fetchSubscriptions',
      resource: 'collections'
    }))

    const storeActions = store.getActions()
    const messageComponent = storeActions[0].payload.message
    const { onAlertsClick } = messageComponent.props

    onAlertsClick()

    // Fast-forward timers to trigger the setTimeout
    jest.runAllTimers()

    expect(mockQuerySelector).toHaveBeenCalledWith('.th-status-link')
    expect(mockClick).toHaveBeenCalledTimes(1)

    jest.useRealTimers()
  })
})
