import nock from 'nock'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import {
  onExportStarted,
  onExportFinished,
  exportSearch
} from '../exportSearch'

import { EXPORT_FINISHED, EXPORT_STARTED } from '../../constants/actionTypes'

const mockStore = configureMockStore([thunk])

beforeEach(() => {
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
    const createObjectMock = jest.fn()
    window.URL.createObjectURL = createObjectMock
    jest.spyOn(document, 'createElement').mockImplementation(() => ({
      setAttribute: jest.fn(),
      click: jest.fn(),
      parentNode: {
        removeChild: jest.fn()
      }
    }))
    document.body.appendChild = jest.fn()

    nock(/localhost/)
      .post(/export/)
      .reply(200, [
        {
          mock: 'data'
        }
      ])

    // mockStore with initialState
    const store = mockStore({
      authToken: ''
    })

    // call the dispatch
    await store.dispatch(exportSearch('csv')).then(() => {
      const storeActions = store.getActions()
      expect(storeActions[0]).toEqual({ type: EXPORT_STARTED, payload: 'csv' })
      expect(storeActions[1]).toEqual({ type: EXPORT_FINISHED, payload: 'csv' })

      expect(createObjectMock).toHaveBeenCalledTimes(1)
    })
  })

  test('calls lambda to get json search export', async () => {
    const createObjectMock = jest.fn()
    window.URL.createObjectURL = createObjectMock
    jest.spyOn(document, 'createElement').mockImplementation(() => ({
      setAttribute: jest.fn(),
      click: jest.fn(),
      parentNode: {
        removeChild: jest.fn()
      }
    }))
    document.body.appendChild = jest.fn()

    nock(/localhost/)
      .post(/export/)
      .reply(200, [
        {
          mock: 'data'
        }
      ])

    // mockStore with initialState
    const store = mockStore({
      authToken: ''
    })

    // call the dispatch
    await store.dispatch(exportSearch('json')).then(() => {
      const storeActions = store.getActions()
      expect(storeActions[0]).toEqual({ type: EXPORT_STARTED, payload: 'json' })
      expect(storeActions[1]).toEqual({ type: EXPORT_FINISHED, payload: 'json' })

      expect(createObjectMock).toHaveBeenCalledTimes(1)
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
      authToken: ''
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
