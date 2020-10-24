import nock from 'nock'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import {
  clearShapefile,
  fetchShapefile,
  saveShapefile,
  shapefileErrored,
  shapefileLoading,
  updateShapefile
} from '../shapefiles'

import {
  CLEAR_SHAPEFILE,
  ERRORED_SHAPEFILE,
  LOADING_SHAPEFILE,
  UPDATE_SHAPEFILE
} from '../../constants/actionTypes'

const mockStore = configureMockStore([thunk])

beforeEach(() => {
  jest.clearAllMocks()
})

describe('clearShapefile', () => {
  test('should create an action to set the delete the shapefile', () => {
    const expectedAction = {
      type: CLEAR_SHAPEFILE
    }
    expect(clearShapefile()).toEqual(expectedAction)
  })
})

describe('updateShapefile', () => {
  test('should create an action to set the update state', () => {
    const payload = {
      test: 'test'
    }
    const expectedAction = {
      type: UPDATE_SHAPEFILE,
      payload
    }
    expect(updateShapefile(payload)).toEqual(expectedAction)
  })
})

describe('shapefileLoading', () => {
  test('should create an action to set the loading state', () => {
    const payload = {
      test: 'test'
    }
    const expectedAction = {
      type: LOADING_SHAPEFILE,
      payload
    }
    expect(shapefileLoading(payload)).toEqual(expectedAction)
  })
})

describe('shapefileLoading', () => {
  test('should create an action to set the errored state', () => {
    const payload = {
      test: 'test'
    }
    const expectedAction = {
      type: ERRORED_SHAPEFILE,
      payload
    }
    expect(shapefileErrored(payload)).toEqual(expectedAction)
  })
})

describe('saveShapefile', () => {
  test('calls the API to save the shapefile', async () => {
    nock(/localhost/)
      .post(/shapefiles/)
      .reply(200, {
        shapefile_id: '123'
      })

    const data = {
      filename: 'test file',
      size: '42 KB'
    }

    // mockStore with initialState
    const store = mockStore({
      earthdataEnvironment: 'prod',
      query: {
        collection: {
          pageNum: 1,
          spatial: {}
        }
      },
      router: {
        location: {
          pathname: ''
        }
      },
      timeline: {
        query: {}
      }
    })

    // call the dispatch
    await store.dispatch(saveShapefile(data)).then(() => {
      const storeActions = store.getActions()
      expect(storeActions[0]).toEqual({
        type: UPDATE_SHAPEFILE,
        payload: {
          shapefileName: 'test file',
          shapefileSize: '42 KB'
        }
      })
      expect(storeActions[1]).toEqual({
        type: UPDATE_SHAPEFILE,
        payload: {
          shapefileId: '123'
        }
      })
    })
  })

  test('does not call updateCollectionResults on error', async () => {
    nock(/localhost/)
      .post(/shapefiles/)
      .reply(500)

    nock(/localhost/)
      .post(/error_logger/)
      .reply(200)

    const data = {
      filename: 'test file',
      size: '42 KB'
    }

    const store = mockStore({
      earthdataEnvironment: 'prod'
    })

    const consoleMock = jest.spyOn(console, 'error').mockImplementationOnce(() => jest.fn())

    await store.dispatch(saveShapefile(data)).then(() => {
      const storeActions = store.getActions()
      expect(storeActions[0]).toEqual({
        type: UPDATE_SHAPEFILE,
        payload: {
          shapefileName: 'test file',
          shapefileSize: '42 KB'
        }
      })
      expect(storeActions[1]).toEqual({
        type: UPDATE_SHAPEFILE,
        payload: {
          shapefileId: undefined,
          shapefileName: undefined,
          shapefileSize: undefined
        }
      })
      expect(consoleMock).toHaveBeenCalledTimes(1)
    })
  })

  describe('fetchShapefile', () => {
    test('calls the API to retrieve the shapefile', async () => {
      nock(/localhost/)
        .get(/shapefiles/)
        .reply(200, {
          file: 'mock shapefile',
          filename: 'MockShapefile.geojson',
          selectedFeatures: []
        })

      // mockStore with initialState
      const store = mockStore({
        earthdataEnvironment: 'prod',
        query: {
          collection: {
            pageNum: 1,
            spatial: {}
          }
        },
        router: {
          location: {
            pathname: ''
          }
        },
        timeline: {
          query: {}
        }
      })

      // call the dispatch
      await store.dispatch(fetchShapefile('1')).then(() => {
        const storeActions = store.getActions()
        expect(storeActions[0]).toEqual({
          type: UPDATE_SHAPEFILE,
          payload: {
            file: 'mock shapefile',
            filename: 'MockShapefile.geojson',
            selectedFeatures: []
          }
        })
      })
    })

    test('does not call updateCollectionResults on error', async () => {
      nock(/localhost/)
        .get(/shapefiles/)
        .reply(500)

      nock(/localhost/)
        .post(/error_logger/)
        .reply(200)

      const store = mockStore({})

      const consoleMock = jest.spyOn(console, 'error').mockImplementationOnce(() => jest.fn())

      await store.dispatch(fetchShapefile('1')).then(() => {
        expect(consoleMock).toHaveBeenCalledTimes(1)
      })
    })
  })
})
