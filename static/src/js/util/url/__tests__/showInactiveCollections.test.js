import { decodeUrlParams, encodeUrlQuery } from '../url'

import { emptyDecodedResult } from './url.mocks'

import * as deployedEnvironment from '../../../../../../sharedUtils/deployedEnvironment'
import * as getApplicationConfig from '../../../../../../sharedUtils/config'

beforeEach(() => {
  vi.spyOn(deployedEnvironment, 'deployedEnvironment').mockImplementation(() => 'prod')
  vi.spyOn(getApplicationConfig, 'getApplicationConfig').mockImplementation(() => ({
    defaultPortal: 'default'
  }))
})

describe('url#decodeUrlParams', () => {
  test('decodes showInactiveCollections correctly', () => {
    const expectedResult = {
      ...emptyDecodedResult,
      query: {
        ...emptyDecodedResult.query,
        collection: {
          ...emptyDecodedResult.query.collection,
          showInactiveCollections: true
        }
      }
    }
    expect(decodeUrlParams('?ic=t')).toEqual(expectedResult)
  })
})

describe('url#encodeUrlQuery', () => {
  test('encodes showInactiveCollections correctly', () => {
    const props = {
      collectionsQuery: {
        hasGranulesOrCwic: true,
        showInactiveCollections: true
      },
      pathname: '/path/here'
    }

    expect(encodeUrlQuery(props)).toEqual('/path/here?ic=t')
  })
})
