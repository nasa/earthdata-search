import knex from 'knex'
import mockKnex from 'mock-knex'
import * as getUrsUserData from '../getUrsUserData'
import * as getEchoProfileData from '../getEchoProfileData'
import * as getEchoPreferencesData from '../getEchoPreferencesData'
import * as getDbConnection from '../../util/database/getDbConnection'
import storeUserData from '../handler'

let ursUserDataMock
let echoProfileDataMock
let echoPreferencesDataMock

let dbTracker

beforeEach(() => {
  jest.clearAllMocks()

  ursUserDataMock = jest.spyOn(getUrsUserData, 'getUrsUserData').mockImplementationOnce(() => ({
    user: {
      uid: 'urs_user',
      first_name: 'urs',
      last_name: 'user'
    }
  }))

  echoProfileDataMock = jest.spyOn(getEchoProfileData, 'getEchoProfileData').mockImplementationOnce(() => ({
    user: {
      id: 'guid',
      first_name: 'echo',
      last_name: 'user'
    }
  }))

  echoPreferencesDataMock = jest.spyOn(getEchoPreferencesData, 'getEchoPreferencesData').mockImplementationOnce(() => ({
    general_contact: {
      uid: 'echo_user',
      first_name: 'echo',
      last_name: 'user'
    }
  }))

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

describe('storeUserData', () => {
  test('correctly inserts a user that does not exist', async () => {
    dbTracker.on('query', (query) => {
      query.response([])
    })

    await storeUserData({ username: 'urs_user', token: 'fake.access.token' }, {})

    expect(ursUserDataMock).toBeCalledTimes(1)
    expect(ursUserDataMock).toBeCalledWith('urs_user', 'fake.access.token')

    expect(echoProfileDataMock).toBeCalledTimes(1)
    expect(echoProfileDataMock).toBeCalledWith('fake.access.token')

    expect(echoPreferencesDataMock).toBeCalledTimes(1)
    expect(echoPreferencesDataMock).toBeCalledWith('guid', 'fake.access.token')

    const { queries } = dbTracker.queries

    expect(queries[0].method).toEqual('select')
    expect(queries[1].method).toEqual('insert')
  })

  test('correctly updates a user that already exists', async () => {
    dbTracker.on('query', (query, step) => {
      // Default response from queries
      query.response([])

      if (step === 1) {
        query.response([{
          id: 1
        }])
      }
    })

    await storeUserData({ username: 'urs_user', token: 'fake.access.token' }, {})

    expect(ursUserDataMock).toBeCalledTimes(1)
    expect(ursUserDataMock).toBeCalledWith('urs_user', 'fake.access.token')

    expect(echoProfileDataMock).toBeCalledTimes(1)
    expect(echoProfileDataMock).toBeCalledWith('fake.access.token')

    expect(echoPreferencesDataMock).toBeCalledTimes(1)
    expect(echoPreferencesDataMock).toBeCalledWith('guid', 'fake.access.token')

    const { queries } = dbTracker.queries

    expect(queries[0].method).toEqual('select')
    expect(queries[1].method).toEqual('update')
  })
})
