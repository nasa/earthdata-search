import knex from 'knex'
import mockKnex from 'mock-knex'

import * as getEarthdataConfig from '../../../../sharedUtils/config'
import * as createLimitedShapefile from '../createLimitedShapefile'

import { processPartialShapefile } from '../processPartialShapefile'

let dbTracker

beforeEach(() => {
  jest.clearAllMocks()

  jest.spyOn(getEarthdataConfig, 'getSecretEarthdataConfig').mockImplementation(() => ({
    clientId: 'clientId',
    secret: 'jwt-secret'
  }))

  dbTracker = mockKnex.getTracker()
  dbTracker.install()
})

afterEach(() => {
  dbTracker.uninstall()
})

describe('processPartialShapefile', () => {
  describe('when no features were selected', () => {
    test('returns the original shapefile', async () => {
      const dbCon = knex({
        client: 'pg',
        debug: false
      })

      // Mock the db connection
      mockKnex.mock(dbCon)

      dbTracker.on('query', (query, step) => {
        if (step === 1) {
          query.response({
            file: 'mock shapefile',
            filename: 'MockFile.geojson'
          })
        } else {
          query.response([])
        }
      })

      const shapefile = await processPartialShapefile(dbCon, 1, 1)

      const { queries } = dbTracker.queries

      expect(queries.length).toEqual(1)

      expect(queries[0].method).toEqual('first') // shapefiles

      expect(shapefile).toEqual('mock shapefile')
    })
  })

  describe('with selected features', () => {
    describe('when existing shapefile is found in the database', () => {
      test('returns the existing records instead of inserting another', async () => {
        const createLimitedShapefileMock = jest.spyOn(createLimitedShapefile, 'createLimitedShapefile')
          .mockImplementation(() => ('limited mock shapefile'))

        const dbCon = knex({
          client: 'pg',
          debug: false
        })

        // Mock the db connection
        mockKnex.mock(dbCon)

        dbTracker.on('query', (query, step) => {
          if (step === 1) {
            query.response({
              file: 'mock shapefile',
              filename: 'MockFile.geojson'
            })
          } else if (step === 2) {
            query.response({
              file: 'limited mock shapefile',
              filename: 'Limited-ockFile.geojson'
            })
          } else {
            query.response([])
          }
        })

        const shapefile = await processPartialShapefile(dbCon, 1, 1, ['1'])

        const { queries } = dbTracker.queries

        expect(queries.length).toEqual(2)

        expect(queries[0].method).toEqual('first') // shapefiles
        expect(queries[1].method).toEqual('first') // shapefiles (limited shapefile query)

        expect(shapefile).toEqual('limited mock shapefile')

        expect(createLimitedShapefileMock).toHaveBeenCalledTimes(1)
      })
    })

    describe('when no existing shapefile found in the database', () => {
      test('stores the limited shapefile in the database', async () => {
        const createLimitedShapefileMock = jest.spyOn(createLimitedShapefile, 'createLimitedShapefile')
          .mockImplementation(() => ('limited mock shapefile'))

        const dbCon = knex({
          client: 'pg',
          debug: false
        })

        // Mock the db connection
        mockKnex.mock(dbCon)

        dbTracker.on('query', (query, step) => {
          if (step === 1) {
            query.response({
              file: 'mock shapefile',
              filename: 'MockFile.geojson'
            })
          } else {
            query.response([])
          }
        })

        const shapefile = await processPartialShapefile(dbCon, 1, 1, ['1'])

        const { queries } = dbTracker.queries

        expect(queries.length).toEqual(3)

        expect(queries[0].method).toEqual('first') // shapefiles
        expect(queries[1].method).toEqual('first') // shapefiles (limited shapefile query)
        expect(queries[2].method).toEqual('insert') // save limited shapefile
        expect(queries[2].bindings).toEqual([
          'limited mock shapefile', // new file
          '959220857ddbb3b2398ac31a58765df6', // file_hash
          'Limited-MockFile.geojson', // filename
          1084815579, // parent_shapefile_id
          '["1"]', // selectedFeatures
          1 // user_id
        ])

        expect(shapefile).toEqual('limited mock shapefile')

        expect(createLimitedShapefileMock).toHaveBeenCalledTimes(1)
      })
    })
  })
})
