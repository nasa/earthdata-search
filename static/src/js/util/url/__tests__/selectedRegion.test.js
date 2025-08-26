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

describe('url#decodeSelectedRegion', () => {
  test('decodes selectedRegion correctly', () => {
    const expectedResult = {
      ...emptyDecodedResult,

      selectedRegion: {
        id: '1234',
        name: 'Test HUC',
        spatial: '-77,38,-77,38,-76,38,-77,38',
        type: 'huc'
      }
    }
    expect(decodeUrlParams('?sr[id]=1234&sr[name]=Test%20HUC&sr[spatial]=-77%2C38%2C-77%2C38%2C-76%2C38%2C-77%2C38&sr[type]=huc')).toEqual(expectedResult)
  })
})

describe('url#encodeSelectedRegion', () => {
  test('does not encode the value if there are no selectedRegion params', () => {
    const props = {
      hasGranulesOrCwic: true,
      pathname: '/path/here'
    }
    expect(encodeUrlQuery(props)).toEqual('/path/here')
  })

  test('encodes selectedRegion correctly', () => {
    const props = {
      selectedRegion: {
        id: '1234',
        name: 'Test HUC',
        spatial: '-77,38,-77,38,-76,38,-77,38',
        type: 'huc'
      },
      hasGranulesOrCwic: true,
      pathname: '/path/here'
    }
    expect(encodeUrlQuery(props)).toEqual('/path/here?sr[id]=1234&sr[name]=Test%20HUC&sr[spatial]=-77%2C38%2C-77%2C38%2C-76%2C38%2C-77%2C38&sr[type]=huc')
  })
})
