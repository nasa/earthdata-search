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
  test('successfully deletes non-parent shapefiles older than one year', async () => {
    const deletedCount = 5

    dbTracker.on('query', (query) => {
      expect(query.sql).toContain('delete from "shapefiles"')
      expect(query.sql).toContain('where "created_at" < $1')
      expect(query.sql).toContain('not exists')
      expect(query.sql).toContain('children.parent_shapefile_id = shapefiles.id')

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
    expect(queries[0].method).toEqual('del')
  })

  test('returns zero when no shapefiles are older than one year', async () => {
    const deletedCount = 0

    dbTracker.on('query', (query) => {
      expect(query.sql).toContain('not exists')
      query.response(deletedCount)
    })

    const result = await cleanupOldShapefiles({}, {})

    expect(result.statusCode).toEqual(200)

    const body = JSON.parse(result.body)
    expect(body.message).toEqual(`Successfully deleted ${deletedCount} shapefile(s)`)
    expect(body.deletedCount).toEqual(deletedCount)

    const { queries } = dbTracker.queries
    expect(queries).toHaveLength(1)
    expect(queries[0].method).toEqual('del')
  })

  test('deletes parent shapefiles when all children are older than one year', async () => {
    const deletedCount = 3

    dbTracker.on('query', (query) => {
      expect(query.sql).toContain('not exists')
      expect(query.sql).toContain('children.parent_shapefile_id = shapefiles.id')
      // Knex generates quoted column names: "children"."created_at"
      expect(query.sql).toContain('"children"."created_at"')

      // Verify the subquery checks for children created within the last year
      // The subquery date is in bindings[1], bindings[0] is for the main query
      const oneYearAgo = new Date('2023-01-15T10:00:00.000Z')
      expect(query.bindings).toHaveLength(2)
      const subqueryDate = new Date(query.bindings[1])
      const timeDiff = Math.abs(subqueryDate.getTime() - oneYearAgo.getTime())
      expect(timeDiff).toBeLessThan(1000)

      query.response(deletedCount)
    })

    const result = await cleanupOldShapefiles({}, {})

    expect(result.statusCode).toEqual(200)

    const body = JSON.parse(result.body)
    expect(body.deletedCount).toEqual(deletedCount)
  })

  test('does not delete parent shapefiles with recent children', async () => {
    const deletedCount = 0

    dbTracker.on('query', (query) => {
      expect(query.sql).toContain('not exists')
      // The subquery will find recent children, so no parent shapefiles are deleted
      query.response(deletedCount)
    })

    const result = await cleanupOldShapefiles({}, {})

    expect(result.statusCode).toEqual(200)

    const body = JSON.parse(result.body)
    expect(body.deletedCount).toEqual(0)
  })

  test('deletes mix of parent and non-parent shapefiles when conditions are met', async () => {
    const deletedCount = 10

    dbTracker.on('query', (query) => {
      expect(query.sql).toContain('not exists')
      expect(query.sql).toContain('children.parent_shapefile_id = shapefiles.id')
      query.response(deletedCount)
    })

    const result = await cleanupOldShapefiles({}, {})

    expect(result.statusCode).toEqual(200)

    const body = JSON.parse(result.body)
    expect(body.deletedCount).toEqual(deletedCount)
  })

  test('correctly handles database errors', async () => {
    dbTracker.on('query', (query) => {
      query.reject(new Error('Database connection failed'))
    })

    const result = await cleanupOldShapefiles({}, {})
    expect(result.statusCode).toEqual(500)
    expect(result.body).toContain('Database connection failed')
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

      expect(query.sql).toContain('not exists')
      query.response(0)
    })

    await cleanupOldShapefiles({}, {})

    const { queries } = dbTracker.queries
    expect(queries).toHaveLength(1)
  })

  test('includes whereNotExists subquery in SQL', async () => {
    dbTracker.on('query', (query) => {
      // Verify the query includes the not exists subquery structure
      expect(query.sql).toContain('not exists')
      expect(query.sql).toContain('select 1')
      expect(query.sql).toContain('from "shapefiles" as "children"')
      expect(query.sql).toContain('children.parent_shapefile_id = shapefiles.id')
      // Knex generates quoted column names: "children"."created_at"
      expect(query.sql).toContain('"children"."created_at"')

      query.response(0)
    })

    await cleanupOldShapefiles({}, {})

    const { queries } = dbTracker.queries
    expect(queries).toHaveLength(1)
  })
})
