import { decodeUrlParams, encodeUrlQuery } from '../url'

import { emptyDecodedResult } from './url.mocks'

import * as deployedEnvironment from '../../../../../../sharedUtils/deployedEnvironment'

beforeEach(() => {
  jest.spyOn(deployedEnvironment, 'deployedEnvironment').mockImplementation(() => 'prod')
})

describe('url#decodeUrlParams', () => {
  test('decodes onlyEosdisCollections correctly', () => {
    const expectedResult = {
      ...emptyDecodedResult,
      query: {
        ...emptyDecodedResult.query,
        collection: {
          ...emptyDecodedResult.query.collection,
          onlyEosdisCollections: true
        }
      }
    }
    expect(decodeUrlParams('?oe=t')).toEqual(expectedResult)
  })
})

describe('url#encodeUrlQuery', () => {
  test('encodes onlyEosdisCollections correctly', () => {
    const props = {
      hasGranulesOrCwic: true,
      pathname: '/path/here',
      onlyEosdisCollections: true
    }

    expect(encodeUrlQuery(props)).toEqual('/path/here?oe=t')
  })
})
