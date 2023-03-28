import knex from 'knex'
import mockKnex from 'mock-knex'
import * as determineEarthdataEnvironment from '../../util/determineEarthdataEnvironment'
import * as getJwtToken from '../../util/getJwtToken'
import * as getDbConnection from '../../util/database/getDbConnection'
import * as getVerifiedJwtToken from '../../util/getVerifiedJwtToken'
import getRetrievals from '../handler'

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

describe('getRetrievals', () => {
  test('correctly retrieves retrievals', async () => {
    const determineEarthdataEnvironmentMock = jest.spyOn(determineEarthdataEnvironment, 'determineEarthdataEnvironment')

    dbTracker.on('query', (query) => {
      query.response([{
        id: 1,
        jsondata: {},
        created_at: '2019-08-25T11:58:14.390Z',
        environment: 'prod',
        collection_metadata: {
          title: 'Collection Title One',
          orbit_parameters: {},
          id: 'C1200000001-EDSC',
          has_formats: true
        }
      }, {
        id: 1,
        jsondata: {},
        created_at: '2019-08-25T11:58:14.390Z',
        environment: 'prod',
        collection_metadata: {
          title: 'Collection Title Two',
          orbit_parameters: {},
          id: 'C1200000002-EDSC',
          has_formats: false
        }
      }, {
        id: 2,
        jsondata: {},
        created_at: '2019-08-25T11:58:14.390Z',
        environment: 'prod',
        collection_metadata: {
          title: 'Collection Title Three',
          orbit_parameters: {},
          id: 'C1200000003-EDSC',
          has_formats: true
        }
      }])
    })

    const retrievalResponse = await getRetrievals({ headers: { 'Earthdata-Env': 'prod' } }, {})

    const { queries } = dbTracker.queries

    expect(queries[0].method).toEqual('select')

    const { body, statusCode } = retrievalResponse

    // Only extract titles from the collection metadata
    const responseObj = [
      {
        id: '7023641925',
        created_at: '2019-08-25T11:58:14.390Z',
        jsondata: {},
        environment: 'prod',
        collections: [
          {
            title: 'Collection Title Three'
          }
        ]
      },
      {
        id: '4517239960',
        created_at: '2019-08-25T11:58:14.390Z',
        jsondata: {},
        environment: 'prod',
        collections: [
          {
            title: 'Collection Title One'
          },
          {
            title: 'Collection Title Two'
          }
        ]
      }
    ]

    expect(body).toEqual(JSON.stringify(responseObj))
    expect(statusCode).toEqual(200)
    expect(determineEarthdataEnvironmentMock).toBeCalledTimes(1)
    expect(determineEarthdataEnvironmentMock).toBeCalledWith({ 'Earthdata-Env': 'prod' })
  })

  test('correctly returns an error', async () => {
    dbTracker.on('query', (query) => {
      query.reject('Unknown Error')
    })

    const response = await getRetrievals({}, {})

    const { queries } = dbTracker.queries

    expect(queries[0].method).toEqual('select')

    expect(response.statusCode).toEqual(500)
  })
})
