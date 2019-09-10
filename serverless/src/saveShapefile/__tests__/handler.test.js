import knex from 'knex'
import mockKnex from 'mock-knex'

import saveShapefile from '../handler'
import * as getJwtToken from '../../util/getJwtToken'
import * as getVerifiedJwtToken from '../../util/getVerifiedJwtToken'
import * as getDbConnection from '../../util/database/getDbConnection'

let dbConnectionToMock
let dbTracker

beforeEach(() => {
  jest.clearAllMocks()
  jest.spyOn(getJwtToken, 'getJwtToken').mockImplementation(() => 'mockJwt')
  jest.spyOn(getVerifiedJwtToken, 'getVerifiedJwtToken').mockImplementation(() => ({ id: 1 }))

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

describe('saveShapefile', () => {
  describe('as an unauthticated user', () => {
    test('saves the shapefile into the database', async () => {
      dbTracker.on('query', (query, step) => {
        if (step === 1) {
          query.response(undefined)
        } else {
          query.response([{
            id: 123
          }])
        }
      })

      const event = {
        body: JSON.stringify({
          params: {
            file: {},
            filename: 'test_file.geojson'
          }
        })
      }

      const result = await saveShapefile(event)

      const expectedBody = JSON.stringify({ shapefile_id: 123 })

      expect(result.body).toEqual(expectedBody)
    })

    test('returns an existing shapefile if it has already been uploaded', async () => {
      dbTracker.on('query', (query, step) => {
        if (step === 1) {
          query.response({
            id: 12
          })
        } else {
          query.response([])
        }
      })

      const event = {
        body: JSON.stringify({
          params: {
            file: {},
            filename: 'test_file.geojson'
          }
        })
      }

      const result = await saveShapefile(event)

      const expectedBody = JSON.stringify({ shapefile_id: 12 })

      expect(result.body).toEqual(expectedBody)
    })
  })

  describe('as an authticated user', () => {
    test('saves the shapefile into the database', async () => {
      dbTracker.on('query', (query, step) => {
        if (step === 1) {
          query.response(undefined)
        } else {
          query.response([{
            id: 123
          }])
        }
      })

      const event = {
        body: JSON.stringify({
          params: {
            auth_token: 'mock token',
            file: {},
            filename: 'test_file.geojson'
          }
        })
      }

      const result = await saveShapefile(event)

      const expectedBody = JSON.stringify({ shapefile_id: 123 })

      expect(result.body).toEqual(expectedBody)
    })

    test('returns an existing shapefile if it has already been uploaded', async () => {
      dbTracker.on('query', (query, step) => {
        if (step === 1) {
          query.response({
            id: 12
          })
        } else {
          query.response([])
        }
      })

      const event = {
        body: JSON.stringify({
          params: {
            auth_token: 'mock token',
            file: {},
            filename: 'test_file.geojson'
          }
        })
      }

      const result = await saveShapefile(event)

      const expectedBody = JSON.stringify({ shapefile_id: 12 })

      expect(result.body).toEqual(expectedBody)
    })
  })
})
