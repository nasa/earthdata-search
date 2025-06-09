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
  test('decodes featureFacets correctly', () => {
    const expectedResult = {
      ...emptyDecodedResult,
      featureFacets: {
        availableInEarthdataCloud: true,
        customizable: true,
        mapImagery: true,
        nearRealTime: true
      }
    }
    expect(decodeUrlParams('?ff=Available%20in%20Earthdata%20Cloud!Customizable!Map%20Imagery!Near%20Real%20Time')).toEqual(expectedResult)
  })
})

describe('url#encodeUrlQuery', () => {
  test('does not encode the value if there are no applied feature facets', () => {
    const props = {
      hasGranulesOrCwic: true,
      pathname: '/path/here',
      featureFacets: {
        availableInEarthdataCloud: false,
        customizable: false,
        mapImagery: false,
        nearRealTime: false
      }
    }
    expect(encodeUrlQuery(props)).toEqual('')
  })

  test('encodes featureFacets correctly', () => {
    const props = {
      hasGranulesOrCwic: true,
      pathname: '/path/here',
      featureFacets: {
        availableInEarthdataCloud: true,
        customizable: true,
        mapImagery: true,
        nearRealTime: true
      }
    }
    expect(encodeUrlQuery(props)).toEqual('?ff=Available%20in%20Earthdata%20Cloud!Customizable!Map%20Imagery!Near%20Real%20Time')
  })
})
