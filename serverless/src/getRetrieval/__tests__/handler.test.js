import knex from 'knex'
import mockKnex from 'mock-knex'
import * as getDbConnection from '../../util/database/getDbConnection'
import * as getEarthdataConfig from '../../../../sharedUtils/config'
import getRetrieval from '../handler'
import { retrievalPayload } from './mocks'

let dbTracker

beforeEach(() => {
  jest.clearAllMocks()

  jest.spyOn(getEarthdataConfig, 'getSecretEarthdataConfig').mockImplementation(() => ({ secret: 'jwt-secret' }))

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

describe('getRetrieval', () => {
  test('correctly retrieves a known colormap', async () => {
    dbTracker.on('query', (query) => {
      query.response([{
        jsondata: {},
        token: 'asdf',
        environment: 'prod'
      }])
    })

    const colorMapResponse = await getRetrieval(retrievalPayload, {})

    const { queries } = dbTracker.queries

    expect(queries[0].method).toEqual('first')

    const { body, statusCode } = colorMapResponse

    expect(body).toEqual('{"jsondata":{},"token":"asdf","environment":"prod"}')
    expect(statusCode).toEqual(200)
  })

  test('returns a 404 when no colormap is found', async () => {
    dbTracker.on('query', (query) => {
      query.response([])
    })

    const colorMapResponse = await getRetrieval(retrievalPayload, {})

    const { queries } = dbTracker.queries

    expect(queries[0].method).toEqual('first')

    const { body, statusCode } = colorMapResponse

    expect(body).toEqual('{"errors":["Retrieval \'2\' not found."]}')
    expect(statusCode).toEqual(404)
  })

  test('correctly returns an error', async () => {
    dbTracker.on('query', (query) => {
      query.reject('Unknown Error')
    })

    const colorMapResponse = await getRetrieval(retrievalPayload, {})

    const { queries } = dbTracker.queries

    expect(queries[0].method).toEqual('first')

    const { statusCode } = colorMapResponse

    expect(statusCode).toEqual(500)
  })
})
