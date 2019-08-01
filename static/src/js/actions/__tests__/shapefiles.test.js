import nock from 'nock'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import saveShapefile from '../shapefiles'
import { UPDATE_SHAPEFILE } from '../../constants/actionTypes'

const mockStore = configureMockStore([thunk])

beforeEach(() => {
  jest.clearAllMocks()
})

describe('saveShapefile', () => {
  test('calls the API to get collections', async () => {
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

    const data = {
      filename: 'test file',
      size: '42 KB'
    }

    const store = mockStore({})

    const consoleMock = jest.spyOn(console, 'log').mockImplementation(() => jest.fn())

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
})
