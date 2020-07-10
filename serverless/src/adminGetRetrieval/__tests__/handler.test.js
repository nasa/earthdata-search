import knex from 'knex'
import mockKnex from 'mock-knex'
import * as getJwtToken from '../../util/getJwtToken'
import * as getDbConnection from '../../util/database/getDbConnection'
import * as getVerifiedJwtToken from '../../util/getVerifiedJwtToken'
import adminGetRetrievals from '../handler'

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

describe('adminGetRetrievals', () => {
  test('correctly retrieves retrievals', async () => {
    dbTracker.on('query', (query) => {
      query.response([{
        id: 1,
        jsondata: {},
        user_id: 1,
        username: 'edsc-test',
        cid: 1,
        access_method: {},
        collection_id: 'C10000005-EDSC',
        granule_count: 25,
        oid: 1,
        state: 'creating',
        order_number: 100000,
        order_information: {},
        title: 'CMR Collection Title Five',
        data_center: 'EDSC'
      }, {
        id: 2,
        jsondata: {},
        user_id: 1,
        username: 'edsc-test',
        cid: 1,
        access_method: {},
        collection_id: 'C10000005-EDSC',
        granule_count: 25,
        oid: 2,
        state: 'creating',
        order_number: 100001,
        order_information: {},
        title: 'CMR Collection Title Five',
        data_center: 'EDSC'
      }, {
        id: 3,
        jsondata: {},
        user_id: 1,
        username: 'edsc-test',
        cid: 2,
        access_method: {},
        collection_id: 'C10000010-EDSC',
        granule_count: 50,
        oid: 1,
        state: 'creating',
        order_number: 500000,
        order_information: {},
        title: 'CMR Collection Title Ten',
        data_center: 'EDSC'
      }])
    })

    const retrievalResponse = await adminGetRetrievals({
      pathParameters: {
        id: 1
      }
    }, {})

    const { queries } = dbTracker.queries

    expect(queries[0].method).toEqual('select')

    const { body, statusCode } = retrievalResponse

    const responseObj = {
      id: 1,
      jsondata: {},
      obfuscated_id: '4517239960',
      user_id: 1,
      username: 'edsc-test',
      collections: [
        {
          id: 1,
          access_method: {},
          collection_id: 'C10000005-EDSC',
          granule_count: 25,
          data_center: 'EDSC',
          title: 'CMR Collection Title Five',
          orders: [
            {
              id: 1,
              state: 'creating',
              order_number: 100000,
              order_information: {}
            },
            {
              id: 2,
              state: 'creating',
              order_number: 100001,
              order_information: {}
            }
          ]
        },
        {
          id: 2,
          access_method: {},
          collection_id: 'C10000010-EDSC',
          granule_count: 50,
          data_center: 'EDSC',
          title: 'CMR Collection Title Ten',
          orders: [
            {
              id: 1,
              state: 'creating',
              order_number: 500000,
              order_information: {}
            }
          ]
        }
      ]
    }
    expect(body).toEqual(JSON.stringify(responseObj))
    expect(statusCode).toEqual(200)
  })

  test('correctly retrieves retrievals with no collections', async () => {
    dbTracker.on('query', (query) => {
      query.response([{
        id: 1,
        jsondata: {},
        user_id: 1,
        username: 'edsc-test',
        cid: null,
        access_method: {},
        collection_id: null,
        granule_count: null,
        oid: null,
        state: null,
        order_number: null,
        order_information: {},
        title: null,
        data_center: null
      }, {
        id: 2,
        jsondata: {},
        user_id: 1,
        username: 'edsc-test',
        cid: null,
        access_method: {},
        collection_id: null,
        granule_count: null,
        oid: null,
        state: null,
        order_number: null,
        order_information: {},
        title: null,
        data_center: null
      }, {
        id: 3,
        jsondata: {},
        user_id: 1,
        username: 'edsc-test',
        cid: null,
        access_method: {},
        collection_id: null,
        granule_count: null,
        oid: null,
        state: null,
        order_number: null,
        order_information: {},
        title: null,
        data_center: null
      }])
    })

    const retrievalResponse = await adminGetRetrievals({
      pathParameters: {
        id: 1
      }
    }, {})

    const { queries } = dbTracker.queries

    expect(queries[0].method).toEqual('select')

    const { body, statusCode } = retrievalResponse

    const responseObj = {
      id: 1,
      jsondata: {},
      obfuscated_id: '4517239960',
      user_id: 1,
      username: 'edsc-test',
      collections: []
    }
    expect(body).toEqual(JSON.stringify(responseObj))
    expect(statusCode).toEqual(200)
  })

  test('correctly retrieves retrievals with no orders', async () => {
    dbTracker.on('query', (query) => {
      query.response([{
        id: 1,
        jsondata: {},
        user_id: 1,
        username: 'edsc-test',
        cid: 1,
        access_method: {},
        collection_id: 'C10000005-EDSC',
        granule_count: 25,
        oid: null,
        state: null,
        order_number: null,
        order_information: {},
        title: 'CMR Collection Title Five',
        data_center: 'EDSC'
      }, {
        id: 2,
        jsondata: {},
        user_id: 1,
        username: 'edsc-test',
        cid: 1,
        access_method: {},
        collection_id: 'C10000005-EDSC',
        granule_count: 25,
        oid: null,
        state: null,
        order_number: null,
        order_information: {},
        title: 'CMR Collection Title Five',
        data_center: 'EDSC'
      }, {
        id: 3,
        jsondata: {},
        user_id: 1,
        username: 'edsc-test',
        cid: 2,
        access_method: {},
        collection_id: 'C10000010-EDSC',
        granule_count: 50,
        oid: null,
        state: null,
        order_number: null,
        order_information: {},
        title: 'CMR Collection Title Ten',
        data_center: 'EDSC'
      }])
    })

    const retrievalResponse = await adminGetRetrievals({
      pathParameters: {
        id: 1
      }
    }, {})

    const { queries } = dbTracker.queries

    expect(queries[0].method).toEqual('select')

    const { body, statusCode } = retrievalResponse

    const responseObj = {
      id: 1,
      jsondata: {},
      obfuscated_id: '4517239960',
      user_id: 1,
      username: 'edsc-test',
      collections: [
        {
          id: 1,
          access_method: {},
          collection_id: 'C10000005-EDSC',
          granule_count: 25,
          data_center: 'EDSC',
          title: 'CMR Collection Title Five',
          orders: []
        },
        {
          id: 2,
          access_method: {},
          collection_id: 'C10000010-EDSC',
          granule_count: 50,
          data_center: 'EDSC',
          title: 'CMR Collection Title Ten',
          orders: []
        }
      ]
    }
    expect(body).toEqual(JSON.stringify(responseObj))
    expect(statusCode).toEqual(200)
  })

  test('correctly returns an error', async () => {
    dbTracker.on('query', (query) => {
      query.reject('Unknown Error')
    })

    const response = await adminGetRetrievals({
      pathParameters: {
        id: 1
      }
    }, {})

    const { queries } = dbTracker.queries

    expect(queries[0].method).toEqual('select')

    expect(response.statusCode).toEqual(500)
  })
})
