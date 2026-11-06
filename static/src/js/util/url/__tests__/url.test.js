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
  test('decodes a DOI URL as a selected DOI', () => {
    expect(decodeUrlParams('doi=10.5067/EXAMPLE').query.collection.doi)
      .toEqual(['10.5067/EXAMPLE'])
  })

  test('given no string it returns no object', () => {
    const expectedResult = {
      ...emptyDecodedResult
    }
    expect(decodeUrlParams('')).toEqual(expectedResult)
  })
})

describe('url#encodeUrlQuery', () => {
  test('preserves advanced collection filters through a shared search URL', () => {
    const advancedFilters = {
      entryId: ['ATL03_004', 'ATL06_006'],
      shortName: ['ATL03', 'ATL06'],
      version: ['004', '005'],
      doi: ['10.5067/EXAMPLE', '10.5067/OTHER_DOI'],
      entryTitle: ['Example Collection', 'Other Collection'],
      consortium: ['CEOS', 'EOSDIS'],
      collectionDataType: ['SCIENCE_QUALITY'],
      collectionProgress: ['ACTIVE', 'COMPLETE'],
      downloadable: true,
      browsable: true,
      variableName: ['temperature', 'pressure'],
      serviceName: ['Harmony', 'OPeNDAP'],
      toolName: ['NASA_GISS_Panoply', 'Other Tool']
    }
    const url = encodeUrlQuery({
      collectionsQuery: {
        ...advancedFilters,
        hasGranulesOrCwic: true
      },
      pathname: '/search'
    })
    const decoded = decodeUrlParams(url.split('?')[1])

    expect(decoded.query.collection).toEqual(expect.objectContaining(advancedFilters))
  })

  test('given no query it returns no params', () => {
    const props = {
      collectionsQuery: {
        hasGranulesOrCwic: true
      },
      pathname: '/path/here'
    }
    expect(encodeUrlQuery(props)).toEqual('/path/here')
  })
})
