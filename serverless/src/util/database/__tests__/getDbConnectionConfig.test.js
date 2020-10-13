import { getDbConnectionConfig } from '../getDbConnectionConfig'

import * as getDbCredentials from '../getDbCredentials'

const OLD_ENV = process.env

describe('getDbConnectionConfig', () => {
  beforeEach(() => {
    // Manage resetting ENV variables
    jest.resetModules()
    process.env = { ...OLD_ENV }
    delete process.env.NODE_ENV
  })

  afterEach(() => {
    // Restore any ENV variables overwritten in tests
    process.env = OLD_ENV
  })

  test('fetches urs credentials from secrets manager', async () => {
    process.env.dbEndpoint = 'db://endpoint.com'
    process.env.dbName = 'test-db'
    process.env.dbPort = 1234

    jest.spyOn(getDbCredentials, 'getDbCredentials').mockImplementationOnce(() => ({
      username: 'username',
      password: 'password'
    }))

    const response = await getDbConnectionConfig()

    expect(response).toEqual({
      user: 'username',
      password: 'password',
      host: 'db://endpoint.com',
      database: 'test-db',
      port: 1234
    })
  })
})
