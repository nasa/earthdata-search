import knex from 'knex'
import mockKnex from 'mock-knex'
import * as getJwtToken from '../../util/getJwtToken'
import * as getDbConnection from '../../util/database/getDbConnection'
import * as getVerifiedJwtToken from '../../util/getVerifiedJwtToken'
import getRetrievalCollection from '../handler'

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

describe('getRetrievalCollection', () => {
  test('correctly retrieves retrievals', async () => {
    process.env.obfuscationSpin = 1000

    dbTracker.on('query', (query) => {
      query.response([{
        retrieval_id: 1,
        jsondata: {},
        created_at: '2019-08-25T11:58:14.390Z',
        environment: 'prod',
        access_method: {},
        collection_id: 'C100000-EDSC',
        collection_metadata: {
          title: 'Collection Title One'
        },
        granule_params: {},
        granule_count: 100,
        retrieval_order_id: null,
        type: null,
        order_number: null,
        order_information: null,
        state: null,
        urs_id: 'test_user'
      }])
    })

    const retrievalResponse = await getRetrievalCollection({
      pathParameters: {
        id: 1
      }
    }, {})

    const { queries } = dbTracker.queries

    expect(queries[0].method).toEqual('select')

    const { body, statusCode } = retrievalResponse

    expect(body).toEqual(JSON.stringify({
      retrieval_id: '1216634590',
      access_method: {},
      collection_id: 'C100000-EDSC',
      collection_metadata: {
        title: 'Collection Title One'
      },
      granule_params: {},
      granule_count: 100,
      orders: [],
      urs_id: 'test_user'
    }))
    expect(statusCode).toEqual(200)
  })

  test('correctly returns an error', async () => {
    dbTracker.on('query', (query) => {
      query.reject('Unknown Error')
    })

    const response = await getRetrievalCollection({
      pathParameters: {
        id: 1
      }
    }, {})

    const { queries } = dbTracker.queries

    expect(queries[0].method).toEqual('select')

    expect(response.statusCode).toEqual(500)
  })
})
