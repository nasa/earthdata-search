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
  test('given no string it returns no object', () => {
    const expectedResult = {
      ...emptyDecodedResult
    }
    expect(decodeUrlParams('')).toEqual(expectedResult)
  })
})

describe('url#encodeUrlQuery', () => {
  test('given no query it returns no params', () => {
    const props = {
      collectionsQuery: {
        hasGranulesOrCwic: true
      },
      pathname: '/path/here'
    }
    expect(encodeUrlQuery(props)).toEqual('/path/here')
  })
})
