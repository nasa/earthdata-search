import knex from 'knex'
import mockKnex from 'mock-knex'

import getSavedAccessConfigs from '../handler'
import * as getAuthorizerContext from '../../util/getAuthorizerContext'
import * as getDbConnection from '../../util/database/getDbConnection'

let dbConnectionToMock
let dbTracker

beforeEach(() => {
  vi.spyOn(getAuthorizerContext, 'getAuthorizerContext').mockImplementation(() => ({ userId: 1 }))

  vi.spyOn(getDbConnection, 'getDbConnection').mockImplementationOnce(() => {
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

describe('getSavedAccessConfigs', () => {
  test('does not return configuration if none exist', async () => {
    const consoleMock = vi.spyOn(console, 'log')

    dbTracker.on('query', (query, step) => {
      if (step === 1) {
        query.response([])
      }
    })

    const event = {
      body: JSON.stringify({
        params: {
          collectionIds: ['collectionId']
        }
      })
    }

    const result = await getSavedAccessConfigs(event, {})
    expect(consoleMock).toHaveBeenCalledTimes(0)

    expect(result).toEqual({
      body: JSON.stringify({}),
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': '*',
        'Access-Control-Allow-Credentials': true
      },
      isBase64Encoded: false,
      statusCode: 200
    })
  })

  test('returns the saved access configuration with the old `form_digest`', async () => {
    const consoleMock = vi.spyOn(console, 'log')

    dbTracker.on('query', (query, step) => {
      if (step === 1) {
        query.response([{
          collection_id: 'collectionId',
          access_method: {
            type: 'ECHO ORDERS',
            form: '<form>echo form</form>',
            option_definition: {
              id: 'option_def_guid',
              name: 'Option Definition'
            },
            model: '<mock>model</mock>',
            rawModel: '<mock>raw model</mock>',
            form_digest: '95d8b918c2634d9d27daece7bf941a33caec9bb6'
          }
        }])
      }
    })

    const event = {
      body: JSON.stringify({
        params: {
          collectionIds: ['collectionId']
        }
      })
    }

    const result = await getSavedAccessConfigs(event, {})
    expect(consoleMock).toHaveBeenCalledTimes(1)
    expect(consoleMock.mock.calls[0]).toEqual(['Found savedAccessConfigs for ECHO ORDERS collectionIds: collectionId'])

    expect(result).toEqual({
      body: JSON.stringify({
        collectionId: {
          type: 'ECHO ORDERS',
          form: '<form>echo form</form>',
          option_definition: {
            id: 'option_def_guid',
            name: 'Option Definition'
          },
          model: '<mock>model</mock>',
          rawModel: '<mock>raw model</mock>',
          form_digest: '95d8b918c2634d9d27daece7bf941a33caec9bb6',
          formDigest: '95d8b918c2634d9d27daece7bf941a33caec9bb6'
        }
      }),
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': '*',
        'Access-Control-Allow-Credentials': true
      },
      isBase64Encoded: false,
      statusCode: 200
    })
  })

  test('returns the saved access configuration with the new `formDigest`', async () => {
    const consoleMock = vi.spyOn(console, 'log')

    dbTracker.on('query', (query, step) => {
      if (step === 1) {
        query.response([{
          collection_id: 'collectionId',
          access_method: {
            type: 'ECHO ORDERS',
            form: '<form>echo form</form>',
            option_definition: {
              id: 'option_def_guid',
              name: 'Option Definition'
            },
            model: '<mock>model</mock>',
            rawModel: '<mock>raw model</mock>',
            formDigest: '95d8b918c2634d9d27daece7bf941a33caec9bb6'
          }
        }])
      }
    })

    const event = {
      body: JSON.stringify({
        params: {
          collectionIds: ['collectionId']
        }
      })
    }

    const result = await getSavedAccessConfigs(event, {})

    expect(consoleMock).toHaveBeenCalledTimes(1)
    expect(consoleMock.mock.calls[0]).toEqual(['Found savedAccessConfigs for ECHO ORDERS collectionIds: collectionId'])

    expect(result).toEqual({
      body: JSON.stringify({
        collectionId: {
          type: 'ECHO ORDERS',
          form: '<form>echo form</form>',
          option_definition: {
            id: 'option_def_guid',
            name: 'Option Definition'
          },
          model: '<mock>model</mock>',
          rawModel: '<mock>raw model</mock>',
          formDigest: '95d8b918c2634d9d27daece7bf941a33caec9bb6'
        }
      }),
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': '*',
        'Access-Control-Allow-Credentials': true
      },
      isBase64Encoded: false,
      statusCode: 200
    })
  })

  test('returns an error', async () => {
    dbTracker.on('query', (query, step) => {
      if (step === 1) {
        query.response([{
          collection_id: 'collectionId',
          access_method: {
            type: 'ECHO ORDERS',
            form: '<form>echo form</form>',
            option_definition: {
              id: 'option_def_guid',
              name: 'Option Definition'
            },
            model: '<mock>model</mock>',
            rawModel: '<mock>raw model</mock>',
            form_digest: '95d8b918c2634d9d27daece7bf941a33caec9bb6'
          }
        }])
      }
    })

    const event = {
      body: JSON.stringify({
        params: {
          collectionId: 'collectionId'
        }
      })
    }

    const result = await getSavedAccessConfigs(event, {})

    expect(result).toEqual({
      body: JSON.stringify({
        statusCode: 500,
        errors: ['Error: Undefined binding(s) detected when compiling SELECT. Undefined column(s): [collection_id] query: select "collection_id", "access_method" from "access_configurations" where "user_id" = ? and "collection_id" in ?']
      }),
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': '*',
        'Access-Control-Allow-Credentials': true
      },
      isBase64Encoded: false,
      statusCode: 500
    })
  })
})
