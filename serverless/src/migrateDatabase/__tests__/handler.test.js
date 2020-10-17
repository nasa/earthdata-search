import * as pgMigrate from 'node-pg-migrate'

import knex from 'knex'
import mockKnex from 'mock-knex'

import * as getDbConnectionConfig from '../../util/database/getDbConnectionConfig'

jest.mock('pg', () => {
  const mClient = {
    connect: jest.fn(),
    query: jest.fn(),
    end: jest.fn()
  }

  return { Client: jest.fn(() => mClient) }
})

import * as getDbConnection from '../../util/database/getDbConnection'

import migrateDatabase from '../handler'

let dbTracker

beforeEach(() => {
  jest.clearAllMocks()

  jest.spyOn(getDbConnectionConfig, 'getDbConnectionConfig').mockImplementation(() => ({
    client: 'pg'
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

describe('migrateDatabase', () => {
  describe('when there are migrations to run', () => {
    test('returns the results', async () => {
      jest.spyOn(pgMigrate, 'default').mockImplementationOnce(() => [{ id: 'asdf' }])

      const response = await migrateDatabase({})

      expect(response).toEqual({
        statusCode: 200,
        isBase64Encoded: false,
        body: JSON.stringify([{ id: 'asdf' }])
      })
    })
  })

  describe('when there are no migrations to run', () => {
    test('returns the results', async () => {
      jest.spyOn(pgMigrate, 'default').mockImplementationOnce(() => [])

      const response = await migrateDatabase([])

      expect(response).toEqual({
        statusCode: 200,
        isBase64Encoded: false,
        body: JSON.stringify({ message: 'No migrations to run!' })
      })
    })
  })

  describe('when an error occurs during the migration', () => {
    test('returns the results', async () => {
      jest.spyOn(pgMigrate, 'default').mockImplementationOnce(() => {
        throw new Error('Migration Error')
      })

      const response = await migrateDatabase([])

      expect(response).toEqual({
        statusCode: 500,
        isBase64Encoded: false,
        body: JSON.stringify({
          statusCode: 500,
          errors: ['Error: Migration Error']
        })
      })
    })
  })
})
