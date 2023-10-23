import knex from 'knex'
import mockKnex from 'mock-knex'
import * as getJwtToken from '../../util/getJwtToken'
import * as getDbConnection from '../../util/database/getDbConnection'
import * as getVerifiedJwtToken from '../../util/getVerifiedJwtToken'
import adminGetRetrievalsMetrics from '../handler'

let dbTracker

beforeEach(() => {
  jest.clearAllMocks()

  jest.spyOn(getJwtToken, 'getJwtToken').mockImplementation(() => 'mockJwt')
  jest.spyOn(getVerifiedJwtToken, 'getVerifiedJwtToken').mockImplementation(() => ({ id: 1 }))

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

describe('adminGetRetrievalsMetrics', () => {
  test('correctly retrieves retrievalsMetrics', async () => {
    dbTracker.on('query', (query, step) => {
      if (step === 1) {
        query.response([
          {
            access_method_type: 'ESI',
            total_times_access_method_used: '1',
            average_granule_count: '3',
            average_granule_link_count: '0',
            total_granules_retrieved: '3',
            max_granule_link_count: 0,
            min_granule_link_count: 0
          },
          {
            access_method_type: 'Harmony',
            total_times_access_method_used: '1',
            average_granule_count: '59416',
            average_granule_link_count: null,
            total_granules_retrieved: '59416',
            max_granule_link_count: null,
            min_granule_link_count: null
          },
          {
            access_method_type: 'OPeNDAP',
            total_times_access_method_used: '2',
            average_granule_count: '1',
            average_granule_link_count: null,
            total_granules_retrieved: '2',
            max_granule_link_count: null,
            min_granule_link_count: null
          },
          {
            access_method_type: 'ECHO ORDERS',
            total_times_access_method_used: '3',
            average_granule_count: '7',
            average_granule_link_count: null,
            total_granules_retrieved: '22',
            max_granule_link_count: null,
            min_granule_link_count: null
          },
          {
            access_method_type: 'download',
            total_times_access_method_used: '121',
            average_granule_count: '208',
            average_granule_link_count: '33',
            total_granules_retrieved: '25218',
            max_granule_link_count: 167,
            min_granule_link_count: 0
          }
        ])
      } else {
        query.response([
          {
            retrieval_id: 112,
            count: '2'
          },
          {
            retrieval_id: 5,
            count: '2'
          },
          {
            retrieval_id: 74,
            count: '3'
          },
          {
            retrieval_id: 110,
            count: '2'
          }
        ])
      }
    })

    const retrievalResponse = await adminGetRetrievalsMetrics({
      queryStringParameters: null
    }, {})

    const { queries } = dbTracker.queries

    // Ensure sql does not contain temporal filter for `start_date`
    expect(queries[0].method).toEqual('select')
    expect(queries[1].sql).not.toContain('created_at')

    // Ensure sql does not contain temporal filter for `end_date`
    expect(queries[1].method).toEqual('select')
    expect(queries[1].sql).not.toContain('created_at')

    const { body, statusCode } = retrievalResponse

    const responseObj = {
      results: {
        retrievalResponse: [
          {
            access_method_type: 'ESI',
            total_times_access_method_used: '1',
            average_granule_count: '3',
            average_granule_link_count: '0',
            total_granules_retrieved: '3',
            max_granule_link_count: 0,
            min_granule_link_count: 0
          },
          {
            access_method_type: 'Harmony',
            total_times_access_method_used: '1',
            average_granule_count: '59416',
            average_granule_link_count: null,
            total_granules_retrieved: '59416',
            max_granule_link_count: null,
            min_granule_link_count: null
          },
          {
            access_method_type: 'OPeNDAP',
            total_times_access_method_used: '2',
            average_granule_count: '1',
            average_granule_link_count: null,
            total_granules_retrieved: '2',
            max_granule_link_count: null,
            min_granule_link_count: null
          },
          {
            access_method_type: 'ECHO ORDERS',
            total_times_access_method_used: '3',
            average_granule_count: '7',
            average_granule_link_count: null,
            total_granules_retrieved: '22',
            max_granule_link_count: null,
            min_granule_link_count: null
          },
          {
            access_method_type: 'download',
            total_times_access_method_used: '121',
            average_granule_count: '208',
            average_granule_link_count: '33',
            total_granules_retrieved: '25218',
            max_granule_link_count: 167,
            min_granule_link_count: 0
          }
        ],
        multCollectionResponse: [
          {
            retrieval_id: 112,
            count: '2'
          },
          {
            retrieval_id: 5,
            count: '2'
          },
          {
            retrieval_id: 74,
            count: '3'
          },
          {
            retrieval_id: 110,
            count: '2'
          }
        ]
      }
    }
    expect(body).toEqual(JSON.stringify(responseObj))
    expect(statusCode).toEqual(200)
  })

  test('correctly retrieves retrievals metrics when temporal filter params are provided', async () => {
    dbTracker.on('query', (query, step) => {
      if (step === 1) {
        query.response([
          {
            access_method_type: 'ESI',
            total_times_access_method_used: '1',
            average_granule_count: '3',
            average_granule_link_count: '0',
            total_granules_retrieved: '3',
            max_granule_link_count: 0,
            min_granule_link_count: 0
          },
          {
            access_method_type: 'Harmony',
            total_times_access_method_used: '1',
            average_granule_count: '59416',
            average_granule_link_count: null,
            total_granules_retrieved: '59416',
            max_granule_link_count: null,
            min_granule_link_count: null
          },
          {
            access_method_type: 'OPeNDAP',
            total_times_access_method_used: '2',
            average_granule_count: '1',
            average_granule_link_count: null,
            total_granules_retrieved: '2',
            max_granule_link_count: null,
            min_granule_link_count: null
          },
          {
            access_method_type: 'ECHO ORDERS',
            total_times_access_method_used: '3',
            average_granule_count: '7',
            average_granule_link_count: null,
            total_granules_retrieved: '22',
            max_granule_link_count: null,
            min_granule_link_count: null
          },
          {
            access_method_type: 'download',
            total_times_access_method_used: '121',
            average_granule_count: '208',
            average_granule_link_count: '33',
            total_granules_retrieved: '25218',
            max_granule_link_count: 167,
            min_granule_link_count: 0
          }
        ])
      } else {
        query.response([
          {
            retrieval_id: 112,
            count: '2'
          },
          {
            retrieval_id: 5,
            count: '2'
          },
          {
            retrieval_id: 74,
            count: '3'
          },
          {
            retrieval_id: 110,
            count: '2'
          }
        ])
      }
    })

    const retrievalResponse = await adminGetRetrievalsMetrics({
      queryStringParameters: {
        start_date: '2020-01-29T00:00:00.000Z',
        end_date: '2023-09-27T23:59:59.999Z'
      }
    }, {})

    const { queries } = dbTracker.queries

    // Ensure first sql call contains temporal filter for `start_date` and `end_date`
    expect(queries[0].sql).toEqual('select jsonb_path_query("access_method", $1) as "access_method_type", count(*) as "total_times_access_method_used", ROUND(AVG(retrieval_collections.granule_count)) AS average_granule_count, ROUND(AVG(retrieval_collections.granule_link_count)) AS average_granule_link_count, SUM(retrieval_collections.granule_count) AS total_granules_retrieved, MAX(retrieval_collections.granule_link_count) AS max_granule_link_count, MIN(retrieval_collections.granule_link_count) AS min_granule_link_count from "retrieval_collections" where "retrieval_collections"."created_at" >= $2 and "retrieval_collections"."created_at" < $3 group by "access_method_type" order by "total_times_access_method_used" asc')
    expect(queries[0].method).toEqual('select')
    expect(queries[0].sql).toContain('created_at')
    expect(queries[0].sql).toContain('>=')
    expect(queries[0].sql).toContain('<')

    // Ensure second sql call contains temporal filter for `start_date` and `end_date`
    expect(queries[1].sql).toEqual('select "retrieval_collections"."retrieval_id" as "retrieval_id", count(*) from "retrieval_collections" inner join "retrievals" on "retrieval_collections"."retrieval_id" = "retrievals"."id" where "retrieval_collections"."created_at" >= $1 and "retrieval_collections"."created_at" < $2 group by "retrieval_id" having COUNT(*) > $3')
    expect(queries[1].method).toEqual('select')
    expect(queries[1].sql).toContain('created_at')
    expect(queries[1].sql).toContain('>=')
    expect(queries[1].sql).toContain('<')

    const { body, statusCode } = retrievalResponse

    const responseObj = {
      results: {
        retrievalResponse: [
          {
            access_method_type: 'ESI',
            total_times_access_method_used: '1',
            average_granule_count: '3',
            average_granule_link_count: '0',
            total_granules_retrieved: '3',
            max_granule_link_count: 0,
            min_granule_link_count: 0
          },
          {
            access_method_type: 'Harmony',
            total_times_access_method_used: '1',
            average_granule_count: '59416',
            average_granule_link_count: null,
            total_granules_retrieved: '59416',
            max_granule_link_count: null,
            min_granule_link_count: null
          },
          {
            access_method_type: 'OPeNDAP',
            total_times_access_method_used: '2',
            average_granule_count: '1',
            average_granule_link_count: null,
            total_granules_retrieved: '2',
            max_granule_link_count: null,
            min_granule_link_count: null
          },
          {
            access_method_type: 'ECHO ORDERS',
            total_times_access_method_used: '3',
            average_granule_count: '7',
            average_granule_link_count: null,
            total_granules_retrieved: '22',
            max_granule_link_count: null,
            min_granule_link_count: null
          },
          {
            access_method_type: 'download',
            total_times_access_method_used: '121',
            average_granule_count: '208',
            average_granule_link_count: '33',
            total_granules_retrieved: '25218',
            max_granule_link_count: 167,
            min_granule_link_count: 0
          }
        ],
        multCollectionResponse: [
          {
            retrieval_id: 112,
            count: '2'
          },
          {
            retrieval_id: 5,
            count: '2'
          },
          {
            retrieval_id: 74,
            count: '3'
          },
          {
            retrieval_id: 110,
            count: '2'
          }
        ]
      }
    }
    expect(body).toEqual(JSON.stringify(responseObj))
    expect(statusCode).toEqual(200)
  })

  test('correctly returns an error', async () => {
    dbTracker.on('query', (query) => {
      query.reject('Unknown Error')
    })

    const retrievalResponse = await adminGetRetrievalsMetrics({}, {})

    const { queries } = dbTracker.queries

    // If the first query fails exit
    expect(queries[0].method).toEqual('select')

    const { statusCode } = retrievalResponse

    expect(statusCode).toEqual(500)
  })
})
