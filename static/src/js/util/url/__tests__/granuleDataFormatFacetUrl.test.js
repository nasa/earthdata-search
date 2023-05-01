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
  test('decodes granuleDataFormatFacets correctly', () => {
    const expectedResult = {
      ...emptyDecodedResult,
      cmrFacets: {
        granule_data_format_h: ['Binary']
      }
    }
    expect(decodeUrlParams('?gdf=Binary')).toEqual(expectedResult)
  })
})

describe('url#encodeUrlQuery', () => {
  test('encodes granuleDataFormatFacets correctly', () => {
    const props = {
      hasGranulesOrCwic: true,
      pathname: '/path/here',
      granuleDataFormatFacets: ['Binary']
    }
    expect(encodeUrlQuery(props)).toEqual('/path/here?gdf=Binary')
  })
})
