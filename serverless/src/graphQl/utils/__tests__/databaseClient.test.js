import knex from 'knex'
import mockKnex from 'mock-knex'
import MockDate from 'mockdate'

import * as getDbConnection from '../../../util/database/getDbConnection'
import DatabaseClient from '../databaseClient'

let dbTracker

const mockToday = '2025-10-09T12:00:00.000Z'

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

    MockDate.set(mockToday)
  })

  afterEach(() => {
    dbTracker.uninstall()

    MockDate.reset()
  })

  describe('createProject', () => {
    test('creates a new project', async () => {
      dbTracker.on('query', (query) => {
        query.response([{
          id: 1,
          name: 'Test Project',
          path: '/test/project',
          user_id: 1
        }])
      })

      const project = await databaseClient.createProject({
        name: 'Test Project',
        path: '/test/project',
        userId: 1
      })

      expect(project).toBeDefined()
      expect(project).toEqual({
        id: 1,
        name: 'Test Project',
        path: '/test/project',
        user_id: 1
      })
    })

    test('returns an error', async () => {
      const consoleMock = jest.spyOn(console, 'log')

      dbTracker.on('query', (query) => {
        query.reject('Unknown Error')
      })

      await expect(databaseClient.createProject({
        name: 'Test Project',
        path: '/test/project',
        userId: 1
      })).rejects.toThrow('Failed to create project')

      const { queries } = dbTracker.queries

      expect(queries[0].sql).toEqual('insert into "projects" ("name", "path", "user_id") values ($1, $2, $3) returning *')
      expect(queries[0].bindings).toEqual(['Test Project', '/test/project', 1])

      expect(consoleMock).toHaveBeenCalledTimes(1)
      expect(consoleMock).toHaveBeenCalledWith('Failed to create project')
    })
  })

  describe('deleteProject', () => {
    test('deletes the project', async () => {
      dbTracker.on('query', (query) => {
        query.response(1)
      })

      const result = await databaseClient.deleteProject({
        obfuscatedId: '4517239960',
        userId: 1
      })

      expect(result).toBeDefined()
      expect(result).toEqual(1)

      const { queries } = dbTracker.queries

      expect(queries[0].sql).toEqual('delete from "projects" where "user_id" = $1 and "id" = $2')
      expect(queries[0].bindings).toEqual([1, 1])
    })

    test('returns an error', async () => {
      const consoleMock = jest.spyOn(console, 'log')

      dbTracker.on('query', (query) => {
        query.reject('Unknown Error')
      })

      await expect(databaseClient.deleteProject({
        obfuscatedId: '4517239960',
        userId: 1
      })).rejects.toThrow('Failed to delete project')

      const { queries } = dbTracker.queries

      expect(queries[0].sql).toEqual('delete from "projects" where "user_id" = $1 and "id" = $2')
      expect(queries[0].bindings).toEqual([1, 1])

      expect(consoleMock).toHaveBeenCalledTimes(1)
      expect(consoleMock).toHaveBeenCalledWith('Failed to delete project')
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

      await expect(databaseClient.getSitePreferences()).rejects.toThrow('Failed to retrieve site preferences')

      const { queries } = dbTracker.queries

      expect(queries[0].sql).toEqual('select "users"."site_preferences" from "users" where "users"."environment" = $1')
      expect(queries[0].bindings).toEqual(['testenv'])

      expect(consoleMock).toHaveBeenCalledTimes(1)
      expect(consoleMock).toHaveBeenCalledWith('Failed to retrieve site preferences')
    })
  })

  describe('getProjectByObfuscatedId', () => {
    test('retrieves the project by obfuscated ID', async () => {
      dbTracker.on('query', (query) => {
        query.response({
          id: 1,
          name: 'Test Project',
          path: '/projects/test-project',
          user_id: 1,
          created_at: '2025-01-01T00:00:00.000Z',
          updated_at: '2025-01-01T00:00:00.000Z'
        })
      })

      const project = await databaseClient.getProjectByObfuscatedId('4517239960')

      expect(project).toBeDefined()
      expect(project).toEqual({
        id: 1,
        name: 'Test Project',
        path: '/projects/test-project',
        user_id: 1,
        created_at: '2025-01-01T00:00:00.000Z',
        updated_at: '2025-01-01T00:00:00.000Z'
      })

      const { queries } = dbTracker.queries

      expect(queries[0].sql).toEqual('select "projects"."id", "projects"."name", "projects"."path", "projects"."user_id", "projects"."created_at", "projects"."updated_at" from "projects" where "projects"."id" = $1 limit $2')
      expect(queries[0].bindings).toEqual([1, 1])
    })

    test('returns an error', async () => {
      const consoleMock = jest.spyOn(console, 'log')

      dbTracker.on('query', (query) => {
        query.reject('Unknown Error')
      })

      await expect(databaseClient.getProjectByObfuscatedId('4517239960')).rejects.toThrow('Failed to retrieve project by ID')

      const { queries } = dbTracker.queries

      expect(queries[0].sql).toEqual('select "projects"."id", "projects"."name", "projects"."path", "projects"."user_id", "projects"."created_at", "projects"."updated_at" from "projects" where "projects"."id" = $1 limit $2')
      expect(queries[0].bindings).toEqual([1, 1])

      expect(consoleMock).toHaveBeenCalledTimes(1)
      expect(consoleMock).toHaveBeenCalledWith('Failed to retrieve project by ID')
    })
  })

  describe('getProjects', () => {
    test('retrieves the projects', async () => {
      dbTracker.on('query', (query) => {
        query.response([{
          id: 1,
          name: 'Test Project',
          path: '/projects/test-project',
          user_id: 1,
          created_at: '2025-01-01T00:00:00.000Z',
          updated_at: '2025-01-01T00:00:00.000Z'
        }])
      })

      const project = await databaseClient.getProjects({})

      expect(project).toBeDefined()
      expect(project).toEqual([{
        id: 1,
        name: 'Test Project',
        path: '/projects/test-project',
        user_id: 1,
        created_at: '2025-01-01T00:00:00.000Z',
        updated_at: '2025-01-01T00:00:00.000Z'
      }])

      const { queries } = dbTracker.queries

      expect(queries[0].sql).toEqual('select "projects"."id", "projects"."name", "projects"."path", "projects"."created_at", "projects"."updated_at", "users"."id" as "user_id", "users"."urs_id" as "urs_id", count(*) OVER() as total from "projects" inner join "users" on "projects"."user_id" = "users"."id" order by "projects"."id" desc limit $1')
      expect(queries[0].bindings).toEqual([20])
    })

    test('returns an error', async () => {
      const consoleMock = jest.spyOn(console, 'log')

      dbTracker.on('query', (query) => {
        query.reject('Unknown Error')
      })

      await expect(databaseClient.getProjects({})).rejects.toThrow('Failed to retrieve user projects')

      const { queries } = dbTracker.queries

      expect(queries[0].sql).toEqual('select "projects"."id", "projects"."name", "projects"."path", "projects"."created_at", "projects"."updated_at", "users"."id" as "user_id", "users"."urs_id" as "urs_id", count(*) OVER() as total from "projects" inner join "users" on "projects"."user_id" = "users"."id" order by "projects"."id" desc limit $1')
      expect(queries[0].bindings).toEqual([20])

      expect(consoleMock).toHaveBeenCalledTimes(1)
      expect(consoleMock).toHaveBeenCalledWith('Failed to retrieve user projects')
    })

    describe('when searching with a sortKey', () => {
      test('retrieves the projects', async () => {
        dbTracker.on('query', (query) => {
          query.response([{
            id: 1,
            name: 'Test Project',
            path: '/projects/test-project',
            user_id: 1,
            created_at: '2025-01-01T00:00:00.000Z',
            updated_at: '2025-01-01T00:00:00.000Z'
          }])
        })

        const project = await databaseClient.getProjects({
          sortKey: 'created_at'
        })

        expect(project).toBeDefined()
        expect(project).toEqual([{
          id: 1,
          name: 'Test Project',
          path: '/projects/test-project',
          user_id: 1,
          created_at: '2025-01-01T00:00:00.000Z',
          updated_at: '2025-01-01T00:00:00.000Z'
        }])

        const { queries } = dbTracker.queries

        expect(queries[0].sql).toEqual('select "projects"."id", "projects"."name", "projects"."path", "projects"."created_at", "projects"."updated_at", "users"."id" as "user_id", "users"."urs_id" as "urs_id", count(*) OVER() as total from "projects" inner join "users" on "projects"."user_id" = "users"."id" order by "projects"."created_at" asc limit $1')
        expect(queries[0].bindings).toEqual([20])
      })
    })

    describe('when searching with a ursId', () => {
      test('retrieves the projects', async () => {
        dbTracker.on('query', (query) => {
          query.response([{
            id: 1,
            name: 'Test Project',
            path: '/projects/test-project',
            user_id: 1,
            created_at: '2025-01-01T00:00:00.000Z',
            updated_at: '2025-01-01T00:00:00.000Z'
          }])
        })

        const project = await databaseClient.getProjects({
          ursId: 1
        })

        expect(project).toBeDefined()
        expect(project).toEqual([{
          id: 1,
          name: 'Test Project',
          path: '/projects/test-project',
          user_id: 1,
          created_at: '2025-01-01T00:00:00.000Z',
          updated_at: '2025-01-01T00:00:00.000Z'
        }])

        const { queries } = dbTracker.queries

        expect(queries[0].sql).toEqual('select "projects"."id", "projects"."name", "projects"."path", "projects"."created_at", "projects"."updated_at", "users"."id" as "user_id", "users"."urs_id" as "urs_id", count(*) OVER() as total from "projects" inner join "users" on "projects"."user_id" = "users"."id" where "users"."urs_id" = $1 order by "projects"."id" desc limit $2')
        expect(queries[0].bindings).toEqual([1, 20])
      })
    })

    describe('when searching with a userId', () => {
      test('retrieves the projects', async () => {
        dbTracker.on('query', (query) => {
          query.response([{
            id: 1,
            name: 'Test Project',
            path: '/projects/test-project',
            user_id: 1,
            created_at: '2025-01-01T00:00:00.000Z',
            updated_at: '2025-01-01T00:00:00.000Z'
          }])
        })

        const project = await databaseClient.getProjects({
          userId: 42
        })

        expect(project).toBeDefined()
        expect(project).toEqual([{
          id: 1,
          name: 'Test Project',
          path: '/projects/test-project',
          user_id: 1,
          created_at: '2025-01-01T00:00:00.000Z',
          updated_at: '2025-01-01T00:00:00.000Z'
        }])

        const { queries } = dbTracker.queries

        expect(queries[0].sql).toEqual('select "projects"."id", "projects"."name", "projects"."path", "projects"."created_at", "projects"."updated_at", "users"."id" as "user_id", "users"."urs_id" as "urs_id", count(*) OVER() as total from "projects" inner join "users" on "projects"."user_id" = "users"."id" where "users"."id" = $1 order by "projects"."id" desc limit $2')
        expect(queries[0].bindings).toEqual([42, 20])
      })
    })

    describe('when searching with an obfuscatedId', () => {
      test('retrieves the projects', async () => {
        dbTracker.on('query', (query) => {
          query.response([{
            id: 1,
            name: 'Test Project',
            path: '/projects/test-project',
            user_id: 1,
            created_at: '2025-01-01T00:00:00.000Z',
            updated_at: '2025-01-01T00:00:00.000Z'
          }])
        })

        const project = await databaseClient.getProjects({
          obfuscatedId: '4517239960'
        })

        expect(project).toBeDefined()
        expect(project).toEqual([{
          id: 1,
          name: 'Test Project',
          path: '/projects/test-project',
          user_id: 1,
          created_at: '2025-01-01T00:00:00.000Z',
          updated_at: '2025-01-01T00:00:00.000Z'
        }])

        const { queries } = dbTracker.queries

        expect(queries[0].sql).toEqual('select "projects"."id", "projects"."name", "projects"."path", "projects"."created_at", "projects"."updated_at", "users"."id" as "user_id", "users"."urs_id" as "urs_id", count(*) OVER() as total from "projects" inner join "users" on "projects"."user_id" = "users"."id" where "projects"."id" = $1 order by "projects"."id" desc limit $2')
        expect(queries[0].bindings).toEqual([1, 20])
      })
    })
  })

  describe('getRetrievals', () => {
    test('retrieves the retrievals', async () => {
      dbTracker.on('query', (query) => {
        query.response([
          {
            id: 1,
            user_id: 1,
            jsondata: {
              source: '?p=C1595422627-ASF!C1595422627-ASF&pg[1][a]=2700576794!2700634599!2700578014!2700575283!ASF&pg[1][v]=t&pg[1][gsk]=-start_date&pg[1][m]=harmony0&pg[1][ets]=t&q=C1595422627-ASF&polygon[0]=47.67188%2C31.48374%2C43.45313%2C31.06194%2C44.71875%2C25.29727%2C49.78125%2C26.42209%2C47.67188%2C31.48374&tl=1687897235.3!3!!&lat=-0.0703125&long=0.140625',
              portalId: 'edsc',
              shapefileId: ''
            },
            token: 'token',
            environment: 'prod',
            updated_at: '2023-06-27T20:22:47.400Z',
            created_at: '2023-06-27T20:22:47.400Z'
          },
          {
            id: 2,
            user_id: 1,
            jsondata: {
              source: '?p=C1595422627-ASF!C1595422627-ASF&pg[1][a]=2700576794!2700634599!2700578014!2700575283!ASF&pg[1][v]=t&pg[1][gsk]=-start_date&pg[1][m]=harmony0&pg[1][ets]=t&q=C1595422627-ASF&polygon[0]=47.67188%2C31.48374%2C43.45313%2C31.06194%2C44.71875%2C25.29727%2C49.78125%2C26.42209%2C47.67188%2C31.48374&tl=1687897235.3!3!!&lat=-0.0703125&long=0.140625',
              portalId: 'edsc',
              shapefileId: ''
            },
            token: 'token',
            environment: 'prod',
            updated_at: '2023-06-27T20:22:47.400Z',
            created_at: '2023-06-27T20:22:47.400Z'
          }
        ])
      })

      const retrievals = await databaseClient.getRetrievals({})

      expect(retrievals).toBeDefined()
      expect(retrievals).toEqual([
        {
          id: 1,
          user_id: 1,
          jsondata: {
            source: '?p=C1595422627-ASF!C1595422627-ASF&pg[1][a]=2700576794!2700634599!2700578014!2700575283!ASF&pg[1][v]=t&pg[1][gsk]=-start_date&pg[1][m]=harmony0&pg[1][ets]=t&q=C1595422627-ASF&polygon[0]=47.67188%2C31.48374%2C43.45313%2C31.06194%2C44.71875%2C25.29727%2C49.78125%2C26.42209%2C47.67188%2C31.48374&tl=1687897235.3!3!!&lat=-0.0703125&long=0.140625',
            portalId: 'edsc',
            shapefileId: ''
          },
          token: 'token',
          environment: 'prod',
          updated_at: '2023-06-27T20:22:47.400Z',
          created_at: '2023-06-27T20:22:47.400Z'
        },
        {
          id: 2,
          user_id: 1,
          jsondata: {
            source: '?p=C1595422627-ASF!C1595422627-ASF&pg[1][a]=2700576794!2700634599!2700578014!2700575283!ASF&pg[1][v]=t&pg[1][gsk]=-start_date&pg[1][m]=harmony0&pg[1][ets]=t&q=C1595422627-ASF&polygon[0]=47.67188%2C31.48374%2C43.45313%2C31.06194%2C44.71875%2C25.29727%2C49.78125%2C26.42209%2C47.67188%2C31.48374&tl=1687897235.3!3!!&lat=-0.0703125&long=0.140625',
            portalId: 'edsc',
            shapefileId: ''
          },
          token: 'token',
          environment: 'prod',
          updated_at: '2023-06-27T20:22:47.400Z',
          created_at: '2023-06-27T20:22:47.400Z'
        }
      ])

      const { queries } = dbTracker.queries

      expect(queries[0].sql).toEqual('select "retrievals"."id", "retrievals"."user_id", "retrievals"."jsondata", "retrievals"."environment", "retrievals"."created_at", "retrievals"."updated_at", "users"."id" as "user_id", "users"."urs_id" as "urs_id", count(*) OVER() as total from "retrievals" inner join "users" on "retrievals"."user_id" = "users"."id" order by "id" desc')
      expect(queries[0].bindings).toEqual([])
    })

    test('returns an error', async () => {
      const consoleMock = jest.spyOn(console, 'log')

      dbTracker.on('query', (query) => {
        query.reject('Unknown Error')
      })

      await expect(databaseClient.getRetrievals({})).rejects.toThrow('Failed to retrieve user retrievals')

      const { queries } = dbTracker.queries

      expect(queries[0].sql).toEqual('select "retrievals"."id", "retrievals"."user_id", "retrievals"."jsondata", "retrievals"."environment", "retrievals"."created_at", "retrievals"."updated_at", "users"."id" as "user_id", "users"."urs_id" as "urs_id", count(*) OVER() as total from "retrievals" inner join "users" on "retrievals"."user_id" = "users"."id" order by "id" desc')
      expect(queries[0].bindings).toEqual([])

      expect(consoleMock).toHaveBeenCalledTimes(1)
      expect(consoleMock).toHaveBeenCalledWith('Failed to retrieve user retrievals')
    })

    describe('when searching with a sortKey', () => {
      test('retrieves the retrievals', async () => {
        dbTracker.on('query', (query) => {
          query.response([
            {
              id: 1,
              user_id: 1,
              jsondata: {
                source: '?p=C1595422627-ASF!C1595422627-ASF&pg[1][a]=2700576794!2700634599!2700578014!2700575283!ASF&pg[1][v]=t&pg[1][gsk]=-start_date&pg[1][m]=harmony0&pg[1][ets]=t&q=C1595422627-ASF&polygon[0]=47.67188%2C31.48374%2C43.45313%2C31.06194%2C44.71875%2C25.29727%2C49.78125%2C26.42209%2C47.67188%2C31.48374&tl=1687897235.3!3!!&lat=-0.0703125&long=0.140625',
                portalId: 'edsc',
                shapefileId: ''
              },
              token: 'token',
              environment: 'prod',
              updated_at: '2023-06-27T20:22:47.400Z',
              created_at: '2023-06-27T20:22:47.400Z'
            },
            {
              id: 2,
              user_id: 1,
              jsondata: {
                source: '?p=C1595422627-ASF!C1595422627-ASF&pg[1][a]=2700576794!2700634599!2700578014!2700575283!ASF&pg[1][v]=t&pg[1][gsk]=-start_date&pg[1][m]=harmony0&pg[1][ets]=t&q=C1595422627-ASF&polygon[0]=47.67188%2C31.48374%2C43.45313%2C31.06194%2C44.71875%2C25.29727%2C49.78125%2C26.42209%2C47.67188%2C31.48374&tl=1687897235.3!3!!&lat=-0.0703125&long=0.140625',
                portalId: 'edsc',
                shapefileId: ''
              },
              token: 'token',
              environment: 'prod',
              updated_at: '2023-06-27T20:22:47.400Z',
              created_at: '2023-06-27T20:22:47.400Z'
            }
          ])
        })

        const retrievals = await databaseClient.getRetrievals({
          sortKey: 'created_at'
        })

        expect(retrievals).toBeDefined()
        expect(retrievals).toEqual([
          {
            id: 1,
            user_id: 1,
            jsondata: {
              source: '?p=C1595422627-ASF!C1595422627-ASF&pg[1][a]=2700576794!2700634599!2700578014!2700575283!ASF&pg[1][v]=t&pg[1][gsk]=-start_date&pg[1][m]=harmony0&pg[1][ets]=t&q=C1595422627-ASF&polygon[0]=47.67188%2C31.48374%2C43.45313%2C31.06194%2C44.71875%2C25.29727%2C49.78125%2C26.42209%2C47.67188%2C31.48374&tl=1687897235.3!3!!&lat=-0.0703125&long=0.140625',
              portalId: 'edsc',
              shapefileId: ''
            },
            token: 'token',
            environment: 'prod',
            updated_at: '2023-06-27T20:22:47.400Z',
            created_at: '2023-06-27T20:22:47.400Z'
          },
          {
            id: 2,
            user_id: 1,
            jsondata: {
              source: '?p=C1595422627-ASF!C1595422627-ASF&pg[1][a]=2700576794!2700634599!2700578014!2700575283!ASF&pg[1][v]=t&pg[1][gsk]=-start_date&pg[1][m]=harmony0&pg[1][ets]=t&q=C1595422627-ASF&polygon[0]=47.67188%2C31.48374%2C43.45313%2C31.06194%2C44.71875%2C25.29727%2C49.78125%2C26.42209%2C47.67188%2C31.48374&tl=1687897235.3!3!!&lat=-0.0703125&long=0.140625',
              portalId: 'edsc',
              shapefileId: ''
            },
            token: 'token',
            environment: 'prod',
            updated_at: '2023-06-27T20:22:47.400Z',
            created_at: '2023-06-27T20:22:47.400Z'
          }
        ])

        const { queries } = dbTracker.queries

        expect(queries[0].sql).toEqual('select "retrievals"."id", "retrievals"."user_id", "retrievals"."jsondata", "retrievals"."environment", "retrievals"."created_at", "retrievals"."updated_at", "users"."id" as "user_id", "users"."urs_id" as "urs_id", count(*) OVER() as total from "retrievals" inner join "users" on "retrievals"."user_id" = "users"."id" order by "retrievals"."created_at" asc')
        expect(queries[0].bindings).toEqual([])
      })
    })

    describe('when searching with a ursId', () => {
      test('retrieves the retrievals', async () => {
        dbTracker.on('query', (query) => {
          query.response([
            {
              id: 1,
              user_id: 1,
              jsondata: {
                source: '?p=C1595422627-ASF!C1595422627-ASF&pg[1][a]=2700576794!2700634599!2700578014!2700575283!ASF&pg[1][v]=t&pg[1][gsk]=-start_date&pg[1][m]=harmony0&pg[1][ets]=t&q=C1595422627-ASF&polygon[0]=47.67188%2C31.48374%2C43.45313%2C31.06194%2C44.71875%2C25.29727%2C49.78125%2C26.42209%2C47.67188%2C31.48374&tl=1687897235.3!3!!&lat=-0.0703125&long=0.140625',
                portalId: 'edsc',
                shapefileId: ''
              },
              token: 'token',
              environment: 'prod',
              updated_at: '2023-06-27T20:22:47.400Z',
              created_at: '2023-06-27T20:22:47.400Z'
            },
            {
              id: 2,
              user_id: 1,
              jsondata: {
                source: '?p=C1595422627-ASF!C1595422627-ASF&pg[1][a]=2700576794!2700634599!2700578014!2700575283!ASF&pg[1][v]=t&pg[1][gsk]=-start_date&pg[1][m]=harmony0&pg[1][ets]=t&q=C1595422627-ASF&polygon[0]=47.67188%2C31.48374%2C43.45313%2C31.06194%2C44.71875%2C25.29727%2C49.78125%2C26.42209%2C47.67188%2C31.48374&tl=1687897235.3!3!!&lat=-0.0703125&long=0.140625',
                portalId: 'edsc',
                shapefileId: ''
              },
              token: 'token',
              environment: 'prod',
              updated_at: '2023-06-27T20:22:47.400Z',
              created_at: '2023-06-27T20:22:47.400Z'
            }
          ])
        })

        const retrievals = await databaseClient.getRetrievals({
          ursId: 'testuser'
        })

        expect(retrievals).toBeDefined()
        expect(retrievals).toEqual([
          {
            id: 1,
            user_id: 1,
            jsondata: {
              source: '?p=C1595422627-ASF!C1595422627-ASF&pg[1][a]=2700576794!2700634599!2700578014!2700575283!ASF&pg[1][v]=t&pg[1][gsk]=-start_date&pg[1][m]=harmony0&pg[1][ets]=t&q=C1595422627-ASF&polygon[0]=47.67188%2C31.48374%2C43.45313%2C31.06194%2C44.71875%2C25.29727%2C49.78125%2C26.42209%2C47.67188%2C31.48374&tl=1687897235.3!3!!&lat=-0.0703125&long=0.140625',
              portalId: 'edsc',
              shapefileId: ''
            },
            token: 'token',
            environment: 'prod',
            updated_at: '2023-06-27T20:22:47.400Z',
            created_at: '2023-06-27T20:22:47.400Z'
          },
          {
            id: 2,
            user_id: 1,
            jsondata: {
              source: '?p=C1595422627-ASF!C1595422627-ASF&pg[1][a]=2700576794!2700634599!2700578014!2700575283!ASF&pg[1][v]=t&pg[1][gsk]=-start_date&pg[1][m]=harmony0&pg[1][ets]=t&q=C1595422627-ASF&polygon[0]=47.67188%2C31.48374%2C43.45313%2C31.06194%2C44.71875%2C25.29727%2C49.78125%2C26.42209%2C47.67188%2C31.48374&tl=1687897235.3!3!!&lat=-0.0703125&long=0.140625',
              portalId: 'edsc',
              shapefileId: ''
            },
            token: 'token',
            environment: 'prod',
            updated_at: '2023-06-27T20:22:47.400Z',
            created_at: '2023-06-27T20:22:47.400Z'
          }
        ])

        const { queries } = dbTracker.queries

        expect(queries[0].sql).toEqual('select "retrievals"."id", "retrievals"."user_id", "retrievals"."jsondata", "retrievals"."environment", "retrievals"."created_at", "retrievals"."updated_at", "users"."id" as "user_id", "users"."urs_id" as "urs_id", count(*) OVER() as total from "retrievals" inner join "users" on "retrievals"."user_id" = "users"."id" where "users"."urs_id" = $1 order by "id" desc')
        expect(queries[0].bindings).toEqual(['testuser'])
      })
    })

    describe('when searching with a retrievalCollectionId', () => {
      test('retrieves the retrievals', async () => {
        dbTracker.on('query', (query) => {
          query.response([
            {
              id: 1,
              user_id: 1,
              jsondata: {
                source: '?p=C1595422627-ASF!C1595422627-ASF&pg[1][a]=2700576794!2700634599!2700578014!2700575283!ASF&pg[1][v]=t&pg[1][gsk]=-start_date&pg[1][m]=harmony0&pg[1][ets]=t&q=C1595422627-ASF&polygon[0]=47.67188%2C31.48374%2C43.45313%2C31.06194%2C44.71875%2C25.29727%2C49.78125%2C26.42209%2C47.67188%2C31.48374&tl=1687897235.3!3!!&lat=-0.0703125&long=0.140625',
                portalId: 'edsc',
                shapefileId: ''
              },
              token: 'token',
              environment: 'prod',
              updated_at: '2023-06-27T20:22:47.400Z',
              created_at: '2023-06-27T20:22:47.400Z'
            },
            {
              id: 2,
              user_id: 1,
              jsondata: {
                source: '?p=C1595422627-ASF!C1595422627-ASF&pg[1][a]=2700576794!2700634599!2700578014!2700575283!ASF&pg[1][v]=t&pg[1][gsk]=-start_date&pg[1][m]=harmony0&pg[1][ets]=t&q=C1595422627-ASF&polygon[0]=47.67188%2C31.48374%2C43.45313%2C31.06194%2C44.71875%2C25.29727%2C49.78125%2C26.42209%2C47.67188%2C31.48374&tl=1687897235.3!3!!&lat=-0.0703125&long=0.140625',
                portalId: 'edsc',
                shapefileId: ''
              },
              token: 'token',
              environment: 'prod',
              updated_at: '2023-06-27T20:22:47.400Z',
              created_at: '2023-06-27T20:22:47.400Z'
            }
          ])
        })

        const retrievals = await databaseClient.getRetrievals({
          retrievalCollectionId: 1
        })

        expect(retrievals).toBeDefined()
        expect(retrievals).toEqual([
          {
            id: 1,
            user_id: 1,
            jsondata: {
              source: '?p=C1595422627-ASF!C1595422627-ASF&pg[1][a]=2700576794!2700634599!2700578014!2700575283!ASF&pg[1][v]=t&pg[1][gsk]=-start_date&pg[1][m]=harmony0&pg[1][ets]=t&q=C1595422627-ASF&polygon[0]=47.67188%2C31.48374%2C43.45313%2C31.06194%2C44.71875%2C25.29727%2C49.78125%2C26.42209%2C47.67188%2C31.48374&tl=1687897235.3!3!!&lat=-0.0703125&long=0.140625',
              portalId: 'edsc',
              shapefileId: ''
            },
            token: 'token',
            environment: 'prod',
            updated_at: '2023-06-27T20:22:47.400Z',
            created_at: '2023-06-27T20:22:47.400Z'
          },
          {
            id: 2,
            user_id: 1,
            jsondata: {
              source: '?p=C1595422627-ASF!C1595422627-ASF&pg[1][a]=2700576794!2700634599!2700578014!2700575283!ASF&pg[1][v]=t&pg[1][gsk]=-start_date&pg[1][m]=harmony0&pg[1][ets]=t&q=C1595422627-ASF&polygon[0]=47.67188%2C31.48374%2C43.45313%2C31.06194%2C44.71875%2C25.29727%2C49.78125%2C26.42209%2C47.67188%2C31.48374&tl=1687897235.3!3!!&lat=-0.0703125&long=0.140625',
              portalId: 'edsc',
              shapefileId: ''
            },
            token: 'token',
            environment: 'prod',
            updated_at: '2023-06-27T20:22:47.400Z',
            created_at: '2023-06-27T20:22:47.400Z'
          }
        ])

        const { queries } = dbTracker.queries

        expect(queries[0].sql).toEqual('select "retrievals"."id", "retrievals"."user_id", "retrievals"."jsondata", "retrievals"."environment", "retrievals"."created_at", "retrievals"."updated_at", "users"."id" as "user_id", "users"."urs_id" as "urs_id", count(*) OVER() as total from "retrievals" inner join "users" on "retrievals"."user_id" = "users"."id" left join "retrieval_collections" on "retrievals"."id" = "retrieval_collections"."retrieval_id" where "retrieval_collections"."id" = $1 order by "id" desc')
        expect(queries[0].bindings).toEqual([1])
      })
    })

    describe('when searching with a obfuscatedId', () => {
      test('retrieves the retrievals', async () => {
        dbTracker.on('query', (query) => {
          query.response([
            {
              id: 1,
              user_id: 1,
              jsondata: {
                source: '?p=C1595422627-ASF!C1595422627-ASF&pg[1][a]=2700576794!2700634599!2700578014!2700575283!ASF&pg[1][v]=t&pg[1][gsk]=-start_date&pg[1][m]=harmony0&pg[1][ets]=t&q=C1595422627-ASF&polygon[0]=47.67188%2C31.48374%2C43.45313%2C31.06194%2C44.71875%2C25.29727%2C49.78125%2C26.42209%2C47.67188%2C31.48374&tl=1687897235.3!3!!&lat=-0.0703125&long=0.140625',
                portalId: 'edsc',
                shapefileId: ''
              },
              token: 'token',
              environment: 'prod',
              updated_at: '2023-06-27T20:22:47.400Z',
              created_at: '2023-06-27T20:22:47.400Z'
            }
          ])
        })

        const retrievals = await databaseClient.getRetrievals({
          obfuscatedId: '4517239960'
        })

        expect(retrievals).toBeDefined()
        expect(retrievals).toEqual([
          {
            id: 1,
            user_id: 1,
            jsondata: {
              source: '?p=C1595422627-ASF!C1595422627-ASF&pg[1][a]=2700576794!2700634599!2700578014!2700575283!ASF&pg[1][v]=t&pg[1][gsk]=-start_date&pg[1][m]=harmony0&pg[1][ets]=t&q=C1595422627-ASF&polygon[0]=47.67188%2C31.48374%2C43.45313%2C31.06194%2C44.71875%2C25.29727%2C49.78125%2C26.42209%2C47.67188%2C31.48374&tl=1687897235.3!3!!&lat=-0.0703125&long=0.140625',
              portalId: 'edsc',
              shapefileId: ''
            },
            token: 'token',
            environment: 'prod',
            updated_at: '2023-06-27T20:22:47.400Z',
            created_at: '2023-06-27T20:22:47.400Z'
          }
        ])

        const { queries } = dbTracker.queries

        expect(queries[0].sql).toEqual('select "retrievals"."id", "retrievals"."user_id", "retrievals"."jsondata", "retrievals"."environment", "retrievals"."created_at", "retrievals"."updated_at", "users"."id" as "user_id", "users"."urs_id" as "urs_id", count(*) OVER() as total from "retrievals" inner join "users" on "retrievals"."user_id" = "users"."id" where "retrievals"."id" = $1 order by "id" desc')
        expect(queries[0].bindings).toEqual([1])
      })
    })

    describe('when searching with a limit and offset', () => {
      test('retrieves the retrievals', async () => {
        dbTracker.on('query', (query) => {
          query.response([
            {
              id: 3,
              user_id: 1,
              jsondata: {
                source: '?p=C1595422627-ASF!C1595422627-ASF&pg[1][a]=2700576794!2700634599!2700578014!2700575283!ASF&pg[1][v]=t&pg[1][gsk]=-start_date&pg[1][m]=harmony0&pg[1][ets]=t&q=C1595422627-ASF&polygon[0]=47.67188%2C31.48374%2C43.45313%2C31.06194%2C44.71875%2C25.29727%2C49.78125%2C26.42209%2C47.67188%2C31.48374&tl=1687897235.3!3!!&lat=-0.0703125&long=0.140625',
                portalId: 'edsc',
                shapefileId: ''
              },
              token: 'token',
              environment: 'prod',
              updated_at: '2023-06-27T20:22:47.400Z',
              created_at: '2023-06-27T20:22:47.400Z'
            },
            {
              id: 4,
              user_id: 1,
              jsondata: {
                source: '?p=C1595422627-ASF!C1595422627-ASF&pg[1][a]=2700576794!2700634599!2700578014!2700575283!ASF&pg[1][v]=t&pg[1][gsk]=-start_date&pg[1][m]=harmony0&pg[1][ets]=t&q=C1595422627-ASF&polygon[0]=47.67188%2C31.48374%2C43.45313%2C31.06194%2C44.71875%2C25.29727%2C49.78125%2C26.42209%2C47.67188%2C31.48374&tl=1687897235.3!3!!&lat=-0.0703125&long=0.140625',
                portalId: 'edsc',
                shapefileId: ''
              },
              token: 'token',
              environment: 'prod',
              updated_at: '2023-06-27T20:22:47.400Z',
              created_at: '2023-06-27T20:22:47.400Z'
            }
          ])
        })

        const retrievals = await databaseClient.getRetrievals({
          limit: 2,
          offset: 2
        })

        expect(retrievals).toBeDefined()
        expect(retrievals).toEqual([
          {
            id: 3,
            user_id: 1,
            jsondata: {
              source: '?p=C1595422627-ASF!C1595422627-ASF&pg[1][a]=2700576794!2700634599!2700578014!2700575283!ASF&pg[1][v]=t&pg[1][gsk]=-start_date&pg[1][m]=harmony0&pg[1][ets]=t&q=C1595422627-ASF&polygon[0]=47.67188%2C31.48374%2C43.45313%2C31.06194%2C44.71875%2C25.29727%2C49.78125%2C26.42209%2C47.67188%2C31.48374&tl=1687897235.3!3!!&lat=-0.0703125&long=0.140625',
              portalId: 'edsc',
              shapefileId: ''
            },
            token: 'token',
            environment: 'prod',
            updated_at: '2023-06-27T20:22:47.400Z',
            created_at: '2023-06-27T20:22:47.400Z'
          },
          {
            id: 4,
            user_id: 1,
            jsondata: {
              source: '?p=C1595422627-ASF!C1595422627-ASF&pg[1][a]=2700576794!2700634599!2700578014!2700575283!ASF&pg[1][v]=t&pg[1][gsk]=-start_date&pg[1][m]=harmony0&pg[1][ets]=t&q=C1595422627-ASF&polygon[0]=47.67188%2C31.48374%2C43.45313%2C31.06194%2C44.71875%2C25.29727%2C49.78125%2C26.42209%2C47.67188%2C31.48374&tl=1687897235.3!3!!&lat=-0.0703125&long=0.140625',
              portalId: 'edsc',
              shapefileId: ''
            },
            token: 'token',
            environment: 'prod',
            updated_at: '2023-06-27T20:22:47.400Z',
            created_at: '2023-06-27T20:22:47.400Z'
          }
        ])

        const { queries } = dbTracker.queries

        expect(queries[0].sql).toEqual('select "retrievals"."id", "retrievals"."user_id", "retrievals"."jsondata", "retrievals"."environment", "retrievals"."created_at", "retrievals"."updated_at", "users"."id" as "user_id", "users"."urs_id" as "urs_id", count(*) OVER() as total from "retrievals" inner join "users" on "retrievals"."user_id" = "users"."id" order by "id" desc limit $1 offset $2')
        expect(queries[0].bindings).toEqual([2, 2])
      })
    })
  })

  describe('getRetrievalByObfuscatedId', () => {
    test('retrieves the retrieval', async () => {
      dbTracker.on('query', (query) => {
        query.response({
          id: 2,
          user_id: 1,
          jsondata: {
            source: '?p=C1595422627-ASF!C1595422627-ASF&pg[1][a]=2700576794!2700634599!2700578014!2700575283!ASF&pg[1][v]=t&pg[1][gsk]=-start_date&pg[1][m]=harmony0&pg[1][ets]=t&q=C1595422627-ASF&polygon[0]=47.67188%2C31.48374%2C43.45313%2C31.06194%2C44.71875%2C25.29727%2C49.78125%2C26.42209%2C47.67188%2C31.48374&tl=1687897235.3!3!!&lat=-0.0703125&long=0.140625',
            portalId: 'edsc',
            shapefileId: ''
          },
          token: 'token',
          environment: 'prod',
          updated_at: '2023-06-27T20:22:47.400Z',
          created_at: '2023-06-27T20:22:47.400Z'
        })
      })

      const collections = await databaseClient.getRetrievalByObfuscatedId('4517239960')

      expect(collections).toBeDefined()
      expect(collections).toEqual({
        id: 2,
        user_id: 1,
        jsondata: {
          source: '?p=C1595422627-ASF!C1595422627-ASF&pg[1][a]=2700576794!2700634599!2700578014!2700575283!ASF&pg[1][v]=t&pg[1][gsk]=-start_date&pg[1][m]=harmony0&pg[1][ets]=t&q=C1595422627-ASF&polygon[0]=47.67188%2C31.48374%2C43.45313%2C31.06194%2C44.71875%2C25.29727%2C49.78125%2C26.42209%2C47.67188%2C31.48374&tl=1687897235.3!3!!&lat=-0.0703125&long=0.140625',
          portalId: 'edsc',
          shapefileId: ''
        },
        token: 'token',
        environment: 'prod',
        updated_at: '2023-06-27T20:22:47.400Z',
        created_at: '2023-06-27T20:22:47.400Z'
      })

      const { queries } = dbTracker.queries

      expect(queries[0].sql).toEqual('select "retrievals"."id", "retrievals"."user_id", "retrievals"."jsondata", "retrievals"."environment", "retrievals"."created_at", "retrievals"."updated_at" from "retrievals" where "retrievals"."id" = $1 limit $2')
      expect(queries[0].bindings).toEqual([1, 1])
    })

    test('returns an error', async () => {
      const consoleMock = jest.spyOn(console, 'log')

      dbTracker.on('query', (query) => {
        query.reject('Unknown Error')
      })

      await expect(databaseClient.getRetrievalByObfuscatedId('4517239960')).rejects.toThrow('Failed to retrieve retrieval by ID')

      const { queries } = dbTracker.queries

      expect(queries[0].sql).toEqual('select "retrievals"."id", "retrievals"."user_id", "retrievals"."jsondata", "retrievals"."environment", "retrievals"."created_at", "retrievals"."updated_at" from "retrievals" where "retrievals"."id" = $1 limit $2')
      expect(queries[0].bindings).toEqual([1, 1])

      expect(consoleMock).toHaveBeenCalledTimes(1)
      expect(consoleMock).toHaveBeenCalledWith('Failed to retrieve retrieval by ID')
    })
  })

  describe('getRetrievalCollectionsByRetrievalId', () => {
    test('retrieves the retrieval collections', async () => {
      dbTracker.on('query', (query) => {
        query.response([{
          id: 1,
          retrieval_id: 1,
          access_method: {
            type: 'Harmony'
          },
          collection_id: 'C1595422627-ASF',
          collection_metadata: {
            conceptId: 'C1595422627-ASF',
            dataCenter: 'ASF'
          },
          granule_params: {
            echo_collection_id: 'C1595422627-ASF'
          },
          granule_count: 4,
          updated_at: '2025-01-01T00:00:00.000Z',
          created_at: '2025-01-01T00:00:00.000Z',
          granule_link_count: 4
        },
        {
          id: 2,
          retrieval_id: 2,
          access_method: {
            type: 'download'
          },
          collection_id: 'C1595422628-ASF',
          collection_metadata: {
            conceptId: 'C1595422628-ASF',
            dataCenter: 'ASF'
          },
          granule_params: {
            echo_collection_id: 'C1595422627-ASF'
          },
          granule_count: 5,
          updated_at: '2025-01-01T00:00:00.000Z',
          created_at: '2025-01-01T00:00:00.000Z',
          granule_link_count: 10
        }])
      })

      const collections = await databaseClient.getRetrievalCollectionsByRetrievalId([1, 2])

      expect(collections).toBeDefined()
      expect(collections).toEqual([
        {
          id: 1,
          retrieval_id: 1,
          access_method: {
            type: 'Harmony'
          },
          collection_id: 'C1595422627-ASF',
          collection_metadata: {
            conceptId: 'C1595422627-ASF',
            dataCenter: 'ASF'
          },
          granule_params: {
            echo_collection_id: 'C1595422627-ASF'
          },
          granule_count: 4,
          updated_at: '2025-01-01T00:00:00.000Z',
          created_at: '2025-01-01T00:00:00.000Z',
          granule_link_count: 4
        },
        {
          id: 2,
          retrieval_id: 2,
          access_method: {
            type: 'download'
          },
          collection_id: 'C1595422628-ASF',
          collection_metadata: {
            conceptId: 'C1595422628-ASF',
            dataCenter: 'ASF'
          },
          granule_params: {
            echo_collection_id: 'C1595422627-ASF'
          },
          granule_count: 5,
          updated_at: '2025-01-01T00:00:00.000Z',
          created_at: '2025-01-01T00:00:00.000Z',
          granule_link_count: 10
        }
      ])

      const { queries } = dbTracker.queries

      expect(queries[0].sql).toEqual('select "retrieval_collections"."id", "retrieval_collections"."retrieval_id", "retrieval_collections"."access_method", "retrieval_collections"."collection_id", "retrieval_collections"."collection_metadata", "retrieval_collections"."granule_count", "retrieval_collections"."created_at", "retrieval_collections"."updated_at", "retrieval_collections"."granule_link_count" from "retrieval_collections" where "retrieval_collections"."retrieval_id" in ($1, $2)')
      expect(queries[0].bindings).toEqual([1, 2])
    })

    test('returns an error', async () => {
      const consoleMock = jest.spyOn(console, 'log')

      dbTracker.on('query', (query) => {
        query.reject('Unknown Error')
      })

      await expect(databaseClient.getRetrievalCollectionsByRetrievalId([1, 2])).rejects.toThrow('Failed to retrieve retrieval collections by ID')

      const { queries } = dbTracker.queries

      expect(queries[0].sql).toEqual('select "retrieval_collections"."id", "retrieval_collections"."retrieval_id", "retrieval_collections"."access_method", "retrieval_collections"."collection_id", "retrieval_collections"."collection_metadata", "retrieval_collections"."granule_count", "retrieval_collections"."created_at", "retrieval_collections"."updated_at", "retrieval_collections"."granule_link_count" from "retrieval_collections" where "retrieval_collections"."retrieval_id" in ($1, $2)')
      expect(queries[0].bindings).toEqual([1, 2])

      expect(consoleMock).toHaveBeenCalledTimes(1)
      expect(consoleMock).toHaveBeenCalledWith('Failed to retrieve retrieval collections by ID')
    })
  })

  describe('getRetrievalOrdersByRetrievalCollectionId', () => {
    test('retrieves the retrieval orders', async () => {
      dbTracker.on('query', (query) => {
        query.response([
          {
            id: 1,
            retrieval_collection_id: 3,
            type: 'Harmony',
            granule_params: {
              echo_collection_id: 'C1595422627-ASF'
            },
            order_number: '1ffad0ac-b9cf-4128-b319-554cb1394670',
            state: 'initialized',
            updated_at: '2023-06-27T20:22:47.400Z',
            created_at: '2023-06-27T20:22:47.400Z',
            order_information: {}
          },
          {
            id: 2,
            retrieval_collection_id: 18,
            type: 'Harmony',
            granule_params: {
              echo_collection_id: 'C1595422627-ASF'
            },
            order_number: null,
            state: 'creating',
            updated_at: '2025-02-14T20:36:19.156Z',
            created_at: '2025-02-14T18:36:19.156Z',
            order_information: {}
          }
        ])
      })

      const collections = await databaseClient.getRetrievalOrdersByRetrievalCollectionId([1, 2])

      expect(collections).toBeDefined()
      expect(collections).toEqual([
        {
          id: 1,
          retrieval_collection_id: 3,
          type: 'Harmony',
          granule_params: {
            echo_collection_id: 'C1595422627-ASF'
          },
          order_number: '1ffad0ac-b9cf-4128-b319-554cb1394670',
          state: 'initialized',
          updated_at: '2023-06-27T20:22:47.400Z',
          created_at: '2023-06-27T20:22:47.400Z',
          order_information: {}
        },
        {
          id: 2,
          retrieval_collection_id: 18,
          type: 'Harmony',
          granule_params: {
            echo_collection_id: 'C1595422627-ASF'
          },
          order_number: null,
          state: 'creating',
          updated_at: '2025-02-14T20:36:19.156Z',
          created_at: '2025-02-14T18:36:19.156Z',
          order_information: {}
        }
      ])

      const { queries } = dbTracker.queries

      expect(queries[0].sql).toEqual('select "retrieval_orders"."id", "retrieval_orders"."retrieval_collection_id", "retrieval_orders"."type", "retrieval_orders"."state", "retrieval_orders"."order_information", "retrieval_orders"."order_number" from "retrieval_orders" where "retrieval_orders"."retrieval_collection_id" in ($1, $2)')
      expect(queries[0].bindings).toEqual([1, 2])
    })

    test('returns an error', async () => {
      const consoleMock = jest.spyOn(console, 'log')

      dbTracker.on('query', (query) => {
        query.reject('Unknown Error')
      })

      await expect(databaseClient.getRetrievalOrdersByRetrievalCollectionId([1, 2])).rejects.toThrow('Failed to retrieve retrieval orders by ID')

      const { queries } = dbTracker.queries

      expect(queries[0].sql).toEqual('select "retrieval_orders"."id", "retrieval_orders"."retrieval_collection_id", "retrieval_orders"."type", "retrieval_orders"."state", "retrieval_orders"."order_information", "retrieval_orders"."order_number" from "retrieval_orders" where "retrieval_orders"."retrieval_collection_id" in ($1, $2)')
      expect(queries[0].bindings).toEqual([1, 2])

      expect(consoleMock).toHaveBeenCalledTimes(1)
      expect(consoleMock).toHaveBeenCalledWith('Failed to retrieve retrieval orders by ID')
    })
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

      const { queries } = dbTracker.queries

      expect(queries[0].sql).toEqual('select "users"."id", "users"."site_preferences", "users"."urs_id", "users"."urs_profile" from "users" where "users"."id" = $1 limit $2')
      expect(queries[0].bindings).toEqual([1, 1])
    })

    test('returns an error', async () => {
      const consoleMock = jest.spyOn(console, 'log')

      dbTracker.on('query', (query) => {
        query.reject('Unknown Error')
      })

      await expect(databaseClient.getUserById(1)).rejects.toThrow('Failed to retrieve user by ID')

      const { queries } = dbTracker.queries

      expect(queries[0].sql).toEqual('select "users"."id", "users"."site_preferences", "users"."urs_id", "users"."urs_profile" from "users" where "users"."id" = $1 limit $2')
      expect(queries[0].bindings).toEqual([1, 1])

      expect(consoleMock).toHaveBeenCalledTimes(1)
      expect(consoleMock).toHaveBeenCalledWith('Failed to retrieve user by ID')
    })
  })

  describe('getUserWhere', () => {
    test('retrieves the user by where clause', async () => {
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

      const user = await databaseClient.getUserWhere({ id: 1 })

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

      const { queries } = dbTracker.queries

      expect(queries[0].sql).toEqual('select "users"."id", "users"."site_preferences", "users"."urs_id", "users"."urs_profile" from "users" where "id" = $1 limit $2')
      expect(queries[0].bindings).toEqual([1, 1])
    })

    test('returns an error', async () => {
      const consoleMock = jest.spyOn(console, 'log')

      dbTracker.on('query', (query) => {
        query.reject('Unknown Error')
      })

      await expect(databaseClient.getUserWhere({ id: 1 })).rejects.toThrow('Failed to retrieve user using where object')

      const { queries } = dbTracker.queries

      expect(queries[0].sql).toEqual('select "users"."id", "users"."site_preferences", "users"."urs_id", "users"."urs_profile" from "users" where "id" = $1 limit $2')
      expect(queries[0].bindings).toEqual([1, 1])

      expect(consoleMock).toHaveBeenCalledTimes(1)
      expect(consoleMock).toHaveBeenCalledWith('Failed to retrieve user using where object')
    })
  })

  describe('getUsersById', () => {
    test('retrieves the users', async () => {
      dbTracker.on('query', (query) => {
        query.response([
          {
            id: 1,
            site_preferences: {},
            urs_id: 'testuser-one',
            urs_profile: {},
            updated_at: '2025-01-01T00:00:00.000Z',
            created_at: '2025-01-01T00:00:00.000Z',
            environment: 'prod'
          },
          {
            id: 2,
            site_preferences: {},
            urs_id: 'testuser-two',
            urs_profile: {},
            updated_at: '2025-01-02T00:00:00.000Z',
            created_at: '2025-01-02T00:00:00.000Z',
            environment: 'prod'
          }
        ])
      })

      const users = await databaseClient.getUsersById([1, 2])

      expect(users).toBeDefined()
      expect(users).toEqual([
        {
          id: 1,
          site_preferences: {},
          urs_id: 'testuser-one',
          urs_profile: {},
          updated_at: '2025-01-01T00:00:00.000Z',
          created_at: '2025-01-01T00:00:00.000Z',
          environment: 'prod'
        },
        {
          id: 2,
          site_preferences: {},
          urs_id: 'testuser-two',
          urs_profile: {},
          updated_at: '2025-01-02T00:00:00.000Z',
          created_at: '2025-01-02T00:00:00.000Z',
          environment: 'prod'
        }
      ])

      const { queries } = dbTracker.queries

      expect(queries[0].sql).toEqual('select "users"."id", "users"."urs_id" from "users" where "users"."id" in ($1, $2)')
      expect(queries[0].bindings).toEqual([1, 2])
    })

    test('returns an error', async () => {
      const consoleMock = jest.spyOn(console, 'log')

      dbTracker.on('query', (query) => {
        query.reject('Unknown Error')
      })

      await expect(databaseClient.getUsersById([1, 2])).rejects.toThrow('Failed to retrieve users by ID')

      const { queries } = dbTracker.queries

      expect(queries[0].sql).toEqual('select "users"."id", "users"."urs_id" from "users" where "users"."id" in ($1, $2)')
      expect(queries[0].bindings).toEqual([1, 2])

      expect(consoleMock).toHaveBeenCalledTimes(1)
      expect(consoleMock).toHaveBeenCalledWith('Failed to retrieve users by ID')
    })
  })

  describe('updateProject', () => {
    test('updates an existing project', async () => {
      dbTracker.on('query', (query) => {
        query.response([{
          id: 1,
          name: 'Updated Project',
          path: '/updated/project',
          user_id: 1
        }])
      })

      const project = await databaseClient.updateProject({
        obfuscatedId: '4517239960',
        name: 'Updated Project',
        path: '/updated/project',
        userId: 1
      })

      expect(project).toBeDefined()
      expect(project).toEqual({
        id: 1,
        name: 'Updated Project',
        path: '/updated/project',
        user_id: 1
      })

      const { queries } = dbTracker.queries

      expect(queries[0].sql).toEqual('update "projects" set "name" = $1, "path" = $2, "updated_at" = $3 where "id" = $4 and "user_id" = $5 returning *')
      expect(queries[0].bindings).toEqual(['Updated Project', '/updated/project', new Date(mockToday), 1, 1])
    })

    test('returns an error', async () => {
      const consoleMock = jest.spyOn(console, 'log')

      dbTracker.on('query', (query) => {
        query.reject('Unknown Error')
      })

      await expect(databaseClient.updateProject({
        obfuscatedId: '4517239960',
        name: 'Updated Project',
        path: '/updated/project',
        userId: 1
      })).rejects.toThrow('Failed to update project')

      const { queries } = dbTracker.queries

      expect(queries[0].sql).toEqual('update "projects" set "name" = $1, "path" = $2, "updated_at" = $3 where "id" = $4 and "user_id" = $5 returning *')
      expect(queries[0].bindings).toEqual(['Updated Project', '/updated/project', new Date(mockToday), 1, 1])

      expect(consoleMock).toHaveBeenCalledTimes(1)
      expect(consoleMock).toHaveBeenCalledWith('Failed to update project')
    })
  })

  describe('updateSitePreferences', () => {
    test('updates the site preferences', async () => {
      dbTracker.on('query', (query) => {
        query.response([{
          id: 1,
          site_preferences: { mock: 'preferences' },
          urs_id: 'testuser',
          urs_profile: {},
          updated_at: '2025-01-01T00:00:00.000Z',
          created_at: '2025-01-01T00:00:00.000Z',
          environment: 'prod'
        }])
      })

      const user = await databaseClient.updateSitePreferences({
        userId: 1,
        sitePreferences: { mock: 'preferences' }
      })

      expect(user).toBeDefined()
      expect(user).toEqual({
        created_at: '2025-01-01T00:00:00.000Z',
        environment: 'prod',
        id: 1,
        site_preferences: { mock: 'preferences' },
        updated_at: '2025-01-01T00:00:00.000Z',
        urs_id: 'testuser',
        urs_profile: {}
      })

      const { queries } = dbTracker.queries

      expect(queries[0].sql).toEqual('update "users" set "site_preferences" = $1, "updated_at" = $2 where "id" = $3 returning "id", "site_preferences", "urs_id", "urs_profile"')
      expect(queries[0].bindings).toEqual([{ mock: 'preferences' }, new Date(mockToday), 1])
    })

    test('returns an error', async () => {
      const consoleMock = jest.spyOn(console, 'log')

      dbTracker.on('query', (query) => {
        query.reject('Unknown Error')
      })

      await expect(databaseClient.updateSitePreferences({
        userId: 1,
        sitePreferences: { mock: 'preferences' }
      })).rejects.toThrow('Failed to update site preferences')

      const { queries } = dbTracker.queries

      expect(queries[0].sql).toEqual('update "users" set "site_preferences" = $1, "updated_at" = $2 where "id" = $3 returning "id", "site_preferences", "urs_id", "urs_profile"')
      expect(queries[0].bindings).toEqual([{ mock: 'preferences' }, new Date(mockToday), 1])

      expect(consoleMock).toHaveBeenCalledTimes(1)
      expect(consoleMock).toHaveBeenCalledWith('Failed to update site preferences')
    })
  })

  describe('colormaps', () => {
    test('retrieves the colormaps', async () => {
      dbTracker.on('query', (query) => {
        query.response([{
          id: 1,
          product: 'test-product',
          url: 'https://example.com/colormap',
          jsondata: { scale: { colors: ['#ff0000'] } },
          created_at: '2025-08-18 12:05:00.00000',
          updated_at: '2025-08-18 12:05:00.00000'
        }])
      })

      const colormaps = await databaseClient.getColorMapsByProducts(['test-product'])

      expect(colormaps).toBeDefined()
      expect(colormaps).toEqual([{
        id: 1,
        product: 'test-product',
        url: 'https://example.com/colormap',
        jsonData: { scale: { colors: ['#ff0000'] } },
        createdAt: '2025-08-18 12:05:00.00000',
        updatedAt: '2025-08-18 12:05:00.00000'
      }])
    })

    test('returns an error', async () => {
      const consoleMock = jest.spyOn(console, 'log')

      dbTracker.on('query', (query) => {
        query.reject('Unknown Error')
      })

      await expect(databaseClient.getColorMapsByProducts(['test-product'])).rejects.toThrow('Failed to retrieve colormaps by products')

      const { queries } = dbTracker.queries
      expect(queries[0].sql).toEqual('select "id", "product", "url", "jsondata", "created_at", "updated_at" from "colormaps" where "product" in ($1)')
      expect(queries[0].bindings).toEqual(['test-product'])

      expect(consoleMock).toHaveBeenCalledTimes(1)
      expect(consoleMock).toHaveBeenCalledWith('Failed to retrieve colormaps by products')
    })
  })
})
