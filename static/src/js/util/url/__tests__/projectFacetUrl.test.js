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
  test('decodes projectFacets correctly', () => {
    const expectedResult = {
      ...emptyDecodedResult,
      cmrFacets: {
        project_h: ['facet 1', 'facet 2']
      }
    }
    expect(decodeUrlParams('?fpj=facet%201!facet%202')).toEqual(expectedResult)
  })
})

describe('url#encodeUrlQuery', () => {
  test('encodes projectFacets correctly', () => {
    const props = {
      collectionsQuery: {
        hasGranulesOrCwic: true
      },
      pathname: '/path/here',
      projectFacets: ['facet 1', 'facet 2']
    }
    expect(encodeUrlQuery(props)).toEqual('/path/here?fpj=facet%201!facet%202')
  })
})
