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
    const expectedAction = {
      type: EXPORT_STARTED
    }

    expect(onExportStarted()).toEqual(expectedAction)
  })
})

describe('onExportFinished', () => {
  test('should create an action to update the store', () => {
    const payload = { loaded: true }
    const expectedAction = {
      type: EXPORT_FINISHED
    }

    expect(onExportFinished(payload)).toEqual(expectedAction)
  })
})

describe('exportSearch', () => {
  test('calls lambda to get autocomplete suggestions', async () => {
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
      expect(storeActions[0]).toEqual({ type: EXPORT_STARTED })
      expect(storeActions[1]).toEqual({ type: EXPORT_FINISHED })

      expect(createObjectMock).toHaveBeenCalledTimes(1)
    })
  })

  test('does not call updateAutocompleteSuggestions on error', async () => {
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

    await store.dispatch(exportSearch({ value: 'test value' })).then(() => {
      const storeActions = store.getActions()
      expect(storeActions[0]).toEqual({ type: EXPORT_STARTED })
      expect(storeActions[1]).toEqual({ type: EXPORT_FINISHED })

      expect(consoleMock).toHaveBeenCalledTimes(1)
    })
  })
})
