import { decodeUrlParams, encodeUrlQuery } from '../url'

import emptyDecodedResult from './url.test'

describe('url#decodeUrlParams', () => {
  test('decodes projectFacets correctly', () => {
    const expectedResult = {
      ...emptyDecodedResult,
      cmrFacets: {
        project_h: ['facet 1', 'facet 2']
      }
    }
    expect(decodeUrlParams('?fpj=facet%201%21facet%202')).toEqual(expectedResult)
  })
})

describe('url#encodeUrlQuery', () => {
  test('encodes projectFacets correctly', () => {
    const props = {
      pathname: '/path/here',
      projectFacets: ['facet 1', 'facet 2']
    }
    expect(encodeUrlQuery(props)).toEqual('/path/here?fpj=facet%201%21facet%202')
  })
})
