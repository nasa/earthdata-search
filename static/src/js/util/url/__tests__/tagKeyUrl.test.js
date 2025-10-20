import { decodeUrlParams, encodeUrlQuery } from '../url'

import { emptyDecodedResult } from './url.mocks'

import * as deployedEnvironment from '../../../../../../sharedUtils/deployedEnvironment'
import * as getApplicationConfig from '../../../../../../sharedUtils/config'

beforeEach(() => {
  jest.spyOn(deployedEnvironment, 'deployedEnvironment').mockImplementation(() => 'prod')
  jest.spyOn(getApplicationConfig, 'getApplicationConfig').mockImplementation(() => ({
    defaultPortal: 'default'
  }))
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
      collectionsQuery: {
        hasGranulesOrCwic: true,
        tagKey: 'test.key'
      },
      pathname: '/path/here'
    }
    expect(encodeUrlQuery(props)).toEqual('/path/here?tag_key=test.key')
  })
})
