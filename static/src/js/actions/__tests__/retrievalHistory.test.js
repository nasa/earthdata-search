import nock from 'nock'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import {
  SET_RETRIEVAL_HISTORY,
  SET_RETRIEVAL_HISTORY_LOADING
} from '../../constants/actionTypes'

import { fetchRetrievalHistory } from '../retrievalHistory'

const mockStore = configureMockStore([thunk])

beforeEach(() => {
  jest.clearAllMocks()
})

describe('fetchRetrievalHistory', () => {
  test('calls lambda to get the retrievals', async () => {
    nock(/localhost/)
      .get(/retrievals/)
      .reply(200, [
        {
          id: '1234',
          environment: 'prod',
          collections: [],
          jsondata: {
            portalId: 'edsc',
            source: '?p=!C1234-EDSC'
          }
        }
      ])

    // mockStore with initialState
    const store = mockStore({
      authToken: 'mockToken',
      earthdataEnvironment: 'prod'
    })

    // call the dispatch
    await store.dispatch(fetchRetrievalHistory()).then(() => {
      expect(store.getActions().length).toEqual(2)
      expect(store.getActions()[0]).toEqual({
        type: SET_RETRIEVAL_HISTORY_LOADING
      })
      expect(store.getActions()[1]).toEqual({
        payload: [
          {
            id: '1234',
            environment: 'prod',
            collections: [],
            jsondata: {
              portalId: 'edsc',
              source: '?p=!C1234-EDSC'
            }
          }
        ],
        type: SET_RETRIEVAL_HISTORY
      })
    })
  })

  test('does not call setRetrievalHistory on error', async () => {
    nock(/localhost/)
      .get(/retrievals/)
      .reply(500, {
        errors: ['An error occured.']
      })

    nock(/localhost/)
      .post(/error_logger/)
      .reply(200)

    const store = mockStore({
      authToken: 'mockToken',
      earthdataEnvironment: 'prod'
    })

    const consoleMock = jest.spyOn(console, 'error').mockImplementationOnce(() => jest.fn())

    await store.dispatch(fetchRetrievalHistory('prod')).then(() => {
      expect(consoleMock).toHaveBeenCalledTimes(1)
    })
  })
})
