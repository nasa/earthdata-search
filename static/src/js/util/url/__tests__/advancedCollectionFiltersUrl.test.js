import { decodeUrlParams, encodeUrlQuery } from '../url'

import { emptyDecodedResult } from './url.mocks'

import * as deployedEnvironment from '../../../../../../sharedUtils/deployedEnvironment'
import * as getApplicationConfig from '../../../../../../sharedUtils/config'

const advancedFilterCases = [
  {
    key: 'entryId',
    value: ['ATL03_004', 'ATL06_006'],
    queryString: '?entry_id[0]=ATL03_004&entry_id[1]=ATL06_006'
  },
  {
    key: 'shortName',
    value: ['ATL03', 'ATL06'],
    queryString: '?short_name[0]=ATL03&short_name[1]=ATL06'
  },
  {
    key: 'version',
    value: ['004', '005'],
    queryString: '?version[0]=004&version[1]=005'
  },
  {
    key: 'doi',
    value: ['10.5067/EXAMPLE', '10.5067/OTHER_DOI'],
    queryString: '?doi[0]=10.5067/EXAMPLE&doi[1]=10.5067/OTHER_DOI'
  },
  {
    key: 'entryTitle',
    value: ['Example Collection', 'Other Collection'],
    queryString: '?entry_title[0]=Example%20Collection&entry_title[1]=Other%20Collection'
  },
  {
    key: 'consortium',
    value: ['CEOS', 'EOSDIS'],
    queryString: '?consortium[0]=CEOS&consortium[1]=EOSDIS'
  },
  {
    key: 'collectionDataType',
    value: ['SCIENCE_QUALITY'],
    queryString: '?collection_data_type[0]=SCIENCE_QUALITY'
  },
  {
    key: 'collectionProgress',
    value: ['ACTIVE', 'COMPLETE'],
    queryString: '?collection_progress[0]=ACTIVE&collection_progress[1]=COMPLETE'
  },
  {
    key: 'downloadable',
    value: true,
    queryString: '?downloadable=t'
  },
  {
    key: 'browsable',
    value: true,
    queryString: '?browsable=t'
  },
  {
    key: 'variableName',
    value: ['temperature', 'pressure'],
    queryString: '?variable_name[0]=temperature&variable_name[1]=pressure'
  },
  {
    key: 'serviceName',
    value: ['Harmony', 'OPeNDAP'],
    queryString: '?service_name[0]=Harmony&service_name[1]=OPeNDAP'
  },
  {
    key: 'toolName',
    value: ['NASA_GISS_Panoply', 'Other Tool'],
    queryString: '?tool_name[0]=NASA_GISS_Panoply&tool_name[1]=Other%20Tool'
  }
]

beforeEach(() => {
  vi.spyOn(deployedEnvironment, 'deployedEnvironment').mockImplementation(() => 'prod')
  vi.spyOn(getApplicationConfig, 'getApplicationConfig').mockImplementation(() => ({
    defaultPortal: 'default'
  }))
})

describe('url#decodeUrlParams', () => {
  test.each(advancedFilterCases)('decodes $key correctly', ({
    key,
    value,
    queryString
  }) => {
    const expectedResult = {
      ...emptyDecodedResult,
      query: {
        ...emptyDecodedResult.query,
        collection: {
          ...emptyDecodedResult.query.collection,
          [key]: value
        }
      }
    }

    expect(decodeUrlParams(queryString)).toEqual(expectedResult)
  })

  test('decodes a plain DOI parameter as a selected DOI', () => {
    const expectedResult = {
      ...emptyDecodedResult,
      query: {
        ...emptyDecodedResult.query,
        collection: {
          ...emptyDecodedResult.query.collection,
          doi: ['10.5067/EXAMPLE']
        }
      }
    }

    expect(decodeUrlParams('?doi=10.5067/EXAMPLE')).toEqual(expectedResult)
  })
})

describe('url#encodeUrlQuery', () => {
  test.each(advancedFilterCases)('encodes $key correctly', ({
    key,
    value,
    queryString
  }) => {
    const props = {
      collectionsQuery: {
        hasGranulesOrCwic: true,
        [key]: value
      },
      pathname: '/path/here'
    }

    expect(encodeUrlQuery(props)).toEqual(`/path/here${queryString}`)
  })
})
