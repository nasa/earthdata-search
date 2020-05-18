import knex from 'knex'
import mockKnex from 'mock-knex'

import updatePreferences from '../handler'
import * as getJwtToken from '../../util/getJwtToken'
import * as getVerifiedJwtToken from '../../util/getVerifiedJwtToken'
import * as getDbConnection from '../../util/database/getDbConnection'

let dbConnectionToMock
let dbTracker

beforeEach(() => {
  jest.clearAllMocks()
  jest.spyOn(getJwtToken, 'getJwtToken').mockImplementation(() => 'mockJwt')
  jest.spyOn(getVerifiedJwtToken, 'getVerifiedJwtToken').mockImplementation(() => ({ id: 1, username: 'testuser' }))

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

describe('updatePreferences', () => {
  test('updates the users table with new site_preferences', async () => {
    dbTracker.on('query', (query, step) => {
      if (step === 1) {
        query.response([{ id: 1 }])
      } else {
        query.response(undefined)
      }
    })

    const preferences = {
      panelState: 'default',
      collectionListView: 'default',
      granuleListView: 'default'
    }
    const event = {
      body: JSON.stringify({
        params: {
          preferences
        }
      })
    }

    const result = await updatePreferences(event, {})

    const expectedBody = JSON.stringify({ preferences })

    const { queries } = dbTracker.queries
    expect(queries[0].method).toEqual('update')

    expect(result.body).toEqual(expectedBody)
  })

  test('does not update if the preferences don\'t validate against the json schema', async () => {
    const preferences = { badKey: 'default' }
    const event = {
      body: JSON.stringify({
        params: {
          preferences
        }
      })
    }

    const result = await updatePreferences(event, {})

    expect(result.body).toEqual(JSON.stringify({
      statusCode: 500,
      errors: [JSON.stringify([{
        keyword: 'additionalProperties',
        dataPath: '',
        schemaPath: '#/additionalProperties',
        params: { additionalProperty: 'badKey' },
        message: 'should NOT have additional properties'
      }])]
    }))
  })

  test('correctly returns an error', async () => {
    dbTracker.on('query', (query) => {
      query.reject('Unknown Error')
    })
    const preferences = {
      panelState: 'default',
      collectionListView: 'default',
      granuleListView: 'default'
    }
    const event = {
      body: JSON.stringify({
        params: {
          preferences
        }
      })
    }

    const response = await updatePreferences(event, {})

    const { queries } = dbTracker.queries

    expect(queries[0].method).toEqual('update')

    expect(response.statusCode).toEqual(500)
  })
})
