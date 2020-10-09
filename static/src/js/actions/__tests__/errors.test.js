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
    const payload = {
      id: 1,
      title: 'title',
      message: 'message'
    }

    const expectedAction = {
      type: ADD_ERROR,
      payload
    }

    await store.dispatch(addError(payload))
    const storeActions = store.getActions()
    expect(storeActions[0]).toEqual(expectedAction)
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
