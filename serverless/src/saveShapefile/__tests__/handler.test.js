import knex from 'knex'
import mockKnex from 'mock-knex'

import saveShapefile from '../handler'
import * as getAuthorizerContext from '../../util/getAuthorizerContext'
import * as getDbConnection from '../../util/database/getDbConnection'

jest.mock('../../util/authorizer/validateToken', () => ({
  validateToken: jest.fn().mockReturnValue({ username: 'testuser' })
}))

let dbConnectionToMock
let dbTracker

beforeEach(() => {
  jest.spyOn(getAuthorizerContext, 'getAuthorizerContext').mockImplementation(() => ({ userId: 1 }))

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
            file: {
              type: 'FeatureCollection',
              features: [
                {
                  type: 'Feature',
                  properties: {},
                  geometry: {
                    coordinates: [
                      -77.0163,
                      38.883
                    ],
                    type: 'Point'
                  }
                }
              ]
            },
            filename: 'test_file.geojson'
          }
        })
      }

      const result = await saveShapefile(event, {})

      const expectedBody = JSON.stringify({ shapefile_id: '2059944173' })

      expect(result.body).toEqual(expectedBody)

      const { queries } = dbTracker.queries

      expect(queries).toHaveLength(2)

      expect(queries[0].sql).toEqual('select "id" from "shapefiles" where "file_hash" = $1 limit $2')
      expect(queries[0].bindings).toEqual(['f7f2cb5d44de4d6d64578410055cf250', 1])

      expect(queries[1].sql).toEqual('insert into "shapefiles" ("file", "file_hash", "filename") values ($1, $2, $3) returning "id"')
      expect(queries[1].bindings).toEqual([
        '{"type":"FeatureCollection","features":[{"type":"Feature","properties":{},"geometry":{"coordinates":[-77.0163,38.883],"type":"Point"}}]}',
        'f7f2cb5d44de4d6d64578410055cf250',
        'test_file.geojson'
      ])
    })

    test('returns an existing shapefile if it has already been uploaded', async () => {
      dbTracker.on('query', (query, step) => {
        if (step === 1 && query.bindings[0] === 'f7f2cb5d44de4d6d64578410055cf250') {
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
            file: {
              type: 'FeatureCollection',
              features: [
                {
                  type: 'Feature',
                  properties: {},
                  geometry: {
                    coordinates: [
                      -77.0163,
                      38.883
                    ],
                    type: 'Point'
                  }
                }
              ]
            },
            filename: 'test_file.geojson'
          }
        })
      }

      const result = await saveShapefile(event, {})

      const expectedBody = JSON.stringify({ shapefile_id: '6249150326' })

      expect(result.body).toEqual(expectedBody)

      const { queries } = dbTracker.queries

      expect(queries).toHaveLength(1)

      expect(queries[0].sql).toEqual('select "id" from "shapefiles" where "file_hash" = $1 limit $2')
      expect(queries[0].bindings).toEqual(['f7f2cb5d44de4d6d64578410055cf250', 1])
    })
  })

  describe('as an authenticated user', () => {
    test('saves the shapefile into the database', async () => {
      dbTracker.on('query', (query, step) => {
        if (step === 1) {
          query.response({
            id: 1
          })
        } else if (step === 2) {
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
            earthdataEnvironment: 'prod',
            edlToken: 'mock token',
            file: {
              type: 'FeatureCollection',
              features: [
                {
                  type: 'Feature',
                  properties: {},
                  geometry: {
                    coordinates: [
                      -77.0163,
                      38.883
                    ],
                    type: 'Point'
                  }
                }
              ]
            },
            filename: 'test_file.geojson'
          }
        })
      }

      const result = await saveShapefile(event, {})

      const expectedBody = JSON.stringify({ shapefile_id: '2059944173' })

      expect(result.body).toEqual(expectedBody)

      const { queries } = dbTracker.queries

      expect(queries).toHaveLength(3)

      expect(queries[0].sql).toEqual('select * from "users" where "environment" = $1 and "urs_id" = $2 limit $3')
      expect(queries[0].bindings).toEqual(['prod', 'testuser', 1])

      expect(queries[1].sql).toEqual('select "id" from "shapefiles" where "file_hash" = $1 and "user_id" = $2 limit $3')
      expect(queries[1].bindings).toEqual(['f7f2cb5d44de4d6d64578410055cf250', 1, 1])

      expect(queries[2].sql).toEqual('insert into "shapefiles" ("file", "file_hash", "filename", "user_id") values ($1, $2, $3, $4) returning "id"')
      expect(queries[2].bindings).toEqual([
        '{"type":"FeatureCollection","features":[{"type":"Feature","properties":{},"geometry":{"coordinates":[-77.0163,38.883],"type":"Point"}}]}',
        'f7f2cb5d44de4d6d64578410055cf250',
        'test_file.geojson',
        1
      ])
    })

    test('returns an existing shapefile if it has already been uploaded', async () => {
      dbTracker.on('query', (query, step) => {
        if (step === 1) {
          query.response({
            id: 1
          })
        } else if (step === 2 && query.bindings[0] === 'f7f2cb5d44de4d6d64578410055cf250') {
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
            earthdataEnvironment: 'prod',
            edlToken: 'mock token',
            file: {
              type: 'FeatureCollection',
              features: [
                {
                  type: 'Feature',
                  properties: {},
                  geometry: {
                    coordinates: [
                      -77.0163,
                      38.883
                    ],
                    type: 'Point'
                  }
                }
              ]
            },
            filename: 'test_file.geojson'
          }
        })
      }

      const result = await saveShapefile(event, {})

      const expectedBody = JSON.stringify({ shapefile_id: '6249150326' })

      expect(result.body).toEqual(expectedBody)

      const { queries } = dbTracker.queries

      expect(queries).toHaveLength(2)

      expect(queries[0].sql).toEqual('select * from "users" where "environment" = $1 and "urs_id" = $2 limit $3')
      expect(queries[0].bindings).toEqual(['prod', 'testuser', 1])

      expect(queries[1].sql).toEqual('select "id" from "shapefiles" where "file_hash" = $1 and "user_id" = $2 limit $3')
      expect(queries[1].bindings).toEqual(['f7f2cb5d44de4d6d64578410055cf250', 1, 1])
    })
  })

  test('correctly returns an error when the select fails', async () => {
    dbTracker.on('query', (query) => {
      query.reject('Unknown Error')
    })

    const event = {
      body: JSON.stringify({
        params: {
          authToken: 'mock token',
          file: {},
          filename: 'test_file.geojson'
        }
      })
    }

    const result = await saveShapefile(event, {})

    const { queries } = dbTracker.queries

    expect(queries[0].method).toEqual('first')

    expect(result.statusCode).toEqual(500)
  })

  test('correctly returns an error when the insert fails', async () => {
    dbTracker.on('query', (query, step) => {
      if (step === 1) {
        query.response([])
      } else {
        query.reject('Unknown Error')
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

    const result = await saveShapefile(event, {})

    const { queries } = dbTracker.queries

    expect(queries[0].method).toEqual('first')
    expect(queries[1].method).toEqual('insert')

    expect(result.statusCode).toEqual(500)
  })
})
