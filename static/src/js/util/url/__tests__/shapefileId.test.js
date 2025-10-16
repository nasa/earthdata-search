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
  test('decodes shapefileId correctly', () => {
    const expectedResult = {
      ...emptyDecodedResult,
      shapefile: {
        ...emptyDecodedResult.shapefile,
        shapefileId: '123'
      }
    }
    expect(decodeUrlParams('?sf=123')).toEqual(expectedResult)
  })
})

describe('url#encodeUrlQuery', () => {
  test('encodes shapefileId correctly', () => {
    const props = {
      collectionsQuery: {
        hasGranulesOrCwic: true
      },
      pathname: '/path/here',
      shapefileId: '123'
    }
    expect(encodeUrlQuery(props)).toEqual('/path/here?sf=123')
  })
})
