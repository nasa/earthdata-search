import moxios from 'moxios'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import actions from '../index'
import { nlpSpatialToCmrParams } from '../nlp'

const middlewares = [thunk]
const mockStore = configureMockStore(middlewares)

describe('nlp#nlpSpatialToCmrParams', () => {
  test('correctly returns when null is provided', () => {
    const data = nlpSpatialToCmrParams(null)

    expect(data).toEqual(null)
  })

  test('correctly returns when undefined is provided', () => {
    const data = nlpSpatialToCmrParams(undefined)

    expect(data).toEqual(null)
  })

  test('correctly returns a formatted string', () => {
    const object = {
      textAfterExtraction: 'michigan',
      geonames: 'Michigan,United States',
      bbox: {
        swPoint: {
          latitude: 41.696118,
          longitude: -90.418392
        },
        nePoint: {
          latitude: 48.306063,
          longitude: -82.122971
        }
      },
      query: 'bounding_box:-90.418392,41.696118:-82.122971,48.306063'
    }

    const data = nlpSpatialToCmrParams(object)

    expect(data).toEqual([-90.418392, 41.696118, -82.122971, 48.306063])
  })
})

describe('nlp#searchNlp', () => {
  beforeEach(() => {
    moxios.install()

    jest.clearAllMocks()
  })

  afterEach(() => {
    moxios.uninstall()
  })

  test('does not call changeQuery on error', async () => {
    moxios.stubRequest(/nlp.*/, {
      status: 500,
      response: {}
    })
    const store = mockStore()

    const consoleMock = jest.spyOn(console, 'log').mockImplementation(() => jest.fn())

    await store.dispatch(actions.searchNlp('michigan')).then(() => {
      expect(consoleMock).toHaveBeenCalledTimes(1)
    })
  })

  test('does not call changeQuery when no keyword is provided', () => {
    moxios.stubRequest(/nlp.*/, {
      status: 200,
      response: {
        edscSpatial: null,
        edscTemporal: null,
        keyword: ''
      }
    })

    const store = mockStore()

    const addMock = jest.spyOn(actions, 'changeQuery').mockImplementation(() => jest.fn())

    store.dispatch(actions.searchNlp(''))

    expect(addMock).toHaveBeenCalledTimes(1)
    expect(addMock).toHaveBeenCalledWith({
      keyword: ''
    })
  })

  test('calls changeQuery without only keyword', async () => {
    moxios.stubRequest(/nlp.*/, {
      status: 200,
      response: {
        edscSpatial: null,
        edscTemporal: null,
        keyword: 'michigan'
      }
    })

    const store = mockStore()

    const addMock = jest.spyOn(actions, 'changeQuery').mockImplementation(() => jest.fn())

    await store.dispatch(actions.searchNlp('michigan')).then(() => {
      expect(addMock).toHaveBeenCalledTimes(1)
      expect(addMock).toHaveBeenCalledWith({
        keyword: 'michigan'
      })
    })
  })

  test('calls changeQuery with spatial payload', async () => {
    moxios.stubRequest(/nlp.*/, {
      status: 200,
      response: {
        edscSpatial: {
          textAfterExtraction: 'michigan',
          geonames: 'Michigan,United States',
          bbox: {
            swPoint: {
              latitude: 41.696118,
              longitude: -90.418392
            },
            nePoint: {
              latitude: 48.306063,
              longitude: -82.122971
            }
          },
          query: 'bounding_box:-90.418392,41.696118:-82.122971,48.306063'
        },
        edscTemporal: null,
        keyword: 'michigan'
      }
    })

    const store = mockStore()

    const addMock = jest.spyOn(actions, 'changeQuery').mockImplementation(() => jest.fn())

    await store.dispatch(actions.searchNlp('michigan')).then(() => {
      expect(addMock).toHaveBeenCalledTimes(1)
      expect(addMock).toHaveBeenCalledWith({
        keyword: 'michigan',
        spatial: {
          boundingBox: '-90.418392,41.696118,-82.122971,48.306063'
        }
      })
    })
  })
})
