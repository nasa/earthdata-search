import { decodeUrlParams, encodeUrlQuery } from '../url'

import emptyDecodedResult from './url.test'

describe('url#decodeUrlParams', () => {
  test('decodes shapefileId correctly', () => {
    const expectedResult = {
      ...emptyDecodedResult,
      shapefile: {
        ...emptyDecodedResult.shapefile,
        shapefileId: 123
      }
    }
    expect(decodeUrlParams('?sf=123')).toEqual(expectedResult)
  })
})

describe('url#encodeUrlQuery', () => {
  test('encodes shapefileId correctly', () => {
    const props = {
      pathname: '/path/here',
      shapefileId: 123
    }
    expect(encodeUrlQuery(props)).toEqual('/path/here?sf=123')
  })
})
