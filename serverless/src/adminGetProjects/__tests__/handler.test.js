import knex from 'knex'
import mockKnex from 'mock-knex'
import * as getJwtToken from '../../util/getJwtToken'
import * as getDbConnection from '../../util/database/getDbConnection'
import * as getVerifiedJwtToken from '../../util/getVerifiedJwtToken'
import adminGetProjects from '../handler'

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

describe('adminGetProjects', () => {
  test('correctly retrieves projects', async () => {
    dbTracker.on('query', (query) => {
      query.response([
        {
          id: 3,
          name: 'customizable cloud',
          path: '/search?ff=Available%20from%20AWS%20Cloud!Customizable',
          created_at: '2022-09-14T13:07:57.672Z',
          user_id: 1,
          username: 'testUser',
          total: '3',
          obfuscated_id: '2057964173'
        },
        {
          id: 2,
          name: 'map imagery',
          path: '/search?ff=Map%20Imagery',
          created_at: '2022-09-14T00:14:29.708Z',
          user_id: 1,
          username: 'testUser',
          total: '3',
          obfuscated_id: '7023641925'
        },
        {
          id: 1,
          name: 'test project',
          path: '/search?polygon[0]=101%2C0%2C101%2C1%2C100%2C1%2C100%2C0%2C101%2C0&line[0]=102%2C0%2C103%2C1%2C104%2C0%2C105%2C1&sf=7023641925&sfs[0]=2&sfs[1]=1&lat=2.4500902465691894&long=87.12158203125&zoom=4',
          created_at: '2022-09-14T00:14:18.861Z',
          user_id: 1,
          username: 'testUser',
          total: '3',
          obfuscated_id: '4517239960'
        }
      ])
    })

    const projectResponse = await adminGetProjects({
      queryStringParameters: null
    }, {})

    const { queries } = dbTracker.queries

    expect(queries[0].method).toEqual('select')

    const { body, statusCode } = projectResponse

    const responseObj = {
      pagination: {
        page_num: 1,
        page_size: 20,
        page_count: 1,
        total_results: 3
      },
      results: [
        {
          id: 3,
          name: 'customizable cloud',
          path: '/search?ff=Available%20from%20AWS%20Cloud!Customizable',
          created_at: '2022-09-14T13:07:57.672Z',
          user_id: 1,
          username: 'testUser',
          total: '3',
          obfuscated_id: '2057964173'
        },
        {
          id: 2,
          name: 'map imagery',
          path: '/search?ff=Map%20Imagery',
          created_at: '2022-09-14T00:14:29.708Z',
          user_id: 1,
          username: 'testUser',
          total: '3',
          obfuscated_id: '7023641925'
        },
        {
          id: 1,
          name: 'test project',
          path: '/search?polygon[0]=101%2C0%2C101%2C1%2C100%2C1%2C100%2C0%2C101%2C0&line[0]=102%2C0%2C103%2C1%2C104%2C0%2C105%2C1&sf=7023641925&sfs[0]=2&sfs[1]=1&lat=2.4500902465691894&long=87.12158203125&zoom=4',
          created_at: '2022-09-14T00:14:18.861Z',
          user_id: 1,
          username: 'testUser',
          total: '3',
          obfuscated_id: '4517239960'
        }
      ]
    }
    expect(body).toEqual(JSON.stringify(responseObj))
    expect(statusCode).toEqual(200)
  })

  test('correctly retrieves projects when paging params are provided', async () => {
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

    const projectResponse = await adminGetProjects({
      queryStringParameters: {
        page_num: 2,
        page_size: 1
      }
    }, {})

    const { queries } = dbTracker.queries

    expect(queries[0].method).toEqual('select')

    const { body, statusCode } = projectResponse

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

    const projectResponse = await adminGetProjects({}, {})

    const { queries } = dbTracker.queries

    expect(queries[0].method).toEqual('select')

    const { statusCode } = projectResponse

    expect(statusCode).toEqual(500)
  })
})
