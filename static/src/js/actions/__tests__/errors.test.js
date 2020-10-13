import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import { ADD_ERROR, REMOVE_ERROR } from '../../constants/actionTypes'
import { addError, removeError } from '../errors'

const mockStore = configureMockStore([thunk])

beforeEach(() => {
  jest.clearAllMocks()
})

describe('addError', () => {
  test('should create an action to update the authToken', async () => {
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
      message: 'message',
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
    // no action should be pushed
    expect(storeActions.length).toEqual(0)

    await store.dispatch(addError(bannerPayload))
    storeActions = store.getActions()
    // Action does get pushed
    expect(storeActions[0]).toEqual(expectedAction0)

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
