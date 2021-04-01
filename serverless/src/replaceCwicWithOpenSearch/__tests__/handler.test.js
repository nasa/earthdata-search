import knex from 'knex'
import mockKnex from 'mock-knex'

import replaceCwicWithOpenSearch from '../handler'
import * as getDbConnection from '../../util/database/getDbConnection'

let dbConnectionToMock
let dbTracker

beforeEach(() => {
  jest.clearAllMocks()

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
})

describe('replaceCwicWithOpenSearch', () => {
  test('updates only records with isCwic in the metadata', async () => {
    dbTracker.on('query', (query, step) => {
      if (step === 1) {
        query.response([{
          id: 1,
          collection_id: 'C100000-EDSC',
          collection_metadata: {
            id: 'C100000-EDSC',
            isCwic: false
          }
        }, {
          id: 12,
          collection_id: 'C100111-EDSC',
          collection_metadata: {
            id: 'C100111-EDSC',
            title: 'good record'
          }
        }])
      } else {
        query.response([12])
      }
    })

    const result = await replaceCwicWithOpenSearch({}, {})

    const { queries } = dbTracker.queries
    expect(queries[0].method).toEqual('select')
    expect(queries[1].method).toEqual('update')
    expect(queries[1].bindings).toEqual([{
      id: 'C100000-EDSC',
      isOpenSearch: false
    }, 1])

    expect(result.body).toEqual(JSON.stringify({
      totalRecords: 2,
      fixedRecords: 1
    }))
  })
})
