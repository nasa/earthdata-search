import { decodeUrlParams, encodeUrlQuery } from '../url'

import { emptyDecodedResult } from './url.mocks'

import * as deployedEnvironment from '../../../../../../sharedUtils/deployedEnvironment'

beforeEach(() => {
  jest.spyOn(deployedEnvironment, 'deployedEnvironment').mockImplementation(() => 'prod')
})

describe('url#decodeUrlParams', () => {
  test('decodes scienceKeywordFacets correctly', () => {
    const expectedResult = {
      ...emptyDecodedResult,
      cmrFacets: {
        science_keywords_h: [{
          topic: 'topic1',
          term: 'term1',
          variable_level_1: 'level1',
          variable_level_2: 'level2',
          variable_level_3: 'level3',
          detailed_variable: 'detailed'
        },
        {
          topic: 'topic2',
          term: 'term2'
        }]
      }
    }
    expect(decodeUrlParams('?fst0=topic1&fsm0=term1&fs10=level1&fs20=level2&fs30=level3&fsd0=detailed&fst1=topic2&fsm1=term2')).toEqual(expectedResult)
  })
})

describe('url#encodeUrlQuery', () => {
  test('does not encode facets if no facets exist', () => {
    const props = {
      hasGranulesOrCwic: true,
      pathname: '/path/here',
      scienceKeywordFacets: []
    }
    expect(encodeUrlQuery(props)).toEqual('/path/here')
  })

  test('encodes scienceKeywordFacets correctly', () => {
    const props = {
      hasGranulesOrCwic: true,
      pathname: '/path/here',
      scienceKeywordFacets: [{
        topic: 'topic1',
        term: 'term1',
        variable_level_1: 'level1',
        variable_level_2: 'level2',
        variable_level_3: 'level3',
        detailed_variable: 'detailed'
      },
      {
        topic: 'topic2',
        term: 'term2'
      }]
    }
    expect(encodeUrlQuery(props)).toEqual('/path/here?fst0=topic1&fsm0=term1&fs10=level1&fs20=level2&fs30=level3&fsd0=detailed&fst1=topic2&fsm1=term2')
  })
})
