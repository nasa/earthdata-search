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
  test('decodes nlpSearch correctly', () => {
    const expectedResult = {
      ...emptyDecodedResult,
      query: {
        ...emptyDecodedResult.query,
        nlpCollection: { query: 'climate data' }
      }
    }

    expect(decodeUrlParams('?nlp=climate%20data')).toEqual(expectedResult)
  })
})

describe('url#encodeUrlQuery', () => {
  test('encodes nlpSearch correctly', () => {
    const props = {
      pathname: '/path/here',
      hasGranulesOrCwic: true,
      nlpSearch: 'climate data'
    }

    expect(encodeUrlQuery(props)).toEqual('/path/here?nlp=climate%20data')
  })
})
