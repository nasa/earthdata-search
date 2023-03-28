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
  test('decodes focusedCollection correctly', () => {
    const expectedResult = {
      ...emptyDecodedResult,
      focusedCollection: 'collectionId',
      query: {
        collection: {
          ...emptyDecodedResult.query.collection,
          byId: {
            collectionId: {
              granules: {
                pageNum: 1
              }
            }
          }
        }
      }
    }
    expect(decodeUrlParams('?p=collectionId')).toEqual(expectedResult)
  })
})

describe('url#encodeUrlQuery', () => {
  test('encodes focusedCollection correctly', () => {
    const props = {
      hasGranulesOrCwic: true,
      pathname: '/path/here',
      focusedCollection: 'collectionId'
    }
    expect(encodeUrlQuery(props)).toEqual('/path/here?p=collectionId')
  })
})
