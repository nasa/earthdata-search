import knex from 'knex'
import mockKnex from 'mock-knex'

import * as getDbConnection from '../../util/database/getDbConnection'
import * as getAuthorizerContext from '../../util/getAuthorizerContext'

import getRetrieval from '../handler'
import { retrievalPayload } from './mocks'

let dbTracker

beforeEach(() => {
  jest.spyOn(getAuthorizerContext, 'getAuthorizerContext').mockImplementation(() => ({ userId: 1 }))

  jest.spyOn(getDbConnection, 'getDbConnection').mockImplementationOnce(() => {
    const dbCon = knex({
      client: 'pg',
      debug: false
    })

    // Mock the db connection
    mockKnex.mock(dbCon)

    return dbCon
  })

  dbTracker = mockKnex.getTracker()
  dbTracker.install()
})

afterEach(() => {
  dbTracker.uninstall()
})

describe('getRetrieval', () => {
  test('correctly retrieves a known retrieval', async () => {
    dbTracker.on('query', (query) => {
      query.response([{
        jsondata: {},
        token: 'asdf',
        environment: 'prod',
        collections: {}
      }])
    })

    const retrievalResponse = await getRetrieval(retrievalPayload, {})

    const { queries } = dbTracker.queries

    expect(queries[0].method).toEqual('select')

    const { body, statusCode } = retrievalResponse

    expect(body).toEqual('{"id":2,"jsondata":{},"collections":{},"links":[]}')
    expect(statusCode).toEqual(200)
  })

  test('correctly retrieves a known retrieval with collection retrievals', async () => {
    dbTracker.on('query', (query) => {
      query.response([{
        retrieval_id: 2,
        jsondata: {},
        created_at: '2019-07-09 17:05:27.000000',
        id: 22,
        access_method: {
          type: 'download'
        },
        collection_metadata: {},
        granule_count: 3
      }, {
        retrieval_id: 2,
        jsondata: {},
        created_at: '2019-07-09 17:05:56.000000',
        id: 23,
        access_method: {
          type: 'download'
        },
        collection_metadata: {},
        granule_count: 3
      }])
    })

    const retrievalResponse = await getRetrieval(retrievalPayload, {})

    const { queries } = dbTracker.queries

    expect(queries[0].method).toEqual('select')

    const { body, statusCode } = retrievalResponse

    const expectedResponse = {
      id: 2,
      jsondata: {},
      created_at: '2019-07-09 17:05:27.000000',
      collections: {
        byId: {
          22: {
            access_method: {
              type: 'download'
            },
            collection_metadata: {},
            granule_count: 3,
            id: 22,
            retrieval_collection_id: '9452013926',
            retrieval_id: 2
          },
          23: {
            access_method: {
              type: 'download'
            },
            collection_metadata: {},
            granule_count: 3,
            id: 23,
            retrieval_collection_id: '4519237960',
            retrieval_id: 2
          }
        },
        download: [22, 23]
      },
      links: []
    }
    expect(body).toEqual(JSON.stringify(expectedResponse))
    expect(statusCode).toEqual(200)
  })

  test('correctly determines the list of links', async () => {
    dbTracker.on('query', (query) => {
      query.response([{
        retrieval_id: 2,
        jsondata: {},
        created_at: '2019-07-09 17:05:27.000000',
        id: 22,
        access_method: {
          type: 'download'
        },
        collection_metadata: {
          dataset_id: 'Testing a dataset id',
          links: [{
            rel: 'http://esipfed.org/ns/fedsearch/1.1/metadata#',
            href: 'https://search.earthdata.nasa.gov'
          }, {
            rel: 'http://esipfed.org/ns/fedsearch/1.1/metadata#',
            href: 'https://search.earthdata.nasa.gov'
          }]
        },
        granule_count: 3
      }, {
        retrieval_id: 2,
        jsondata: {},
        created_at: '2019-07-09 17:05:56.000000',
        id: 23,
        access_method: {
          type: 'download'
        },
        collection_metadata: {},
        granule_count: 3
      }])
    })

    const retrievalResponse = await getRetrieval(retrievalPayload, {})

    const { queries } = dbTracker.queries

    expect(queries[0].method).toEqual('select')

    const { body, statusCode } = retrievalResponse

    const expectedResponse = {
      id: 2,
      jsondata: {},
      created_at: '2019-07-09 17:05:27.000000',
      collections: {
        byId: {
          22: {
            access_method: {
              type: 'download'
            },
            collection_metadata: {
              dataset_id: 'Testing a dataset id',
              links: [{
                rel: 'http://esipfed.org/ns/fedsearch/1.1/metadata#',
                href: 'https://search.earthdata.nasa.gov'
              }, {
                rel: 'http://esipfed.org/ns/fedsearch/1.1/metadata#',
                href: 'https://search.earthdata.nasa.gov'
              }]
            },
            granule_count: 3,
            id: 22,
            retrieval_collection_id: '9452013926',
            retrieval_id: 2
          },
          23: {
            access_method: {
              type: 'download'
            },
            collection_metadata: {},
            granule_count: 3,
            id: 23,
            retrieval_collection_id: '4519237960',
            retrieval_id: 2
          }
        },
        download: [22, 23]
      },
      links: [{
        dataset_id: 'Testing a dataset id',
        links: [{
          rel: 'http://esipfed.org/ns/fedsearch/1.1/metadata#',
          href: 'https://search.earthdata.nasa.gov'
        }]
      }]
    }

    expect(body).toEqual(JSON.stringify(expectedResponse))
    expect(statusCode).toEqual(200)
  })

  test('returns a 404 when no retrieval is found', async () => {
    dbTracker.on('query', (query) => {
      query.response([])
    })

    const retrievalResponse = await getRetrieval(retrievalPayload, {})

    const { queries } = dbTracker.queries

    expect(queries[0].method).toEqual('select')

    const { body, statusCode } = retrievalResponse

    expect(body).toEqual('{"errors":["Retrieval \'2\' not found."]}')
    expect(statusCode).toEqual(404)
  })

  test('correctly returns an error', async () => {
    dbTracker.on('query', (query) => {
      query.reject('Unknown Error')
    })

    const response = await getRetrieval(retrievalPayload, {})

    const { queries } = dbTracker.queries

    expect(queries[0].method).toEqual('select')

    expect(response.statusCode).toEqual(500)
  })
})
