import knex from 'knex'
import mockKnex from 'mock-knex'

import * as getDbConnection from '../../util/database/getDbConnection'
import * as parseError from '../../../../sharedUtils/parseError'
import * as getUrsUserData from '../getUrsUserData'

import storeUserData from '../handler'

let dbTracker

beforeEach(() => {
  vi.spyOn(getDbConnection, 'getDbConnection').mockImplementationOnce(() => {
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

describe('storeUserData', () => {
  test('correctly updates a user that already exists', async () => {
    vi.spyOn(getUrsUserData, 'getUrsUserData').mockResolvedValue({
      user: {
        uid: 'urs_user',
        first_name: 'urs',
        last_name: 'user'
      }
    })

    dbTracker.on('query', (query, step) => {
      // Default response from queries
      query.response([])

      if (step === 1) {
        query.response([{
          access_token: 'fake.access.token'
        }])
      }
    })

    await storeUserData({
      Records: [{
        body: JSON.stringify({
          edlToken: 'mock-token',
          environment: 'test',
          userId: 1,
          username: 'urs_user'
        })
      }]
    }, {})

    const { queries } = dbTracker.queries

    expect(queries[0].method).toEqual('update')
    expect(queries[0].bindings).toEqual([
      'test',
      'urs_user',
      {
        user: {
          uid: 'urs_user',
          first_name: 'urs',
          last_name: 'user'
        }
      },
      1
    ])
  })

  test('logs error if URS data is not fetched properly', async () => {
    const parseErrorMock = vi.spyOn(parseError, 'parseError').mockImplementation(() => {})
    vi.spyOn(getUrsUserData, 'getUrsUserData').mockImplementation(() => { throw new Error('mock error') })

    dbTracker.on('query', (query, step) => {
      // Default response from queries
      query.response([])

      if (step === 1) {
        query.response([{
          access_token: 'fake.access.token'
        }])
      }
    })

    await storeUserData({
      Records: [{
        body: JSON.stringify({
          edlToken: 'mock-token',
          environment: 'test',
          userId: 1,
          username: 'urs_user'
        })
      }]
    }, {})

    const { queries } = dbTracker.queries

    expect(queries[0].method).toEqual('update')
    expect(queries[0].bindings).toEqual([
      'test',
      'urs_user',
      1
    ])

    expect(parseErrorMock).toHaveBeenCalledTimes(1)
    expect(parseErrorMock).toHaveBeenCalledWith(new Error('mock error'), { logPrefix: '[StoreUserData Error] (URS Profile)' })
  })

  test('logs error if user does not have a token', async () => {
    const consoleMock = vi.spyOn(console, 'log')

    dbTracker.on('query', (query, step) => {
      // Default response from queries
      query.response([])

      if (step === 1) {
        query.response([])
      }
    })

    await storeUserData({
      Records: [{
        body: JSON.stringify({
          edlToken: null,
          environment: 'test',
          userId: 1,
          username: 'urs_user'
        })
      }]
    }, {})

    expect(consoleMock).toHaveBeenCalledTimes(4)
    expect(consoleMock).toHaveBeenNthCalledWith(1, 'Processing 1 user(s)')
    expect(consoleMock).toHaveBeenNthCalledWith(2, '[StoreUserData Debug] Payload received: {"edlToken":null,"environment":"test","userId":1,"username":"urs_user"}')
    expect(consoleMock).toHaveBeenNthCalledWith(3, '[StoreUserData Debug] Attempting to retrieve user data for urs_user (id: 1, environment: test).')
    expect(consoleMock).toHaveBeenNthCalledWith(4, '[StoreUserData Debug] Ignoring attempt to retrieve user data for urs_user (userId: 1, environment: test) because the user doesn\'t have a token.')
  })

  test('returns early if SQS records are empty', async () => {
    dbTracker.on('query', (query, step) => {
      // Default response from queries
      query.response([])

      if (step === 1) {
        query.response([])
      }
    })

    await storeUserData({
      Records: []
    }, {})
  })

  test('returns early if there are no SQS records', async () => {
    dbTracker.on('query', (query, step) => {
      // Default response from queries
      query.response([])

      if (step === 1) {
        query.response([])
      }
    })

    await storeUserData({}, {})
  })
})
