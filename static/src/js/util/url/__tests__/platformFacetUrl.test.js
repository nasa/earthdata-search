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
        platforms_h: [{
          category: 'Jet',
          sub_category: 'Not Provided',
          short_name: 'NASA DC-8',
          basis: 'Air-based Platforms'
        }]
      }
    }
    expect(decodeUrlParams('?fpc0=Jet&fpsc0=Not%20Provided&fps0=NASA%20DC-8&fpb0=Air-based%20Platforms')).toEqual(expectedResult)
  })

  test('decodes platformFacets correctly if no values existed', () => {
    const expectedResult = {
      ...emptyDecodedResult
    }
    expect(decodeUrlParams('?fpb=')).toEqual(expectedResult)
  })
})

describe('url#encodeUrlQuery', () => {
  test('encodes platformFacets correctly', () => {
    const props = {
      hasGranulesOrCwic: true,
      pathname: '/path/here',
      platformFacets: [{
        category: 'Jet',
        sub_category: 'Not Provided',
        short_name: 'NASA DC-8',
        basis: 'Air-based Platforms'
      }]
    }
    expect(encodeUrlQuery(props)).toEqual('/path/here?fpc0=Jet&fpsc0=Not%20Provided&fps0=NASA%20DC-8&fpb0=Air-based%20Platforms')
  })
})
