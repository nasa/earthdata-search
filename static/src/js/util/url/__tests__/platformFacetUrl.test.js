import { decodeUrlParams, encodeUrlQuery } from '../url'

import emptyDecodedResult from './url.test'

describe('url#decodeUrlParams', () => {
  test('decodes platformFacets correctly', () => {
    const expectedResult = {
      ...emptyDecodedResult,
      cmrFacets: {
        platform_h: ['facet 1', 'facet 2']
      }
    }
    expect(decodeUrlParams('?fp=facet%201%21facet%202')).toEqual(expectedResult)
  })
})

describe('url#encodeUrlQuery', () => {
  test('encodes platformFacets correctly', () => {
    const props = {
      pathname: '/path/here',
      platformFacets: ['facet 1', 'facet 2']
    }
    expect(encodeUrlQuery(props)).toEqual('/path/here?fp=facet%201%21facet%202')
  })
})
