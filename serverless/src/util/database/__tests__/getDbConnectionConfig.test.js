import { getDbConnectionConfig } from '../getDbConnectionConfig'

import * as getDbCredentials from '../getDbCredentials'

const OLD_ENV = process.env

describe('getDbConnectionConfig', () => {
  beforeEach(() => {
    process.env = { ...OLD_ENV }
    delete process.env.NODE_ENV
  })

  afterEach(() => {
    // Restore any ENV variables overwritten in tests
    process.env = OLD_ENV
  })

  test('fetches urs credentials from secrets manager', async () => {
    process.env.DATABASE_ENDPOINT = 'db://endpoint.com'
    process.env.DB_NAME = 'test-db'
    process.env.DATABASE_PORT = 1234

    vi.spyOn(getDbCredentials, 'getDbCredentials').mockImplementationOnce(() => ({
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
