import knex from 'knex'
import mockKnex from 'mock-knex'
import * as getJwtToken from '../../util/getJwtToken'
import * as getDbConnection from '../../util/database/getDbConnection'
import * as getVerifiedJwtToken from '../../util/getVerifiedJwtToken'
import adminGetRetrievals from '../handler'

let dbTracker

beforeEach(() => {
  jest.clearAllMocks()

  jest.spyOn(getJwtToken, 'getJwtToken').mockImplementation(() => 'mockJwt')
  jest.spyOn(getVerifiedJwtToken, 'getVerifiedJwtToken').mockImplementation(() => ({ id: 1 }))

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

describe('adminGetRetrievals', () => {
  test('correctly retrieves retrievals', async () => {
    dbTracker.on('query', (query) => {
      query.response([{
        id: 1,
        jsondata: {},
        environment: 'prod',
        created_at: '2019-08-25T11:58:14.390Z',
        user_id: 1,
        username: 'edsc-test',
        total: '3'
      }, {
        id: 2,
        jsondata: {},
        environment: 'prod',
        created_at: '2019-08-25T11:59:14.390Z',
        user_id: 1,
        username: 'edsc-test',
        total: '3'
      }, {
        id: 3,
        jsondata: {},
        environment: 'prod',
        created_at: '2019-08-25T12:00:14.390Z',
        user_id: 1,
        username: 'edsc-test',
        total: '3'
      }])
    })

    const retrievalResponse = await adminGetRetrievals({
      queryStringParameters: null
    }, {})

    const { queries } = dbTracker.queries

    expect(queries[0].method).toEqual('select')

    const { body, statusCode } = retrievalResponse

    const responseObj = {
      pagination: {
        page_num: 1,
        page_size: 20,
        page_count: 1,
        total_results: 3
      },
      results: [
        {
          id: 1,
          jsondata: {},
          environment: 'prod',
          created_at: '2019-08-25T11:58:14.390Z',
          user_id: 1,
          username: 'edsc-test',
          total: '3',
          obfuscated_id: '4517239960'
        },
        {
          id: 2,
          jsondata: {},
          environment: 'prod',
          created_at: '2019-08-25T11:59:14.390Z',
          user_id: 1,
          username: 'edsc-test',
          total: '3',
          obfuscated_id: '7023641925'
        },
        {
          id: 3,
          jsondata: {},
          environment: 'prod',
          created_at: '2019-08-25T12:00:14.390Z',
          user_id: 1,
          username: 'edsc-test',
          total: '3',
          obfuscated_id: '2057964173'
        }
      ]
    }
    expect(body).toEqual(JSON.stringify(responseObj))
    expect(statusCode).toEqual(200)
  })

  test('correctly retrieves retrievals when paging params are provided', async () => {
    dbTracker.on('query', (query) => {
      query.response([{
        id: 2,
        jsondata: {},
        environment: 'prod',
        created_at: '2019-08-25T11:59:14.390Z',
        user_id: 1,
        username: 'edsc-test',
        total: '3'
      }])
    })

    const retrievalResponse = await adminGetRetrievals({
      queryStringParameters: {
        page_num: 2,
        page_size: 1
      }
    }, {})

    const { queries } = dbTracker.queries

    expect(queries[0].method).toEqual('select')

    const { body, statusCode } = retrievalResponse

    const responseObj = {
      pagination: {
        page_num: 2,
        page_size: 1,
        page_count: 3,
        total_results: 3
      },
      results: [
        {
          id: 2,
          jsondata: {},
          environment: 'prod',
          created_at: '2019-08-25T11:59:14.390Z',
          user_id: 1,
          username: 'edsc-test',
          total: '3',
          obfuscated_id: '7023641925'
        }
      ]
    }
    expect(body).toEqual(JSON.stringify(responseObj))
    expect(statusCode).toEqual(200)
  })

  test('correctly returns an error', async () => {
    dbTracker.on('query', (query) => {
      query.reject('Unknown Error')
    })

    const retrievalResponse = await adminGetRetrievals({}, {})

    const { queries } = dbTracker.queries

    expect(queries[0].method).toEqual('select')

    const { statusCode } = retrievalResponse

    expect(statusCode).toEqual(500)
  })
})
