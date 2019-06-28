import knex from 'knex'
import mockKnex from 'mock-knex'
import * as getDbConnection from '../../util/database/getDbConnection'
import * as getEarthdataConfig from '../../../../sharedUtils/config'
import submitOrder from '../handler'
import { orderPayload, badOrderPayload } from './mocks'

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

describe('submitOrder', () => {
  test('correctly inserts a user that does not exist', async () => {
    dbTracker.on('query', (query, step) => {
      if (step === 2) {
        query.response({
          id: 19
        })
      } else if (step === 3) {
        query.response([{
          id: 1,
          user_id: 19,
          environment: 'prod'
        }])
      } else {
        query.response([])
      }
    })

    const orderResponse = await submitOrder(orderPayload)

    const { queries } = dbTracker.queries

    console.warn('queries', queries)

    expect(queries[0].sql).toContain('BEGIN')
    expect(queries[1].method).toEqual('first')
    expect(queries[2].method).toEqual('insert')
    expect(queries[3].method).toEqual('insert')
    expect(queries[4].sql).toContain('COMMIT')

    const { body } = orderResponse

    expect(JSON.parse(body)).toEqual({
      environment: 'prod',
      id: 1,
      user_id: 19
    })
  })

  test('correctly rolls back the transaction on failure', async () => {
    dbTracker.on('query', (query, step) => {
      if (step === 2) {
        query.response({
          id: 19
        })
      } else if (step === 3) {
        // Force a failure to ensure ROLLBACK is working
        query.reject('INSERT failed')
      } else {
        query.response([])
      }
    })

    const orderResponse = await submitOrder(badOrderPayload)

    const { queries } = dbTracker.queries

    expect(queries[0].sql).toContain('BEGIN')
    expect(queries[1].method).toEqual('first')
    expect(queries[2].method).toEqual('insert')
    expect(queries[3].sql).toContain('ROLLBACK')

    const { statusCode } = orderResponse

    expect(statusCode).toEqual(500)
  })
})
