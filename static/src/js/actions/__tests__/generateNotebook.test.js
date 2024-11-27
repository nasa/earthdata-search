import nock from 'nock'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import {
  onGenerateNotebookStarted,
  onGenerateNotebookFinished,
  generateNotebook
} from '../generateNotebook'

import { GENERATE_NOTEBOOK_FINISHED, GENERATE_NOTEBOOK_STARTED } from '../../constants/actionTypes'

const mockStore = configureMockStore([thunk])

beforeEach(() => {
  jest.clearAllMocks()
})

describe('onGenerateNotebookStarted', () => {
  test('should create an action to update the store', () => {
    const payload = 'json'
    const expectedAction = {
      type: GENERATE_NOTEBOOK_STARTED,
      payload
    }

    expect(onGenerateNotebookStarted(payload)).toEqual(expectedAction)
  })
})

describe('onGenerateNotebookFinished', () => {
  test('should create an action to update the store', () => {
    const payload = 'json'
    const expectedAction = {
      type: GENERATE_NOTEBOOK_FINISHED,
      payload
    }

    expect(onGenerateNotebookFinished(payload)).toEqual(expectedAction)
  })
})

describe('generateNotebook', () => {
  test('calls lambda to generate a notebook', async () => {
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
      .post(/generate_notebook/)
      .reply(
        200,
        [
          {
            mock: 'data'
          }
        ],
        {
          'content-disposition': 'attachment; filename="mock-data.ipynb"'
        }
      )

    // MockStore with initialState
    const store = mockStore({
      authToken: ''
    })

    const notebookParams = {
      granuleId: 'G123456789-PROV1'
    }

    // Call the dispatch
    await store.dispatch(generateNotebook(notebookParams)).then(() => {
      const storeActions = store.getActions()
      expect(storeActions[0]).toEqual({
        type: GENERATE_NOTEBOOK_STARTED,
        payload: 'G123456789-PROV1'
      })

      expect(storeActions[1]).toEqual({
        type: GENERATE_NOTEBOOK_FINISHED,
        payload: 'G123456789-PROV1'
      })

      expect(createObjectMock).toHaveBeenCalledTimes(1)
    })
  })

  test('does not create a file on error', async () => {
    nock(/localhost/)
      .post(/generate_notebook/)
      .reply(500)

    nock(/localhost/)
      .post(/error_logger/)
      .reply(200)

    const store = mockStore({
      authToken: ''
    })

    const notebookParams = {
      granuleId: 'G123456789-PROV1'
    }

    const consoleMock = jest.spyOn(console, 'error').mockImplementation(() => jest.fn())

    await store.dispatch(generateNotebook(notebookParams)).then(() => {
      const storeActions = store.getActions()
      expect(storeActions[0]).toEqual({
        type: GENERATE_NOTEBOOK_STARTED,
        payload: 'G123456789-PROV1'
      })

      expect(storeActions[1]).toEqual({
        type: GENERATE_NOTEBOOK_FINISHED,
        payload: 'G123456789-PROV1'
      })

      expect(consoleMock).toHaveBeenCalledTimes(1)
    })
  })
})
