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
  test('decodes processingLevelFacets correctly', () => {
    const expectedResult = {
      ...emptyDecodedResult,
      cmrFacets: {
        processing_level_id_h: ['facet 1', 'facet 2']
      }
    }
    expect(decodeUrlParams('?fl=facet%201!facet%202')).toEqual(expectedResult)
  })
})

describe('url#encodeUrlQuery', () => {
  test('encodes processingLevelFacets correctly', () => {
    const props = {
      collectionsQuery: {
        hasGranulesOrCwic: true
      },
      pathname: '/path/here',
      processingLevelFacets: ['facet 1', 'facet 2']
    }
    expect(encodeUrlQuery(props)).toEqual('/path/here?fl=facet%201!facet%202')
  })
})
