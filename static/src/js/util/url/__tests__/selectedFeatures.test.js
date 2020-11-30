import { decodeUrlParams, encodeUrlQuery } from '../url'

import { emptyDecodedResult } from './url.mocks'

import * as deployedEnvironment from '../../../../../../sharedUtils/deployedEnvironment'

beforeEach(() => {
  jest.spyOn(deployedEnvironment, 'deployedEnvironment').mockImplementation(() => 'prod')
})

describe('url#decodeUrlParams', () => {
  test('decodes selectedFeatures correctly', () => {
    const expectedResult = {
      ...emptyDecodedResult,
      shapefile: {
        ...emptyDecodedResult.shapefile,
        selectedFeatures: ['123']
      }
    }
    expect(decodeUrlParams('?sfs[0]=123')).toEqual(expectedResult)
  })
})

describe('url#encodeUrlQuery', () => {
  test('encodes selectedFeatures correctly', () => {
    const props = {
      hasGranulesOrCwic: true,
      pathname: '/path/here',
      selectedFeatures: ['123']
    }
    expect(encodeUrlQuery(props)).toEqual('/path/here?sfs[0]=123')
  })
})
