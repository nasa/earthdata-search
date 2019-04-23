import { decodeUrlParams, encodeUrlQuery } from '../url'

import emptyDecodedResult from './url.test'

describe('url#decodeUrlParams', () => {
  test('decodes keywordSearch correctly', () => {
    const expectedResult = {
      ...emptyDecodedResult,
      query: {
        ...emptyDecodedResult.query,
        keyword: 'keyword'
      }
    }
    expect(decodeUrlParams('?q=keyword')).toEqual(expectedResult)
  })
})

describe('url#encodeUrlQuery', () => {
  test('encodes keywordSearch correctly', () => {
    const props = {
      pathname: '/path/here',
      keywordSearch: 'keyword'
    }
    expect(encodeUrlQuery(props)).toEqual('/path/here?q=keyword')
  })
})
