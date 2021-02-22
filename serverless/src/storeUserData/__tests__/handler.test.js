import knex from 'knex'
import mockKnex from 'mock-knex'
import nock from 'nock'

import * as getDbConnection from '../../util/database/getDbConnection'
import * as getEarthdataConfig from '../../../../sharedUtils/config'
import * as getEdlConfig from '../../util/getEdlConfig'

import storeUserData from '../handler'

let dbTracker

beforeEach(() => {
  jest.clearAllMocks()

  jest.spyOn(getEdlConfig, 'getEdlConfig').mockImplementation(() => ({
    client: {
      id: 'clientId'
    }
  }))

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

describe('storeUserData', () => {
  test('correctly updates a user that already exists', async () => {
    jest.spyOn(getEarthdataConfig, 'getEarthdataConfig').mockImplementation(() => ({
      edlHost: 'https://edl.com',
      echoRestRoot: 'https://echorest.com'
    }))

    nock(/edl/)
      .get(/api\/users/)
      .reply(200, {
        user: {
          uid: 'urs_user',
          first_name: 'urs',
          last_name: 'user'
        }
      })

    nock(/echorest/)
      .get(/users\/current/)
      .reply(200, {
        user: {
          id: 'guid',
          first_name: 'echo',
          last_name: 'user'
        }
      })

    nock(/echorest/)
      .get(/users\/guid\/preferences/)
      .reply(200, {
        general_contact: {
          uid: 'echo_user',
          first_name: 'echo',
          last_name: 'user'
        }
      })

    dbTracker.on('query', (query, step) => {
      // Default response from queries
      query.response([])

      if (step === 1) {
        query.response([{
          access_token: 'fake.access.token'
        }])
      }
    })

    await storeUserData({
      Records: [{
        body: JSON.stringify({
          environment: 'test',
          userId: 1,
          username: 'urs_user'
        })
      }]
    }, {})

    const { queries } = dbTracker.queries

    expect(queries[0].method).toEqual('select')
    expect(queries[1].method).toEqual('update')
    expect(queries[1].bindings).toEqual([
      'test',
      'urs_user',
      { user: { uid: 'urs_user', first_name: 'urs', last_name: 'user' } },
      { id: 'guid', first_name: 'echo', last_name: 'user' },
      {
        general_contact: { uid: 'echo_user', first_name: 'echo', last_name: 'user' }
      },
      1
    ])
  })

  test('excludes echo preferences when echo profile fails', async () => {
    jest.spyOn(getEarthdataConfig, 'getEarthdataConfig').mockImplementation(() => ({
      edlHost: 'https://edl.com',
      echoRestRoot: 'https://echorest.com'
    }))

    nock(/edl/)
      .get(/api\/users/)
      .reply(200, {
        user: {
          uid: 'urs_user',
          first_name: 'urs',
          last_name: 'user'
        }
      })

    nock(/echorest/)
      .get(/users\/current/)
      .reply(404, {
        errors: ['User not found']
      })

    dbTracker.on('query', (query, step) => {
      // Default response from queries
      query.response([])

      if (step === 1) {
        query.response([{
          access_token: 'fake.access.token'
        }])
      }
    })

    await storeUserData({
      Records: [{
        body: JSON.stringify({
          environment: 'test',
          userId: 1,
          username: 'urs_user'
        })
      }]
    }, {})

    const { queries } = dbTracker.queries

    expect(queries[0].method).toEqual('select')
    expect(queries[1].method).toEqual('update')
    expect(queries[1].bindings).toEqual([
      'test',
      'urs_user',
      { user: { uid: 'urs_user', first_name: 'urs', last_name: 'user' } },
      1
    ])
  })
})
