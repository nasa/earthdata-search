import knex from 'knex'
import mockKnex from 'mock-knex'
import MockDate from 'mockdate'

import * as getDbConnection from '../../util/database/getDbConnection'

import cleanupOldRetrievals from '../handler'

let dbConnectionToMock
let dbTracker

beforeEach(() => {
  // Mock the current date to a fixed date for consistent testing
  MockDate.set('2024-01-15T10:00:00.000Z')

  vi.spyOn(getDbConnection, 'getDbConnection').mockImplementationOnce(() => {
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
  MockDate.reset()
})

describe('cleanupOldRetrievals', () => {
  test('successfully executes the correct SQL query and returns response', async () => {
    const deletedCount = 5
    const consoleMock = vi.spyOn(console, 'log').mockImplementation()

    dbTracker.on('query', (query, step) => {
      if (step === 1) {
        // First query: deleting old retrievals
        query.response(deletedCount)
      } else if (step === 2) {
        // Second query: deleting orphaned retrieval collections
        query.response(0)
      } else {
        query.response(0)
      }
    })

    const result = await cleanupOldRetrievals({}, {})

    const { queries } = dbTracker.queries

    expect(queries[0].sql).toEqual('delete from "retrievals" where "updated_at" < $1')

    // Verify bindings are Date objects with the correct date (one year ago)
    const expectedDate = new Date('2023-01-15T10:00:00.000Z')

    expect(queries[0].bindings).toEqual([expectedDate])

    expect(result).toEqual({
      body: '{"message":"Cleanup complete. Deleted 5 retrieval(s) and 0 orphaned retrieval collection(s).","deletedRetrievals":5,"deletedOrphanedRetrievalCollections":0}',
      statusCode: 200
    })

    expect(consoleMock).toHaveBeenCalledTimes(3)
    expect(consoleMock).toHaveBeenNthCalledWith(1, 'Cleaning up retrievals older than 2023-01-15T10:00:00.000Z')
    expect(consoleMock).toHaveBeenNthCalledWith(2, 'Successfully deleted 5 retrieval(s) 2023-01-15T10:00:00.000Z')
    expect(consoleMock).toHaveBeenNthCalledWith(3, 'No orphaned retrievals found in exiting cleanup process')
  })

  test('correctly handles no retrievals found and logs a message', async () => {
    const deletedCount = 0
    const consoleMock = vi.spyOn(console, 'log').mockImplementation()

    dbTracker.on('query', (query, step) => {
      if (step === 1) {
        // First query: deleting old retrievals
        query.response(deletedCount)
      } else if (step === 2) {
        // Second query: deleting orphaned collections
        query.response(0)
      } else {
        query.response(0)
      }
    })

    const result = await cleanupOldRetrievals({}, {})

    const { queries } = dbTracker.queries

    expect(queries[0].sql).toEqual('delete from "retrievals" where "updated_at" < $1')

    // Verify bindings are Date objects with the correct date (one year ago)
    const expectedDate = new Date('2023-01-15T10:00:00.000Z')

    expect(queries[0].bindings).toEqual([expectedDate])

    expect(result).toEqual({
      body: '{"message":"Cleanup complete. Deleted 0 retrieval(s) and 0 orphaned retrieval collection(s).","deletedRetrievals":0,"deletedOrphanedRetrievalCollections":0}',
      statusCode: 200
    })

    expect(consoleMock).toHaveBeenCalledTimes(3)
    expect(consoleMock).toHaveBeenNthCalledWith(1, 'Cleaning up retrievals older than 2023-01-15T10:00:00.000Z')
    expect(consoleMock).toHaveBeenNthCalledWith(2, 'No retrievals older than 2023-01-15T10:00:00.000Z found exiting cleanup process')
    expect(consoleMock).toHaveBeenNthCalledWith(3, 'No orphaned retrievals found in exiting cleanup process')
  })

  test('correctly handles database errors and logs them', async () => {
    const consoleMock = vi.spyOn(console, 'log').mockImplementation()
    const dbError = new Error('Database connection failed')

    dbTracker.on('query', (query) => {
      query.reject(dbError)
    })

    const result = await cleanupOldRetrievals({}, {})

    expect(result.body).toContain('Database connection failed')
    expect(result.statusCode).toEqual(500)

    const { queries } = dbTracker.queries

    expect(queries[0].sql).toEqual('delete from "retrievals" where "updated_at" < $1')

    // Verify bindings are Date objects with the correct date (one year ago)
    const expectedDate = new Date('2023-01-15T10:00:00.000Z')

    // Even though both use the same date, Knex creates separate parameterized bindings:
    // one for the main query and one for the subquery
    expect(queries[0].bindings).toEqual([expectedDate])

    // Verify error was logged
    expect(consoleMock).toHaveBeenCalledWith(
      'Error cleaning up old retrievals:',
      dbError
    )
  })
})
