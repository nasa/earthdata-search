import knex from 'knex'
import mockKnex from 'mock-knex'

import getProjects from '../handler'
import * as getJwtToken from '../../util/getJwtToken'
import * as getVerifiedJwtToken from '../../util/getVerifiedJwtToken'
import * as getDbConnection from '../../util/database/getDbConnection'

let dbConnectionToMock
let dbTracker

beforeEach(() => {
  jest.clearAllMocks()

  jest.spyOn(getJwtToken, 'getJwtToken').mockImplementation(() => 'mockJwt')
  jest.spyOn(getVerifiedJwtToken, 'getVerifiedJwtToken').mockImplementation(() => ({ username: 'testuser' }))

  jest.spyOn(getDbConnection, 'getDbConnection').mockImplementationOnce(() => {
    dbConnectionToMock = knex({
      client: 'pg',
      debug: false
    })

    // Mock the db connection
    mockKnex.mock(dbConnectionToMock)

    return dbConnectionToMock
  })

  dbTracker = mockKnex.getTracker()
  dbTracker.install()
})

afterEach(() => {
  dbTracker.uninstall()
})

describe('getProjects', () => {
  test('deletes the project and returns the remaining projects', async () => {
    dbTracker.on('query', (query, step) => {
      if (step === 1) {
        query.response([
          {
            id: 1,
            name: 'project 1',
            path: '/search?p=!C123456-EDSC',
            created_at: '2019-09-05 00:00:00.000'
          },
          {
            id: 3,
            name: 'project 3',
            path: '/search?p=!C123456-EDSC',
            created_at: '2019-09-05 00:00:00.000'
          }
        ])
      } else {
        query.response(undefined)
      }
    })

    const result = await getProjects({}, {})

    const expectedBody = JSON.stringify([
      {
        id: '4517239960',
        name: 'project 1',
        path: '/search?p=!C123456-EDSC',
        created_at: '2019-09-05 00:00:00.000'
      },
      {
        id: '2057964173',
        name: 'project 3',
        path: '/search?p=!C123456-EDSC',
        created_at: '2019-09-05 00:00:00.000'
      }
    ])

    const { queries } = dbTracker.queries
    expect(queries[0].method).toEqual('select')

    expect(result.body).toEqual(expectedBody)
  })

  test('responds correctly on error', async () => {
    dbTracker.on('query', (query) => {
      query.reject('Unknown Error')
    })

    const response = await getProjects({}, {})

    expect(response.statusCode).toEqual(500)
  })
})
