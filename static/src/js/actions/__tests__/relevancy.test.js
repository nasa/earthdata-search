import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import nock from 'nock'

import { collectionRelevancyMetrics } from '../relevancy'
import LoggerRequest from '../../util/request/loggerRequest'

const mockStore = configureMockStore([thunk])

beforeEach(() => {
  jest.clearAllMocks()
})

describe('collectionRelevancyMetrics', () => {
  test('should call LoggerRequest.logRelevancy', () => {
    nock(/localhost/)
      .post(/relevancy_logger/)
      .reply(200)

    const store = mockStore({
      focusedCollection: 'collection2',
      metadata: {
        collections: {
          collection1: {
            id: 'collection1'
          },
          collection2: {
            id: 'collection2'
          }
        }
      },
      query: {
        collection: {}
      },
      searchResults: {
        collections: {
          allIds: ['collection1', 'collection2'],
          keyword: 'test'
        }
      }
    })

    const loggerSpy = jest.spyOn(LoggerRequest.prototype, 'logRelevancy')

    store.dispatch(collectionRelevancyMetrics())

    expect(loggerSpy).toBeCalledTimes(1)
  })
})
