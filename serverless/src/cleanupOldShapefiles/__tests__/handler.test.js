import knex from 'knex'
import mockKnex from 'mock-knex'
import MockDate from 'mockdate'

import * as getDbConnection from '../../util/database/getDbConnection'

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
  test('successfully executes the correct SQL query and returns response', async () => {
    const deletedCount = 5
    const consoleMock = jest.spyOn(console, 'log').mockImplementation()

    dbTracker.on('query', (query) => {
      query.response(deletedCount)
    })

    const result = await cleanupOldShapefiles({}, {})

    const { queries } = dbTracker.queries

    expect(queries[0].sql).toEqual('delete from "shapefiles" where "created_at" < $1 and not exists (select 1 from "shapefiles" as "children" where children.parent_shapefile_id = shapefiles.id and "children"."created_at" >= $2)')
    expect(result).toEqual({"body": "{\"message\":\"Successfully deleted 5 shapefile(s)\",\"deletedCount\":5}", "statusCode": 200})
    
    expect(consoleMock).toHaveBeenCalledTimes(2)
    expect(consoleMock).toHaveBeenNthCalledWith(1, 'Cleaning up shapefiles older than 2023-01-15T10:00:00.000Z')
    expect(consoleMock).toHaveBeenNthCalledWith(2, 'Successfully deleted 5 shapefile(s) 2023-01-15T10:00:00.000Z')
  })

  test('correctly handles database errors and logs them', async () => {
    const consoleMock = jest.spyOn(console, 'log').mockImplementation()
    const dbError = new Error('Database connection failed')

    dbTracker.on('query', (query) => {
      query.reject(dbError)
    })

    await cleanupOldShapefiles({}, {})

    const { queries } = dbTracker.queries

    expect(queries[0].sql).toEqual('delete from "shapefiles" where "created_at" < $1 and not exists (select 1 from "shapefiles" as "children" where children.parent_shapefile_id = shapefiles.id and "children"."created_at" >= $2)')

    // Verify error was logged
    expect(consoleMock).toHaveBeenCalledWith(
      'Error cleaning up old shapefiles:',
      dbError
    )
  })
})
