import nock from 'nock'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import {
  onExportStarted,
  onExportFinished,
  exportCollectionSearch,
  exportGranuleSearch
} from '../exportSearch'

import { EXPORT_FINISHED, EXPORT_STARTED } from '../../constants/actionTypes'

const mockStore = configureMockStore([thunk])

beforeEach(() => {
  jest.clearAllMocks()
})

describe('onExportStarted', () => {
  describe('when starting a collection export', () => {
    test('should create an action to update the store', () => {
      const payload = {
        type: 'collection',
        format: 'json'
      }

      const expectedAction = {
        type: EXPORT_STARTED,
        payload
      }

      expect(onExportStarted(payload)).toEqual(expectedAction)
    })
  })

  describe('when starting a granule export', () => {
    test('should create an action to update the store', () => {
      const payload = {
        type: 'granule',
        format: 'stac'
      }

      const expectedAction = {
        type: EXPORT_STARTED,
        payload
      }

      expect(onExportStarted(payload)).toEqual(expectedAction)
    })
  })
})

describe('onExportFinished', () => {
  describe('when finishing a collection export', () => {
    test('should create an action to update the store', () => {
      const payload = {
        type: 'collection',
        format: 'json'
      }

      const expectedAction = {
        type: EXPORT_FINISHED,
        payload
      }

      expect(onExportFinished(payload)).toEqual(expectedAction)
    })
  })

  describe('when finishing a granule export', () => {
    test('should create an action to update the store', () => {
      const payload = {
        type: 'granule',
        format: 'stac'
      }

      const expectedAction = {
        type: EXPORT_FINISHED,
        payload
      }

      expect(onExportFinished(payload)).toEqual(expectedAction)
    })
  })
})

describe('exportCollectionSearch', () => {
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
      .post(/collections\/export/)
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
    await store.dispatch(exportCollectionSearch('csv')).then(() => {
      const storeActions = store.getActions()
      expect(storeActions[0]).toEqual({
        type: EXPORT_STARTED,
        payload: {
          type: 'collection',
          format: 'csv'
        }
      })
      expect(storeActions[1]).toEqual({
        type: EXPORT_FINISHED,
        payload: {
          type: 'collection',
          format: 'csv'
        }
      })

      expect(createObjectMock).toHaveBeenCalledTimes(1)
    })
  })

  describe('exportCollectionSearch', () => {
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
        .post(/collections\/export/)
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
      await store.dispatch(exportCollectionSearch('json')).then(() => {
        const storeActions = store.getActions()
        expect(storeActions[0]).toEqual({
          type: EXPORT_STARTED,
          payload: {
            type: 'collection',
            format: 'json'
          }
        })
        expect(storeActions[1]).toEqual({
          type: EXPORT_FINISHED,
          payload: {
            type: 'collection',
            format: 'json'
          }
        })

        expect(createObjectMock).toHaveBeenCalledTimes(1)
      })
    })

    test('does not create a file on error', async () => {
      nock(/localhost/)
        .post(/collections\/export/)
        .reply(500)

      nock(/localhost/)
        .post(/error_logger/)
        .reply(200)

      const store = mockStore({
        authToken: ''
      })

      const consoleMock = jest.spyOn(console, 'error').mockImplementation(() => jest.fn())

      await store.dispatch(exportCollectionSearch('json')).then(() => {
        const storeActions = store.getActions()
        expect(storeActions[0]).toEqual({
          type: EXPORT_STARTED,
          payload: {
            type: 'collection',
            format: 'json'
          }
        })
        expect(storeActions[1]).toEqual({
          type: EXPORT_FINISHED,
          payload: {
            type: 'collection',
            format: 'json'
          }
        })

        expect(consoleMock).toHaveBeenCalledTimes(1)
      })
    })
  })

  describe('exportGranuleSearch', () => {
    describe('when a user is authenticated', () => {
      test('calls lambda to get stac search export', async () => {
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
          .post(/granules\/export/)
          .reply(200, [
            {
              mock: 'data'
            }
          ])

        // mockStore with initialState
        const store = mockStore({
          authToken: 'TEST',
          query: {
            collection: {}
          }
        })

        // call the dispatch
        await store.dispatch(exportGranuleSearch('stac')).then(() => {
          const storeActions = store.getActions()
          expect(storeActions[0]).toEqual({
            type: EXPORT_STARTED,
            payload: {
              type: 'granule',
              format: 'stac'
            }
          })
          expect(storeActions[1]).toEqual({
            type: EXPORT_FINISHED,
            payload: {
              type: 'granule',
              format: 'stac'
            }
          })

          expect(createObjectMock).toHaveBeenCalledTimes(1)
        })
      })

      test('does not create a file on error', async () => {
        nock(/localhost/)
          .post(/granules\/export/)
          .reply(500)

        nock(/localhost/)
          .post(/error_logger/)
          .reply(200)

        const store = mockStore({
          authToken: 'TEST',
          query: {
            collection: {}
          }
        })

        const consoleMock = jest.spyOn(console, 'error').mockImplementation(() => jest.fn())

        await store.dispatch(exportGranuleSearch('stac')).then(() => {
          const storeActions = store.getActions()
          expect(storeActions[0]).toEqual({
            type: EXPORT_STARTED,
            payload: {
              type: 'granule',
              format: 'stac'
            }
          })
          expect(storeActions[1]).toEqual({
            type: EXPORT_FINISHED,
            payload: {
              type: 'granule',
              format: 'stac'
            }
          })

          expect(consoleMock).toHaveBeenCalledTimes(1)
        })
      })
    })

    describe('when a user is not authenticated', () => {
      test('calls CMR to get stac search export', async () => {
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

        nock(/https:\/\/cmr.earthdata.nasa.gov/)
          .post(/search\/granules.stac/)
          .reply(200, [
            {
              mock: 'data'
            }
          ])

        // mockStore with initialState
        const store = mockStore({
          authToken: '',
          query: {
            collection: {}
          }
        })

        // call the dispatch
        await store.dispatch(exportGranuleSearch('stac')).then(() => {
          const storeActions = store.getActions()
          expect(storeActions[0]).toEqual({
            type: EXPORT_STARTED,
            payload: {
              type: 'granule',
              format: 'stac'
            }
          })
          expect(storeActions[1]).toEqual({
            type: EXPORT_FINISHED,
            payload: {
              type: 'granule',
              format: 'stac'
            }
          })

          expect(createObjectMock).toHaveBeenCalledTimes(1)
        })
      })

      test('does not create a file on error', async () => {
        nock(/https:\/\/cmr.earthdata.nasa.gov/)
          .post(/search\/granules.stac/)
          .reply(500)

        nock(/localhost/)
          .post(/error_logger/)
          .reply(200)

        const store = mockStore({
          authToken: '',
          query: {
            collection: {}
          }
        })

        const consoleMock = jest.spyOn(console, 'error').mockImplementation(() => jest.fn())

        await store.dispatch(exportGranuleSearch('stac')).then(() => {
          const storeActions = store.getActions()
          expect(storeActions[0]).toEqual({
            type: EXPORT_STARTED,
            payload: {
              type: 'granule',
              format: 'stac'
            }
          })
          expect(storeActions[1]).toEqual({
            type: EXPORT_FINISHED,
            payload: {
              type: 'granule',
              format: 'stac'
            }
          })

          expect(consoleMock).toHaveBeenCalledTimes(1)
        })
      })
    })
  })
})
