import nock from 'nock'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import {
  onExportStarted,
  onExportFinished,
  exportSearch
} from '../exportSearch'

import { EXPORT_FINISHED, EXPORT_STARTED } from '../../constants/actionTypes'
import * as sharedConfig from '../../../../../sharedUtils/config'


const MOCK_AUTH_TOKEN = '7SDFGI856gi12s36x7fe5duv5fb6bgds'
const MOCK_KEY = '00000000-0000-0000-0000-000000000000'
const MOCK_SIGNED_URL = 'http://0.0.0.0:5000/fake-signed-url'

const defaultApplicationConfig = sharedConfig.getApplicationConfig()

const mockStore = configureMockStore([thunk])

beforeEach(() => {
  jest.clearAllMocks()
})

afterEach(() => {
  jest.clearAllMocks()
})

describe('onExportStarted', () => {
  test('should create an action to update the store', () => {
    const payload = 'json'
    const expectedAction = {
      type: EXPORT_STARTED,
      payload
    }

    expect(onExportStarted(payload)).toEqual(expectedAction)
  })
})

describe('onExportFinished', () => {
  test('should create an action to update the store', () => {
    const payload = 'json'
    const expectedAction = {
      type: EXPORT_FINISHED,
      payload
    }

    expect(onExportFinished(payload)).toEqual(expectedAction)
  })
})

describe('exportSearch', () => {
  test('calls lambda to get csv search export', async () => {
    jest.spyOn(sharedConfig, 'getApplicationConfig').mockImplementation(() => ({
      ...defaultApplicationConfig,
      exportStatusRefreshTime: 1000 // prevents test timeout
    }))

    let clicked = false
    jest.spyOn(document, 'createElement').mockImplementation(() => ({
      setAttribute: jest.fn(),
      click: () => {
        clicked = true
      },
      parentNode: {
        removeChild: jest.fn()
      }
    }))
    document.body.appendChild = jest.fn()

    nock(/localhost/)
      .post(/export/)
      .reply(200, {
        key: MOCK_KEY
      })


    nock(/localhost/)
      .post(/export-check/)
      .reply(200, {
        state: 'DONE',
        url: MOCK_SIGNED_URL
      })

    // mockStore with initialState
    const store = mockStore({
      authToken: MOCK_AUTH_TOKEN
    })

    // call the dispatch
    await store.dispatch(exportSearch('csv')).then(() => {
      const storeActions = store.getActions()
      expect(storeActions[0]).toEqual({ type: EXPORT_STARTED, payload: 'csv' })
      expect(storeActions[1]).toEqual({ type: EXPORT_FINISHED, payload: 'csv' })
      expect(clicked).toEqual(true)
    })
  })

  test('calls lambda to get json search export', async () => {
    jest.spyOn(sharedConfig, 'getApplicationConfig').mockImplementation(() => ({
      ...defaultApplicationConfig,
      exportStatusRefreshTime: 1000 // prevents test timeout
    }))

    let clicked = false
    jest.spyOn(document, 'createElement').mockImplementation(() => ({
      setAttribute: jest.fn(),
      click: () => {
        clicked = true
      },
      parentNode: {
        removeChild: jest.fn()
      }
    }))
    document.body.appendChild = jest.fn()

    nock(/localhost/)
      .post(/export/)
      .reply(200, {
        key: MOCK_KEY
      })

    nock(/localhost/)
      .post(/export-check/)
      .reply(200, {
        state: 'DONE',
        url: MOCK_SIGNED_URL
      })

    // mockStore with initialState
    const store = mockStore({
      authToken: MOCK_AUTH_TOKEN
    })

    // call the dispatch
    await store.dispatch(exportSearch('json')).then(() => {
      const storeActions = store.getActions()
      expect(storeActions[0]).toEqual({ type: EXPORT_STARTED, payload: 'json' })
      expect(storeActions[1]).toEqual({ type: EXPORT_FINISHED, payload: 'json' })
      expect(clicked).toEqual(true)
    })
  })

  test('does not create a file on error', async () => {
    nock(/localhost/)
      .post(/export/)
      .reply(500)

    nock(/localhost/)
      .post(/error_logger/)
      .reply(200)

    const store = mockStore({
      authToken: MOCK_AUTH_TOKEN
    })

    const consoleMock = jest.spyOn(console, 'error').mockImplementation(() => jest.fn())

    await store.dispatch(exportSearch('json')).then(() => {
      const storeActions = store.getActions()
      expect(storeActions[0]).toEqual({ type: EXPORT_STARTED, payload: 'json' })
      expect(storeActions[1]).toEqual({ type: EXPORT_FINISHED, payload: 'json' })

      expect(consoleMock).toHaveBeenCalledTimes(1)
    })
  })
})
