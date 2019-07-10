import { decodeUrlParams, encodeUrlQuery } from '../url'

import emptyDecodedResult from './url.test'

describe('url#decodeUrlParams', () => {
  test('decodes temporalSearch correctly', () => {
    const expectedResult = {
      ...emptyDecodedResult,
      query: {
        ...emptyDecodedResult.query,
        collection: {
          ...emptyDecodedResult.query.collection,
          temporal: {
            endDate: '2019-02-01T00:00:00.000Z',
            startDate: '2019-01-01T00:00:00.000Z'
          }
        }
      }
    }
    expect(decodeUrlParams('?qt=2019-01-01T00%3A00%3A00.000Z%2C2019-02-01T00%3A00%3A00.000Z')).toEqual(expectedResult)
  })
})

describe('url#encodeUrlQuery', () => {
  test('encodes temporalSearch correctly', () => {
    const props = {
      pathname: '/path/here',
      temporalSearch: {
        endDate: '2019-02-01T00:00:00.000Z',
        startDate: '2019-01-01T00:00:00.000Z'
      }
    }
    expect(encodeUrlQuery(props)).toEqual('/path/here?qt=2019-01-01T00%3A00%3A00.000Z%2C2019-02-01T00%3A00%3A00.000Z')
  })
})
