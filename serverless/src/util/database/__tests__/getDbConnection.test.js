import knex from 'knex'
import mockKnex from 'mock-knex'

import { getDbConnection } from '../getDbConnection'

import * as getDbConnectionConfig from '../getDbConnectionConfig'

describe('getDbConnection', () => {
  test('returns a connection to the db', async () => {
    jest.spyOn(getDbConnectionConfig, 'getDbConnectionConfig').mockImplementation(() => ({
      client: 'pg',
      host: 'http://host.com',
      database: 'test',
      port: '1234'
    }))

    const dbCon = knex({
      client: 'pg',
      host: 'http://host.com',
      database: 'test',
      port: '1234'
    })

    // Mock the db connection
    mockKnex.mock(dbCon)

    const response = await getDbConnection()

    expect(JSON.stringify(response)).toEqual(JSON.stringify(dbCon))
  })
})
