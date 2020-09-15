import knex from 'knex'
import mockKnex from 'mock-knex'
import nock from 'nock'
import * as getDbConnection from '../../util/database/getDbConnection'
import * as getEarthdataConfig from '../../../../sharedUtils/config'
import * as startOrderStatusUpdateWorkflow from '../../util/startOrderStatusUpdateWorkflow'
import { mockHarmonyOrder } from './mocks'
import submitHarmonyOrder from '../handler'

let dbTracker

beforeEach(() => {
  jest.clearAllMocks()

  jest.spyOn(getEarthdataConfig, 'getSecretEarthdataConfig').mockImplementation(() => ({
    clientId: 'clientId',
    secret: 'jwt-secret'
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

describe('submitHarmonyOrder', () => {
  test('correctly discovers the correct fields from the provided json', async () => {
    jest.spyOn(getEarthdataConfig, 'getEarthdataConfig').mockImplementation(() => ({
      cmrHost: 'https://cmr.earthdata.nasa.gov',
      edscHost: 'http://localhost:8080'
    }))

    const startOrderStatusUpdateWorkflowMock = jest.spyOn(startOrderStatusUpdateWorkflow, 'startOrderStatusUpdateWorkflow')
      .mockImplementation(() => (jest.fn()))

    nock(/cmr/)
      .get(/search\/granules/)
      .reply(200, {
        feed: {
          entry: [{
            id: 'G10000005-EDSC'
          }]
        }
      })

    nock('https://harmony.earthdata.nasa.gov')
      .post('/C100000-EDSC/ogc-api-coverages/1.0.0/collections/test_var,test_var_2/coverage/rangeset')
      .reply(201, {
        username: 'rabbott',
        status: 'running',
        message: 'The job is being processed',
        progress: 0,
        createdAt: '2020-07-21T15:34:37.487Z',
        updatedAt: '2020-07-21T15:34:37.487Z',
        links: [],
        request: 'https://harmony.earthdata.nasa.gov/C100000-EDSC/ogc-api-coverages/1.0.0/collections/test_var,test_var_2/coverage/rangeset',
        jobID: '3e0d745b-adcf-4d33-9810-d81f38a5bd5a'
      })

    dbTracker.on('query', (query, step) => {
      if (step === 1) {
        query.response([{
          id: '1',
          jsondata: { source: '?sf=1', shapefileId: 1 },
          collection_id: 'C100000-EDSC',
          access_method: {
            type: 'Harmony',
            selectedOutputFormat: 'NetCDF-4',
            selectedVariables: [
              'V100000-EDSC',
              'V100002-EDSC'
            ],
            variables: {
              'V100000-EDSC': {
                name: 'test_var',
                longName: 'Test Variable',
                conceptId: 'V100000-EDSC'
              },
              'V100001-EDSC': {
                name: 'test_var_1',
                longName: 'Test Variable 1',
                conceptId: 'V100001-EDSC'
              },
              'V100002-EDSC': {
                name: 'test_var_2',
                longName: 'Test Variable 2',
                conceptId: 'V100002-EDSC'
              }
            },
            url: 'https://harmony.earthdata.nasa.gov'
          },
          granule_params: {}
        }])
      } else if (step === 2) {
        query.response({
          file: 'mock shapefile'
        })
      } else {
        query.response([])
      }
    })

    const context = {}
    await submitHarmonyOrder(mockHarmonyOrder, context)

    const { queries } = dbTracker.queries

    expect(queries[0].method).toEqual('first')
    expect(queries[1].method).toEqual('first')
    expect(queries[2].method).toEqual('update')
    expect(startOrderStatusUpdateWorkflowMock).toBeCalledWith(12, 'access-token:clientId', 'Harmony')
  })

  test('stores returned error message when order creation fails', async () => {
    const consoleMock = jest.spyOn(console, 'log')

    jest.spyOn(getEarthdataConfig, 'getEarthdataConfig').mockImplementation(() => ({
      cmrHost: 'https://cmr.earthdata.nasa.gov',
      edscHost: 'http://localhost:8080'
    }))

    nock(/cmr/)
      .get(/search\/granules/)
      .reply(200, {
        feed: {
          entry: [{
            id: 'G10000005-EDSC'
          }]
        }
      })

    nock('https://harmony.earthdata.nasa.gov')
      .post('/C100000-EDSC/ogc-api-coverages/1.0.0/collections/test_var,test_var_2/coverage/rangeset')
      .reply(403, {
        code: 'harmony.ForbiddenError',
        description: 'Error: You are not authorized to access the requested resource'
      })

    dbTracker.on('query', (query, step) => {
      if (step === 1) {
        query.response([{
          id: '1',
          jsondata: { source: '?sf=1', shapefileId: 1 },
          collection_id: 'C100000-EDSC',
          access_method: {
            type: 'Harmony',
            selectedOutputFormat: 'NetCDF-4',
            selectedVariables: [
              'V100000-EDSC',
              'V100002-EDSC'
            ],
            variables: {
              'V100000-EDSC': {
                name: 'test_var',
                longName: 'Test Variable',
                conceptId: 'V100000-EDSC'
              },
              'V100001-EDSC': {
                name: 'test_var_1',
                longName: 'Test Variable 1',
                conceptId: 'V100001-EDSC'
              },
              'V100002-EDSC': {
                name: 'test_var_2',
                longName: 'Test Variable 2',
                conceptId: 'V100002-EDSC'
              }
            },
            url: 'https://harmony.earthdata.nasa.gov'
          },
          granule_params: {}
        }])
      } else if (step === 2) {
        query.response({
          file: 'mock shapefile'
        })
      } else {
        query.response([])
      }
    })

    const context = {}
    await expect(submitHarmonyOrder(
      mockHarmonyOrder, context
    )).rejects.toThrow('Error: You are not authorized to access the requested resource')

    const { queries } = dbTracker.queries

    expect(queries[0].method).toEqual('first')
    expect(queries[1].method).toEqual('first')
    expect(queries[2].method).toEqual('update')

    expect(consoleMock).toBeCalledTimes(2)
    expect(consoleMock.mock.calls[0]).toEqual(['Processing 1 order(s)'])
    expect(consoleMock.mock.calls[1]).toEqual(['Error (403): Error: You are not authorized to access the requested resource'])
  })
})
