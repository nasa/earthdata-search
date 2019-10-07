jest.mock('browser-detect', () => jest.fn())

import MockedBrowserDetect from 'browser-detect'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import {
  updateBrowserVersion
} from '../browser'

import {
  UPDATE_BROWSER_VERSION
} from '../../constants/actionTypes'

const mockStore = configureMockStore([thunk])

beforeEach(() => {
  jest.clearAllMocks()
})

describe('updateBrowserVersion', () => {
  test('should detect the browser and pass it as the payload', () => {
    MockedBrowserDetect.mockImplementation(() => ({
      name: 'some browser name',
      version: '10.0.0',
      versionNumber: 10.0
    }))

    const store = mockStore({
      browser: {}
    })

    const payload = ['test payload']
    store.dispatch(updateBrowserVersion(payload))

    const storeActions = store.getActions()

    expect(MockedBrowserDetect).toHaveBeenCalledTimes(1)
    expect(storeActions[0]).toEqual({
      type: UPDATE_BROWSER_VERSION,
      payload: {
        name: 'some browser name',
        version: '10.0.0',
        versionNumber: 10.0
      }
    })
  })
})
