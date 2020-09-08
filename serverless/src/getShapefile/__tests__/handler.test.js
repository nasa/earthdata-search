import knex from 'knex'
import mockKnex from 'mock-knex'

import getShapefile from '../handler'
import * as getDbConnection from '../../util/database/getDbConnection'

let dbConnectionToMock
let dbTracker

beforeEach(() => {
  jest.clearAllMocks()

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

describe('getShapefile', () => {
  test('returns the shapefile name and file', async () => {
    const shapefileId = 123
    const file = { mock: 'file' }
    const filename = 'mockFile.geojson'
    const selectedFeatures = []

    dbTracker.on('query', (query, step) => {
      if (step === 1) {
        query.response({
          file,
          filename,
          selected_features: selectedFeatures
        })
      } else {
        query.response(undefined)
      }
    })

    const event = {
      pathParameters: {
        id: shapefileId
      }
    }

    const result = await getShapefile(event, {})

    const expectedBody = JSON.stringify({
      file,
      shapefileName: filename,
      selectedFeatures
    })

    const { queries } = dbTracker.queries
    expect(queries[0].method).toEqual('first')

    expect(result.body).toEqual(expectedBody)
  })

  test('returns a 404 if the shapefile is not found', async () => {
    const shapefileId = 123

    dbTracker.on('query', (query) => {
      query.response(undefined)
    })

    const event = {
      pathParameters: {
        id: shapefileId
      }
    }

    const result = await getShapefile(event, {})

    const expectedBody = JSON.stringify({ errors: ['Shapefile \'123\' not found.'] })

    const { queries } = dbTracker.queries
    expect(queries[0].method).toEqual('first')

    expect(result.body).toEqual(expectedBody)
    expect(result.statusCode).toBe(404)
  })

  test('responds correctly on error', async () => {
    const shapefileId = 123

    dbTracker.on('query', (query) => {
      query.reject('Unknown Error')
    })

    const event = {
      pathParameters: {
        id: shapefileId
      }
    }

    const response = await getShapefile(event, {})

    expect(response.statusCode).toEqual(500)
  })
})
