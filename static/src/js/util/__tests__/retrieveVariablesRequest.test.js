import nock from 'nock'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import GraphQlRequest from '../request/graphQlRequest'

import * as getEarthdataConfig from '../../../../../sharedUtils/config'

import { retrieveVariablesRequest } from '../retrieveVariablesRequest'

const mockStore = configureMockStore([thunk])

beforeEach(() => {
  jest.restoreAllMocks()
  jest.clearAllMocks()
})

const initParams = {
  variables: {
    items: [{
      conceptId: 'V10000000000-EDSC'
    }],
    cursor: 'mock-cursor-0'
  },
  requestParams: {
    params: {
      conceptId: 'C10000000000-EDSC',
      includeHasGranules: true,
      includeTags: { 'org.ceos.wgiss.cwic.granules.prod': {} }
    },
    variableParams: {
      limit: 1,
      count: 2,
      cursor: 'mock-cursor-0'
    }
  }
}

describe('retrieveVariablesRequest', () => {
  test('retrieves only once when num variables < limit (1)', async () => {
    nock(/graph/)
      .post(/api/)
      .reply(200, {
        data: {
          variables: {
            items: [{
              conceptId: 'V10000000001-EDSC'
            }],
            count: 2,
            cursor: null
          }
        }
      })

    jest.spyOn(getEarthdataConfig, 'getEarthdataConfig').mockImplementationOnce(() => ({
      cmrHost: 'https://cmr.example.com',
      graphQlHost: 'https://graphql.example.com',
      opensearchRoot: 'https://cmr.example.com'
    }))

    const store = mockStore({
      authToken: '',
      focusedCollection: 'C10000000000-EDSC',
      metadata: {
        collections: {
          'C10000000000-EDSC': {
            hasAllMetadata: true
          }
        }
      },
      query: {
        collection: {
          spatial: {}
        }
      },
      searchResults: {}
    })

    const earthdataEnvironment = {
      cmrHost: 'https://cmr.example.com',
      graphQlHost: 'https://graphql.example.com',
      opensearchRoot: 'https://cmr.example.com'
    }

    const graphQlRequest = new GraphQlRequest(store.auth, earthdataEnvironment)

    const resultVars = await retrieveVariablesRequest(
      initParams.variables,
      initParams.requestParams,
      graphQlRequest
    )

    expect(resultVars).toEqual([
      {
        conceptId: 'V10000000000-EDSC'
      },
      {
        conceptId: 'V10000000001-EDSC'
      }
    ])
  })

  test('retrieves 4 variables (with one already there) when num variables < limit (1)', async () => {
    nock(/graph/)
      .post(/api/)
      .reply(200, {
        data: {
          variables: {
            items: [{
              conceptId: 'V10000000001-EDSC'
            }],
            count: 4,
            cursor: 'mock-cursor-1'
          }
        }
      })

    nock(/graph/)
      .post(/api/)
      .reply(200, {
        data: {
          variables: {
            items: [{
              conceptId: 'V10000000002-EDSC'
            }],
            count: 4,
            cursor: 'mock-cursor-2'
          }
        }
      })

    nock(/graph/)
      .post(/api/)
      .reply(200, {
        data: {
          variables: {
            items: [{
              conceptId: 'V10000000003-EDSC'
            }],
            count: 4,
            cursor: null
          }
        }
      })

    jest.spyOn(getEarthdataConfig, 'getEarthdataConfig').mockImplementationOnce(() => ({
      cmrHost: 'https://cmr.example.com',
      graphQlHost: 'https://graphql.example.com',
      opensearchRoot: 'https://cmr.example.com'
    }))

    const store = mockStore({
      authToken: '',
      focusedCollection: 'C10000000000-EDSC',
      metadata: {
        collections: {
          'C10000000000-EDSC': {
            hasAllMetadata: true
          }
        }
      },
      query: {
        collection: {
          spatial: {}
        }
      },
      searchResults: {}
    })

    const earthdataEnvironment = {
      cmrHost: 'https://cmr.example.com',
      graphQlHost: 'https://graphql.example.com',
      opensearchRoot: 'https://cmr.example.com'
    }

    const graphQlRequest = new GraphQlRequest(store.auth, earthdataEnvironment)

    const resultVars = await retrieveVariablesRequest(
      initParams.variables,
      initParams.requestParams,
      graphQlRequest
    )

    expect(resultVars).toEqual([
      {
        conceptId: 'V10000000000-EDSC'
      },
      {
        conceptId: 'V10000000001-EDSC'
      },
      {
        conceptId: 'V10000000002-EDSC'
      },
      {
        conceptId: 'V10000000003-EDSC'
      }
    ])
  })

  test('retrieves variables when the passed in format is that of GetProjectCollections', async () => {
    nock(/graph/)
      .post(/api/)
      .reply(200, {
        data: {
          variables: {
            items: [{
              conceptId: 'V10000000001-EDSC'
            }],
            count: 4,
            cursor: 'mock-cursor-1'
          }
        }
      })

    nock(/graph/)
      .post(/api/)
      .reply(200, {
        data: {
          variables: {
            items: [{
              conceptId: 'V10000000002-EDSC'
            }],
            count: 4,
            cursor: 'mock-cursor-2'
          }
        }
      })

    nock(/graph/)
      .post(/api/)
      .reply(200, {
        data: {
          variables: {
            items: [{
              conceptId: 'V10000000003-EDSC'
            }],
            count: 4,
            cursor: null
          }
        }
      })

    jest.spyOn(getEarthdataConfig, 'getEarthdataConfig').mockImplementationOnce(() => ({
      cmrHost: 'https://cmr.example.com',
      graphQlHost: 'https://graphql.example.com',
      opensearchRoot: 'https://cmr.example.com'
    }))

    const store = mockStore({
      authToken: '',
      focusedCollection: 'C10000000000-EDSC',
      metadata: {
        collections: {
          'C10000000000-EDSC': {
            hasAllMetadata: true
          }
        }
      },
      query: {
        collection: {
          spatial: {}
        }
      },
      searchResults: {}
    })

    const earthdataEnvironment = {
      cmrHost: 'https://cmr.example.com',
      graphQlHost: 'https://graphql.example.com',
      opensearchRoot: 'https://cmr.example.com'
    }

    const graphQlRequest = new GraphQlRequest(store.auth, earthdataEnvironment)

    const resultVars = await retrieveVariablesRequest(
      initParams.variables,
      initParams.requestParams,
      graphQlRequest
    )

    expect(resultVars).toEqual([
      {
        conceptId: 'V10000000000-EDSC'
      },
      {
        conceptId: 'V10000000001-EDSC'
      },
      {
        conceptId: 'V10000000002-EDSC'
      },
      {
        conceptId: 'V10000000003-EDSC'
      }
    ])
  })
})
