import knex from 'knex'
import mockKnex from 'mock-knex'

import fixRetrievalCollectionMetadata from '../handler'
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

describe('fixRetrievalCollectionMetadata', () => {
  test('updates only records with incorrect data', async () => {
    dbTracker.on('query', (query, step) => {
      if (step === 1) {
        query.response([{
          id: 1,
          collection_id: 'C100000-EDSC',
          collection_metadata: {
            id: 'C100000-EDSC',
            title: 'good record'
          }
        }, {
          id: 12,
          collection_id: 'C100111-EDSC',
          collection_metadata: {
            'C100000-EDSC': {
              id: 'C100111-EDSC',
              title: 'good record'
            },
            'C100111-EDSC': {
              id: 'C100111-EDSC',
              title: 'good record'
            },
            'C100435-EDSC': {
              id: 'C100435-EDSC',
              title: 'good record'
            }
          }
        }])
      } else {
        query.response([12])
      }
    })

    const result = await fixRetrievalCollectionMetadata({}, {})

    const { queries } = dbTracker.queries
    expect(queries[0].method).toEqual('select')
    expect(queries[1].method).toEqual('update')
    expect(queries[1].bindings).toEqual([{
      id: 'C100111-EDSC',
      title: 'good record'
    }, 12])

    expect(result.body).toEqual(JSON.stringify({
      totalRecords: 2,
      fixedRecords: 1
    }))
  })
})
