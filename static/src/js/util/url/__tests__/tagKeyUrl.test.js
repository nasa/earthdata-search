import { decodeUrlParams, encodeUrlQuery } from '../url'

import { emptyDecodedResult } from './url.mocks'

import * as deployedEnvironment from '../../../../../../sharedUtils/deployedEnvironment'

beforeEach(() => {
  jest.spyOn(deployedEnvironment, 'deployedEnvironment').mockImplementation(() => 'prod')
})

describe('url#decodeUrlParams', () => {
  test('decodes keywordSearch correctly', () => {
    const expectedResult = {
      ...emptyDecodedResult,
      query: {
        ...emptyDecodedResult.query,
        collection: {
          ...emptyDecodedResult.query.collection,
          tagKey: 'test.key'
        }
      }
    }
    expect(decodeUrlParams('?tag_key=test.key')).toEqual(expectedResult)
  })
})

describe('url#encodeUrlQuery', () => {
  test('encodes keywordSearch correctly', () => {
    const props = {
      hasGranulesOrCwic: true,
      pathname: '/path/here',
      tagKey: 'test.key'
    }
    expect(encodeUrlQuery(props)).toEqual('/path/here?tag_key=test.key')
  })
})
