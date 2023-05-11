import knex from 'knex'
import mockKnex from 'mock-knex'
import MockDate from 'mockdate'

import * as getDbConnection from '../../util/database/getDbConnection'

import exportSearchClean from '../handler'

const OLD_ENV = process.env

const MOCK_DATE = '2023-04-28T00:00:00.000Z'

let dbTracker

beforeEach(() => {
  jest.clearAllMocks()

  jest.spyOn(getDbConnection, 'getDbConnection').mockImplementation(() => {
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

  // Manage resetting ENV variables
  // TODO: This is causing problems with mocking knex but is noted as important for managing process.env
  // jest.resetModules()
  process.env = { ...OLD_ENV }
  delete process.env.NODE_ENV

  // MockDate is used here to overwrite the js Date object. This allows us to
  // mock changes needed to test the moment functions
  MockDate.set(MOCK_DATE)
})

afterEach(async () => {
  jest.clearAllMocks()

  // Restore any ENV variables overwritten in tests
  process.env = OLD_ENV

  // reset hacks on built-ins
  MockDate.reset()

  dbTracker.uninstall()
})

describe('exportSearchClean', () => {
  test('cleans old exports from database', async () => {
    dbTracker.on('query', (query) => {
      query.response([])
    })

    const event = {}
    const context = {}
    await exportSearchClean(event, context)

    const { queries } = dbTracker.queries

    expect(queries.length).toEqual(1)
    expect(queries[0].sql).toEqual('delete from "exports" where "created_at" <= $1')
    expect(queries[0].bindings[0]).toEqual('2023-03-29T00:00:00.000Z')
  })
})
