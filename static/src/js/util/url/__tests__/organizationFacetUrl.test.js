import { decodeUrlParams, encodeUrlQuery } from '../url'

import { emptyDecodedResult } from './url.mocks'

import * as deployedEnvironment from '../../../../../../sharedUtils/deployedEnvironment'

beforeEach(() => {
  jest.spyOn(deployedEnvironment, 'deployedEnvironment').mockImplementation(() => 'prod')
})

describe('url#decodeUrlParams', () => {
  test('decodes organizationFacets correctly', () => {
    const expectedResult = {
      ...emptyDecodedResult,
      cmrFacets: {
        data_center_h: ['facet 1', 'facet 2']
      }
    }
    expect(decodeUrlParams('?fdc=facet%201!facet%202')).toEqual(expectedResult)
  })
})

describe('url#encodeUrlQuery', () => {
  test('encodes organizationFacets correctly', () => {
    const props = {
      hasGranulesOrCwic: true,
      pathname: '/path/here',
      organizationFacets: ['facet 1', 'facet 2']
    }
    expect(encodeUrlQuery(props)).toEqual('/path/here?fdc=facet%201!facet%202')
  })
})
