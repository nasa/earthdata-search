import knex from 'knex'
import mockKnex from 'mock-knex'
import * as getDbConnection from '../../../util/database/getDbConnection'
import DatabaseClient from '../databaseClient'

let dbTracker

jest.mock('../../../../../sharedUtils/config', () => ({
  getApplicationConfig: jest.fn().mockImplementation(() => ({
    env: 'testenv'
  }))
}))

describe('DatabaseClient', () => {
  let databaseClient

  beforeEach(() => {
    databaseClient = new DatabaseClient()

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
    jest.clearAllMocks()
    dbTracker.uninstall()
  })

  describe('getUserById', () => {
    test('retrieves the user', async () => {
      dbTracker.on('query', (query) => {
        query.response([{
          id: 1,
          site_preferences: {},
          urs_id: 'testuser',
          urs_profile: {},
          updated_at: '2025-01-01T00:00:00.000Z',
          created_at: '2025-01-01T00:00:00.000Z',
          environment: 'prod'
        }])
      })

      const user = await databaseClient.getUserById(1)

      expect(user).toBeDefined()
      expect(user).toEqual({
        id: 1,
        site_preferences: {},
        urs_id: 'testuser',
        urs_profile: {},
        updated_at: '2025-01-01T00:00:00.000Z',
        created_at: '2025-01-01T00:00:00.000Z',
        environment: 'prod'
      })
    })

    test('returns an error', async () => {
      const consoleMock = jest.spyOn(console, 'log')

      dbTracker.on('query', (query) => {
        query.reject('Unknown Error')
      })

      await expect(databaseClient.getUserById(1)).rejects.toThrow('Failed to retrieve user by ID')

      const { queries } = dbTracker.queries

      expect(queries[0].sql).toEqual('select "users".* from "users" where "users"."id" = $1 limit $2')
      expect(queries[0].bindings).toEqual([1, 1])
      expect(queries[0].method).toEqual('first')

      expect(consoleMock).toHaveBeenCalledTimes(1)
      expect(consoleMock).toHaveBeenCalledWith('Failed to retrieve user by ID')
    })
  })

  describe('getSitePreferences', () => {
    test('retrieves the site preferences', async () => {
      dbTracker.on('query', (query) => {
        query.response([{
          site_preferences: {
            mapView: {
              baseLayer: 'trueColor',
              latitude: 90,
              longitude: 135,
              overlayLayers: [
                'bordersRoads',
                'coastlines'
              ],
              projection: 'epsg3413',
              zoom: 2
            },
            collectionListView: 'list',
            collectionSort: '-score',
            granuleListView: 'list',
            granuleSort: '-start_date',
            panelState: 'full_width'
          }
        }])
      })

      const preferences = await databaseClient.getSitePreferences()

      expect(preferences).toBeDefined()
      expect(preferences).toEqual([
        {
          site_preferences: {
            mapView: {
              baseLayer: 'trueColor',
              latitude: 90,
              longitude: 135,
              overlayLayers: [
                'bordersRoads',
                'coastlines'
              ],
              projection: 'epsg3413',
              zoom: 2
            },
            collectionListView: 'list',
            collectionSort: '-score',
            granuleListView: 'list',
            granuleSort: '-start_date',
            panelState: 'full_width'
          }
        }
      ])
    })

    test('returns an error', async () => {
      const consoleMock = jest.spyOn(console, 'log')

      dbTracker.on('query', (query) => {
        query.reject('Unknown Error')
      })

      await expect(databaseClient.getSitePreferences()).rejects.toThrow('Failed to retrieve user preferences')

      const { queries } = dbTracker.queries

      expect(queries[0].sql).toEqual('select "users"."site_preferences" from "users" where "users"."environment" = $1')
      expect(queries[0].bindings).toEqual(['testenv'])
      expect(queries[0].method).toEqual('select')

      expect(consoleMock).toHaveBeenCalledTimes(1)
      expect(consoleMock).toHaveBeenCalledWith('Failed to retrieve user preferences')
    })
  })
})
