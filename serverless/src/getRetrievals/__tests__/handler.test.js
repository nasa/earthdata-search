import knex from 'knex'
import mockKnex from 'mock-knex'
import * as getDbConnection from '../../util/database/getDbConnection'
import * as getEarthdataConfig from '../../../../sharedUtils/config'
import getRetrievals from '../handler'

let dbTracker

beforeEach(() => {
  jest.clearAllMocks()

  jest.spyOn(getEarthdataConfig, 'getSecretEarthdataConfig').mockImplementation(() => ({ secret: 'jwt-secret' }))

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

describe('getRetrievals', () => {
  test('correctly retrieves retrievals', async () => {
    dbTracker.on('query', (query) => {
      query.response([{
        id: 1,
        jsondata: {},
        created_at: '2019-08-25T11:58:14.390Z',
        environment: 'prod',
        collection_metadata: {
          title: 'Collection Title One'
        }
      }, {
        id: 1,
        jsondata: {},
        created_at: '2019-08-25T11:58:14.390Z',
        environment: 'prod',
        collection_metadata: {
          title: 'Collection Title Two'
        }
      }, {
        id: 2,
        jsondata: {},
        created_at: '2019-08-25T11:58:14.390Z',
        environment: 'prod',
        collection_metadata: {
          title: 'Collection Title Three'
        }
      }])
    })

    const retrievalsPayload = {
      requestContext: {
        authorizer: {
          jwtToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJlZHNjIiwiaWF0IjoxNTYwNjQzMzA5fQ.PdLjkskCyJdizimUEDKw-KIGyRQGVF4oYOk3OAfGNQw'
        }
      }
    }

    const retrievalResponse = await getRetrievals(retrievalsPayload, {})

    const { queries } = dbTracker.queries

    expect(queries[0].method).toEqual('select')

    const { body, statusCode } = retrievalResponse

    const responseObj = [
      {
        id: '7023641925',
        created_at: '2019-08-25T11:58:14.390Z',
        jsondata: {},
        environment: 'prod',
        collections: [
          {
            title: 'Collection Title Three'
          }
        ]
      },
      {
        id: '4517239960',
        created_at: '2019-08-25T11:58:14.390Z',
        jsondata: {},
        environment: 'prod',
        collections: [
          {
            title: 'Collection Title One'
          },
          {
            title: 'Collection Title Two'
          }
        ]
      }
    ]
    expect(body).toEqual(JSON.stringify(responseObj))
    expect(statusCode).toEqual(200)
  })

  test('correctly returns an error', async () => {
    dbTracker.on('query', (query) => {
      query.reject('Unknown Error')
    })

    const retrievalsPayload = {
      requestContext: {
        authorizer: {
          jwtToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJlZHNjIiwiaWF0IjoxNTYwNjQzMzA5fQ.PdLjkskCyJdizimUEDKw-KIGyRQGVF4oYOk3OAfGNQw'
        }
      }
    }

    const retrievalResponse = await getRetrievals(retrievalsPayload, {})

    const { queries } = dbTracker.queries

    expect(queries[0].method).toEqual('select')

    const { statusCode } = retrievalResponse

    expect(statusCode).toEqual(500)
  })

  test('correctly returns false when the warmUp payload is received', async () => {
    const retrievalsPayload = {
      source: 'serverless-plugin-warmup'
    }

    const retrievalResponse = await getRetrievals(retrievalsPayload, {})

    expect(retrievalResponse).toEqual(false)
  })
})
