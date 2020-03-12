import knex from 'knex'
import mockKnex from 'mock-knex'
import * as getDbConnection from '../../util/database/getDbConnection'
import getColorMap from '../handler'

let dbTracker

beforeEach(() => {
  jest.clearAllMocks()

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

describe('getColorMap', () => {
  test('correctly retrieves a known colormap', async () => {
    dbTracker.on('query', (query) => {
      query.response([{
        jsondata: {}
      }])
    })

    const colorMapResponse = await getColorMap({
      pathParameters: {
        product: 'MODIS_Aqua_L3_SST_MidIR_4km_Night_Daily'
      }
    }, {})

    const { queries } = dbTracker.queries

    expect(queries[0].method).toEqual('first')

    const { body, statusCode } = colorMapResponse

    expect(body).toEqual('{}')
    expect(statusCode).toEqual(200)
  })

  test('returns a 404 when no colormap is found', async () => {
    dbTracker.on('query', (query) => {
      query.response([])
    })

    const colorMapResponse = await getColorMap({
      pathParameters: {
        product: 'MODIS_Aqua_L3_SST_MidIR_4km_Night_Daily'
      }
    }, {})

    const { queries } = dbTracker.queries

    expect(queries[0].method).toEqual('first')

    const { body, statusCode } = colorMapResponse

    expect(body).toEqual('{"errors":["ColorMap \'MODIS_Aqua_L3_SST_MidIR_4km_Night_Daily\' not found."]}')
    expect(statusCode).toEqual(404)
  })

  test('correctly returns an error', async () => {
    dbTracker.on('query', (query) => {
      query.reject('Unknown Error')
    })

    const response = await getColorMap({
      pathParameters: {
        product: 'MODIS_Aqua_L3_SST_MidIR_4km_Night_Daily'
      }
    }, {})

    const { queries } = dbTracker.queries

    expect(queries[0].method).toEqual('first')

    expect(response.statusCode).toEqual(500)
  })
})
