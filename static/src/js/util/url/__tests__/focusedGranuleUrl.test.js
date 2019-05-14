import { decodeUrlParams, encodeUrlQuery } from '../url'

import emptyDecodedResult from './url.test'

describe('url#decodeUrlParams', () => {
  test('decodes focusedGranule correctly', () => {
    const expectedResult = {
      ...emptyDecodedResult,
      focusedGranule: 'granuleId'
    }
    expect(decodeUrlParams('?g=granuleId')).toEqual(expectedResult)
  })
})

describe('url#encodeUrlQuery', () => {
  test('encodes focusedGranule correctly', () => {
    const props = {
      pathname: '/path/here',
      focusedGranule: 'granuleId'
    }
    expect(encodeUrlQuery(props)).toEqual('/path/here?g=granuleId')
  })
})
