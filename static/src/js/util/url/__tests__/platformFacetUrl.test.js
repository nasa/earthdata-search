import { decodeUrlParams, encodeUrlQuery } from '../url'

import { emptyDecodedResult } from './url.mocks'

import * as deployedEnvironment from '../../../../../../sharedUtils/deployedEnvironment'

beforeEach(() => {
  jest.spyOn(deployedEnvironment, 'deployedEnvironment').mockImplementation(() => 'prod')
})

describe('url#decodeUrlParams', () => {
  test('decodes platformFacets correctly', () => {
    const expectedResult = {
      ...emptyDecodedResult,
      cmrFacets: {
        platform_h: ['facet 1', 'facet 2']
      }
    }
    expect(decodeUrlParams('?fp=facet%201!facet%202')).toEqual(expectedResult)
  })

  test('decodes platformFacets correctly if no values existed', () => {
    const expectedResult = {
      ...emptyDecodedResult
    }
    expect(decodeUrlParams('?fp=')).toEqual(expectedResult)
  })
})

describe('url#encodeUrlQuery', () => {
  test('encodes platformFacets correctly', () => {
    const props = {
      hasGranulesOrCwic: true,
      pathname: '/path/here',
      platformFacets: ['facet 1', 'facet 2']
    }
    expect(encodeUrlQuery(props)).toEqual('/path/here?fp=facet%201!facet%202')
  })
})
