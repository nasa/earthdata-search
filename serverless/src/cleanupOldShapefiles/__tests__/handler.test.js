import knex from 'knex'
import mockKnex from 'mock-knex'
import MockDate from 'mockdate'

import * as getDbConnection from '../../util/database/getDbConnection'
import * as parseError from '../../../../sharedUtils/parseError'

import cleanupOldShapefiles from '../handler'

let dbConnectionToMock
let dbTracker

beforeEach(() => {
  // Mock the current date to a fixed date for consistent testing
  MockDate.set('2024-01-15T10:00:00.000Z')

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
  MockDate.reset()
})

describe('cleanupOldShapefiles', () => {
  test('successfully deletes shapefiles older than one year', async () => {
    const deletedCount = 5

    dbTracker.on('query', (query) => {
      expect(query.sql).toContain('delete from "shapefiles"')
      expect(query.sql).toContain('where "created_at" < $1')
      
      // Verify the date is approximately one year ago (allowing for small time differences)
      const oneYearAgo = new Date('2023-01-15T10:00:00.000Z')
      const queryDate = new Date(query.bindings[0])
      const timeDiff = Math.abs(queryDate.getTime() - oneYearAgo.getTime())
      
      // Allow up to 1 second difference for test execution time
      expect(timeDiff).toBeLessThan(1000)
      
      query.response(deletedCount)
    })

    const result = await cleanupOldShapefiles({}, {})

    expect(result.statusCode).toEqual(200)
    
    const body = JSON.parse(result.body)
    expect(body.message).toEqual(`Successfully deleted ${deletedCount} shapefile(s)`)
    expect(body.deletedCount).toEqual(deletedCount)

    const { queries } = dbTracker.queries
    expect(queries).toHaveLength(1)
    expect(queries[0].method).toEqual('delete')
  })

  test('returns zero when no shapefiles are older than one year', async () => {
    const deletedCount = 0

    dbTracker.on('query', (query) => {
      query.response(deletedCount)
    })

    const result = await cleanupOldShapefiles({}, {})

    expect(result.statusCode).toEqual(200)
    
    const body = JSON.parse(result.body)
    expect(body.message).toEqual(`Successfully deleted ${deletedCount} shapefile(s)`)
    expect(body.deletedCount).toEqual(deletedCount)

    const { queries } = dbTracker.queries
    expect(queries).toHaveLength(1)
    expect(queries[0].method).toEqual('delete')
  })

  test('correctly handles database errors', async () => {
    const parseErrorMock = jest.spyOn(parseError, 'parseError').mockReturnValue({
      statusCode: 500,
      body: JSON.stringify({
        statusCode: 500,
        errors: ['Database connection failed']
      })
    })

    dbTracker.on('query', (query) => {
      query.reject(new Error('Database connection failed'))
    })

    const result = await cleanupOldShapefiles({}, {})

    expect(result.statusCode).toEqual(500)
    
    const body = JSON.parse(result.body)
    expect(body.error).toBeDefined()
    expect(body.error.statusCode).toEqual(500)

    const { queries } = dbTracker.queries
    expect(queries).toHaveLength(1)
    expect(queries[0].method).toEqual('delete')

    expect(parseErrorMock).toHaveBeenCalledWith(new Error('Database connection failed'))
  })

  test('correctly calculates one year ago from current date', async () => {
    // Set a specific date
    MockDate.set('2024-06-20T14:30:00.000Z')

    dbTracker.on('query', (query) => {
      const oneYearAgo = new Date('2023-06-20T14:30:00.000Z')
      const queryDate = new Date(query.bindings[0])
      const timeDiff = Math.abs(queryDate.getTime() - oneYearAgo.getTime())
      
      // Allow up to 1 second difference for test execution time
      expect(timeDiff).toBeLessThan(1000)
      
      query.response(0)
    })

    await cleanupOldShapefiles({}, {})

    const { queries } = dbTracker.queries
    expect(queries).toHaveLength(1)
  })
})

