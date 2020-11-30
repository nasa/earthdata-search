import { decodeUrlParams, encodeUrlQuery } from '../url'

import { emptyDecodedResult } from './url.mocks'

import * as deployedEnvironment from '../../../../../../sharedUtils/deployedEnvironment'

beforeEach(() => {
  jest.spyOn(deployedEnvironment, 'deployedEnvironment').mockImplementation(() => 'prod')
})

describe('url#decodeAdvancedSearch', () => {
  test('decodes selectedRegion correctly', () => {
    const expectedResult = {
      ...emptyDecodedResult,
      advancedSearch: {
        regionSearch: {
          selectedRegion: {
            id: '1234',
            name: 'Test HUC',
            spatial: '-77,38,-77,38,-76,38,-77,38',
            type: 'huc'
          }
        }
      }
    }
    expect(decodeUrlParams('?sr[id]=1234&sr[name]=Test%20HUC&sr[spatial]=-77%2C38%2C-77%2C38%2C-76%2C38%2C-77%2C38&sr[type]=huc')).toEqual(expectedResult)
  })
})

describe('url#encodeAdvancedSearch', () => {
  test('does not encode the value if there are no advanced search params', () => {
    const props = {
      hasGranulesOrCwic: true,
      pathname: '/path/here'
    }
    expect(encodeUrlQuery(props)).toEqual('/path/here')
  })

  test('encodes advancedSearch correctly', () => {
    const props = {
      advancedSearch: {
        regionSearch: {
          selectedRegion: {
            id: '1234',
            name: 'Test HUC',
            spatial: '-77,38,-77,38,-76,38,-77,38',
            type: 'huc'
          }
        }
      },
      hasGranulesOrCwic: true,
      pathname: '/path/here'
    }
    expect(encodeUrlQuery(props)).toEqual('/path/here?sr[id]=1234&sr[name]=Test%20HUC&sr[spatial]=-77%2C38%2C-77%2C38%2C-76%2C38%2C-77%2C38&sr[type]=huc')
  })
})
