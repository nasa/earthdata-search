import { decodeUrlParams, encodeUrlQuery } from '../url'

import { emptyDecodedResult } from './url.mocks'

import * as deployedEnvironment from '../../../../../../sharedUtils/deployedEnvironment'
import * as getApplicationConfig from '../../../../../../sharedUtils/config'

beforeEach(() => {
  vi.spyOn(deployedEnvironment, 'deployedEnvironment').mockImplementation(() => 'prod')
  vi.spyOn(getApplicationConfig, 'getApplicationConfig').mockImplementation(() => ({
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
      collectionsQuery: {
        hasGranulesOrCwic: true
      },
      pathname: '/path/here',
      granuleDataFormatFacets: ['Binary']
    }
    expect(encodeUrlQuery(props)).toEqual('/path/here?gdf=Binary')
  })
})
