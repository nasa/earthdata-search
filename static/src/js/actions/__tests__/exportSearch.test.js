import nock from 'nock'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import {
  onExportStarted,
  onExportFinished,
  exportSearch
} from '../exportSearch'

import useEdscStore from '../../zustand/useEdscStore'

import { EXPORT_FINISHED, EXPORT_STARTED } from '../../constants/actionTypes'

const mockStore = configureMockStore([thunk])

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

    // MockStore with initialState
    const store = mockStore()

    // Call the dispatch
    await store.dispatch(exportSearch('csv')).then(() => {
      const storeActions = store.getActions()
      expect(storeActions[0]).toEqual({
        type: EXPORT_STARTED,
        payload: 'csv'
      })

      expect(storeActions[1]).toEqual({
        type: EXPORT_FINISHED,
        payload: 'csv'
      })

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

    // MockStore with initialState
    const store = mockStore()

    // Call the dispatch
    await store.dispatch(exportSearch('json')).then(() => {
      const storeActions = store.getActions()
      expect(storeActions[0]).toEqual({
        type: EXPORT_STARTED,
        payload: 'json'
      })

      expect(storeActions[1]).toEqual({
        type: EXPORT_FINISHED,
        payload: 'json'
      })

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

    useEdscStore.setState((state) => {
      // eslint-disable-next-line no-param-reassign
      state.errors.handleError = jest.fn()
    })

    const store = mockStore()

    await store.dispatch(exportSearch('json')).then(() => {
      const storeActions = store.getActions()
      expect(storeActions[0]).toEqual({
        type: EXPORT_STARTED,
        payload: 'json'
      })

      expect(storeActions[1]).toEqual({
        type: EXPORT_FINISHED,
        payload: 'json'
      })

      const { errors } = useEdscStore.getState()
      expect(errors.handleError).toHaveBeenCalledTimes(1)
      expect(errors.handleError).toHaveBeenCalledWith(expect.objectContaining({
        action: 'exportSearch',
        resource: 'collections',
        showAlertButton: true,
        title: 'Something went wrong exporting your search'
      }))
    })
  })
})
