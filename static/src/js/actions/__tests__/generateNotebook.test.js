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
    const setAttributeMock = jest.fn()
    const clickMock = jest.fn()
    const removeChildMock = jest.fn()

    const linkMock = {
      setAttribute: setAttributeMock,
      click: clickMock,
      parentNode: {
        removeChild: removeChildMock
      }
    }

    jest.spyOn(document, 'createElement').mockImplementation(() => linkMock)

    document.body.appendChild = jest.fn()

    nock(/localhost/)
      .post(/generate_notebook/)
      .reply(
        200,
        {
          downloadUrl: 'https://www.fakesignedurl.com'
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

      // Check that the link is created
      expect(document.createElement).toHaveBeenCalledTimes(1)
      expect(document.createElement).toHaveBeenCalledWith('a')

      // Check the href is set properly on the link
      expect(linkMock.href).toEqual('https://www.fakesignedurl.com')

      // Check that the download attribute is set
      expect(setAttributeMock).toHaveBeenCalledTimes(1)
      expect(setAttributeMock).toHaveBeenCalledWith('download', '')

      // Check that the click is called to trigger the download
      expect(clickMock).toHaveBeenCalledTimes(1)
      expect(clickMock).toHaveBeenCalledWith()

      // Check that the link is removed
      expect(removeChildMock).toHaveBeenCalledTimes(1)
      expect(removeChildMock).toHaveBeenCalledWith(linkMock)
    })
  })

  test('does not create a file on error', async () => {
    const setAttributeMock = jest.fn()
    const clickMock = jest.fn()
    const removeChildMock = jest.fn()

    const linkMock = {
      setAttribute: setAttributeMock,
      click: clickMock,
      parentNode: {
        removeChild: removeChildMock
      }
    }

    jest.spyOn(document, 'createElement').mockImplementation(() => linkMock)

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

    // Check that the link is not created
    expect(document.createElement).toHaveBeenCalledTimes(0)

    // Check that the download attribute is not set
    expect(setAttributeMock).toHaveBeenCalledTimes(0)

    // Check that a click is not called to trigger the download
    expect(clickMock).toHaveBeenCalledTimes(0)

    // Check that a link is not removed
    expect(removeChildMock).toHaveBeenCalledTimes(0)
  })
})
