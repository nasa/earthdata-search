import nock from 'nock'

import { retrieveVariablesRequest } from "../retrieveVariablesRequest"

beforeEach(() => {
  jest.restoreAllMocks()
  jest.clearAllMocks()
})

jest.mock('../../util/request/graphQlRequest', () => {
  const search = (query, variables, format = undefined) => {
    return nock()
  }
})

const initParams = {
  variables: [],
  requestParams: {
    params: {
      conceptId: 'C10000000000-EDSC',
      includeHasGranules: true,
      includeTags: {'org.ceos.wgiss.cwic.granules.prod': {}}
    },
    variableParams: {
      limit: 2000,
      cursor: null
    }
  },
  graphQlRequestObject: jest(),
  queryType: 'GetCollection'
}

describe('retrieveVariablesRequest', () => {
  test('retrieves only once when num variables < limit (2000)', () => {
    const GraphQlRequest = jest.mock('../../util/request/graphQlRequest')
    GraphQlRequest

    const graphQlRequestObject = new GraphQlRequest()

    retrieveVariablesRequest
  })
})
