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
      collectionsQuery: {
        hasGranulesOrCwic: true,
        onlyEosdisCollections: true
      },
      pathname: '/path/here'
    }

    expect(encodeUrlQuery(props)).toEqual('/path/here?oe=t')
  })
})
