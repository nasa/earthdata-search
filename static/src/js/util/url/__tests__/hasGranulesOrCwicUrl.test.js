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
  test('decodes hasGranulesOrCwic correctly', () => {
    const expectedResult = {
      ...emptyDecodedResult,
      query: {
        ...emptyDecodedResult.query,
        collection: {
          ...emptyDecodedResult.query.collection,
          hasGranulesOrCwic: true
        }
      }
    }
    expect(decodeUrlParams('')).toEqual(expectedResult)
  })

  test('decodes hasGranulesOrCwic correctly when ac is in the URL', () => {
    const expectedResult = {
      ...emptyDecodedResult,
      query: {
        ...emptyDecodedResult.query,
        collection: {
          ...emptyDecodedResult.query.collection,
          hasGranulesOrCwic: undefined
        }
      }
    }
    expect(decodeUrlParams('?ac=true')).toEqual(expectedResult)
  })
})

describe('url#encodeUrlQuery', () => {
  test('does not encode the value if true', () => {
    const props = {
      hasGranulesOrCwic: true,
      pathname: '/path/here'
    }
    expect(encodeUrlQuery(props)).toEqual('')
  })

  test('encodes the value if undefined', () => {
    const props = {
      hasGranulesOrCwic: undefined,
      pathname: '/path/here'
    }
    expect(encodeUrlQuery(props)).toEqual('?ac=true')
  })
})
