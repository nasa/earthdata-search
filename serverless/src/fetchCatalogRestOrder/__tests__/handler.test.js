import knex from 'knex'
import mockKnex from 'mock-knex'
import nock from 'nock'
import * as getSystemToken from '../../util/urs/getSystemToken'
import * as getDbConnection from '../../util/database/getDbConnection'
import * as getEarthdataConfig from '../../../../sharedUtils/config'
import fetchCatalogRestOrder from '../handler'

let dbTracker

beforeEach(() => {
  jest.clearAllMocks()

  jest.spyOn(getSystemToken, 'getSystemToken').mockImplementation(() => 'mocked-system-token')
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

describe('fetchCatalogRestOrder', () => {
  test('correctly retrieves a known catalog rest order currently processing', async () => {
    dbTracker.on('query', (query, step) => {
      if (step === 1) {
        query.response({
          access_method: {
            url: 'https://n5eil09e.ecs.edsc.org/egi/request'
          },
          environment: 'prod',
          order_number: '10005'
        })
      } else {
        query.response([])
      }
    })

    nock('https://n5eil09e.ecs.edsc.org')
      .get('/egi/request/10005')
      .reply(200, `
        <?xml version="1.0" encoding="UTF-8" standalone="yes"?>
        <eesi:agentResponse xsi:schemaLocation="http://eosdis.nasa.gov/esi/rsp/e https://newsroom.gsfc.nasa.gov/esi/8.1/schemas/ESIAgentResponseExternal.xsd" xmlns="" xmlns:iesi="http://eosdis.nasa.gov/esi/rsp/i" xmlns:ssw="http://newsroom.gsfc.nasa.gov/esi/rsp/ssw" xmlns:eesi="http://eosdis.nasa.gov/esi/rsp/e" xmlns:esi="http://eosdis.nasa.gov/esi/rsp" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
          <order>
            <orderId>10005</orderId>
            <Instructions>You may receive an email about your order if you specified an EMAIL address. </Instructions>
          </order>
          <contactInformation>
            <contactName>John Doe</contactName>
            <contactEmail>test@noreply.com</contactEmail>
          </contactInformation>
          <requestStatus>
            <status>processing</status>
            <numberProcessed>12</numberProcessed>
            <totalNumber>20</totalNumber>
          </requestStatus>
        </eesi:agentResponse>`)

    const catalogRestResponse = await fetchCatalogRestOrder({
      accessToken: 'fake.access.token',
      id: 1,
      orderType: 'ESI'
    })

    const { queries } = dbTracker.queries

    expect(queries[0].method).toEqual('first')
    expect(queries[1].method).toEqual('update')

    expect(catalogRestResponse).toEqual({
      accessToken: 'fake.access.token',
      id: 1,
      orderStatus: 'in_progress',
      orderType: 'ESI'
    })
  })

  test('correctly retrieves a known catalog rest order that is complete', async () => {
    dbTracker.on('query', (query, step) => {
      if (step === 1) {
        query.response({
          access_method: {
            url: 'https://n5eil09e.ecs.edsc.org/egi/request'
          },
          environment: 'prod',
          order_number: '10005'
        })
      } else {
        query.response([])
      }
    })

    nock('https://n5eil09e.ecs.edsc.org')
      .get('/egi/request/10005')
      .reply(200, `
        <?xml version="1.0" encoding="UTF-8" standalone="yes"?>
        <eesi:agentResponse xsi:schemaLocation="http://eosdis.nasa.gov/esi/rsp/e https://newsroom.gsfc.nasa.gov/esi/8.1/schemas/ESIAgentResponseExternal.xsd" xmlns="" xmlns:iesi="http://eosdis.nasa.gov/esi/rsp/i" xmlns:ssw="http://newsroom.gsfc.nasa.gov/esi/rsp/ssw" xmlns:eesi="http://eosdis.nasa.gov/esi/rsp/e" xmlns:esi="http://eosdis.nasa.gov/esi/rsp" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
          <order>
            <orderId>10005</orderId>
            <Instructions>You may receive an email about your order if you specified an EMAIL address. </Instructions>
          </order>
          <contactInformation>
            <contactName>John Doe</contactName>
            <contactEmail>test@noreply.com</contactEmail>
          </contactInformation>
          <requestStatus>
            <status>complete</status>
            <numberProcessed>20</numberProcessed>
            <totalNumber>20</totalNumber>
          </requestStatus>
        </eesi:agentResponse>`)

    const catalogRestResponse = await fetchCatalogRestOrder({
      accessToken: 'fake.access.token',
      id: 1,
      orderType: 'ESI'
    })

    const { queries } = dbTracker.queries

    expect(queries[0].method).toEqual('first')
    expect(queries[1].method).toEqual('update')

    expect(catalogRestResponse).toEqual({
      accessToken: 'fake.access.token',
      id: 1,
      orderStatus: 'complete',
      orderType: 'ESI'
    })
  })

  test('correctly retrieves a known catalog rest order that has failed', async () => {
    dbTracker.on('query', (query, step) => {
      if (step === 1) {
        query.response({
          access_method: {
            url: 'https://n5eil09e.ecs.edsc.org/egi/request'
          },
          environment: 'prod',
          order_number: '10005'
        })
      } else {
        query.response([])
      }
    })

    nock('https://n5eil09e.ecs.edsc.org')
      .get('/egi/request/10005')
      .reply(200, `
        <?xml version="1.0" encoding="UTF-8" standalone="yes"?>
        <eesi:agentResponse xsi:schemaLocation="http://eosdis.nasa.gov/esi/rsp/e https://newsroom.gsfc.nasa.gov/esi/8.1/schemas/ESIAgentResponseExternal.xsd" xmlns="" xmlns:iesi="http://eosdis.nasa.gov/esi/rsp/i" xmlns:ssw="http://newsroom.gsfc.nasa.gov/esi/rsp/ssw" xmlns:eesi="http://eosdis.nasa.gov/esi/rsp/e" xmlns:esi="http://eosdis.nasa.gov/esi/rsp" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
          <order>
            <orderId>10005</orderId>
            <Instructions>You may receive an email about your order if you specified an EMAIL address. </Instructions>
          </order>
          <contactInformation>
            <contactName>John Doe</contactName>
            <contactEmail>test@noreply.com</contactEmail>
          </contactInformation>
          <requestStatus>
            <status>failed</status>
            <numberProcessed>0</numberProcessed>
            <totalNumber>20</totalNumber>
          </requestStatus>
        </eesi:agentResponse>`)

    const catalogRestResponse = await fetchCatalogRestOrder({
      accessToken: 'fake.access.token',
      id: 1,
      orderType: 'ESI'
    })

    const { queries } = dbTracker.queries

    expect(queries[0].method).toEqual('first')
    expect(queries[1].method).toEqual('update')

    expect(catalogRestResponse).toEqual({
      accessToken: 'fake.access.token',
      id: 1,
      orderStatus: 'failed',
      orderType: 'ESI'
    })
  })

  test('correctly returns when the order cannot be found', async () => {
    dbTracker.on('query', (query, step) => {
      if (step === 1) {
        query.response(null)
      } else {
        query.response([])
      }
    })

    const catalogRestResponse = await fetchCatalogRestOrder({
      accessToken: 'fake.access.token',
      id: 1,
      orderType: 'ESI'
    })

    const { queries } = dbTracker.queries

    expect(queries[0].method).toEqual('first')

    expect(catalogRestResponse).toEqual({
      accessToken: 'fake.access.token',
      id: 1,
      orderStatus: 'not_found',
      orderType: 'ESI'
    })
  })

  test('responds correctly on code error', async () => {
    dbTracker.on('query', (query) => {
      query.reject('Unknown Error')
    })

    // Exclude an error message from the `toThrow` matcher because its
    // a specific sql statement and not necessary
    await expect(fetchCatalogRestOrder({
      accessToken: 'fake.access.token:clientId',
      id: 1,
      orderType: 'ESI'
    })).rejects.toThrow()

    const { queries } = dbTracker.queries

    expect(queries[0].method).toEqual('first')
  })

  test('responds correctly on http error', async () => {
    dbTracker.on('query', (query, step) => {
      if (step === 1) {
        query.response({
          access_method: {
            url: 'https://n5eil09e.ecs.edsc.org/egi/request'
          },
          environment: 'prod',
          order_number: '10005'
        })
      } else {
        query.response([])
      }
    })

    nock('https://n5eil09e.ecs.edsc.org')
      .get('/egi/request/10005')
      .reply(401,
        '',
        {
          'content-type': 'text/html; charset=utf-8'
        })

    await expect(fetchCatalogRestOrder({
      accessToken: 'fake.access.token:clientId',
      id: 1,
      orderType: 'ESI'
    })).rejects.toThrow('Error (401):')

    const { queries } = dbTracker.queries

    expect(queries[0].method).toEqual('first')
  })
})
