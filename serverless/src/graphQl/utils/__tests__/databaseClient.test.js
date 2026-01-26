import knex from 'knex'
import mockKnex from 'mock-knex'
import MockDate from 'mockdate'

import * as getDbConnection from '../../../util/database/getDbConnection'
import DatabaseClient from '../databaseClient'

let dbTracker

const mockToday = '2025-10-09T12:00:00.000Z'

vi.mock('../../../../../sharedUtils/config', () => ({
  getApplicationConfig: vi.fn().mockImplementation(() => ({
    env: 'testenv'
  }))
}))

describe('DatabaseClient', () => {
  let databaseClient

  beforeEach(() => {
    databaseClient = new DatabaseClient()

    vi.spyOn(getDbConnection, 'getDbConnection').mockImplementationOnce(() => {
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

  describe('startTransaction', () => {
    test('starts a new transaction', async () => {
      // Mock the databaseClient's getDbConnection function
      const mockTransaction = vi.fn().mockReturnValue({
        commit: vi.fn(),
        rollback: vi.fn()
      })
      databaseClient.getDbConnection = vi.fn().mockReturnValueOnce({
        transaction: mockTransaction
      })

      await databaseClient.startTransaction()

      expect(mockTransaction).toHaveBeenCalledTimes(1)
      expect(mockTransaction).toHaveBeenCalledWith()
    })
  })

  describe('commitTransaction', () => {
    test('commits a transaction', async () => {
      // Mock the databaseClient's getDbConnection function
      const mockTransaction = vi.fn().mockReturnValue({
        commit: vi.fn(),
        rollback: vi.fn()
      })
      databaseClient.getDbConnection = vi.fn().mockReturnValueOnce({
        transaction: mockTransaction
      })

      await databaseClient.startTransaction()

      expect(mockTransaction).toHaveBeenCalledTimes(1)
      expect(mockTransaction).toHaveBeenCalledWith()

      await databaseClient.commitTransaction()

      expect(mockTransaction().commit).toHaveBeenCalledTimes(1)
      expect(mockTransaction().commit).toHaveBeenCalledWith()
    })
  })

  describe('rollbackTransaction', () => {
    test('rolls back a transaction', async () => {
      // Mock the databaseClient's getDbConnection function
      const mockTransaction = vi.fn().mockReturnValue({
        commit: vi.fn(),
        rollback: vi.fn()
      })
      databaseClient.getDbConnection = vi.fn().mockReturnValueOnce({
        transaction: mockTransaction
      })

      await databaseClient.startTransaction()

      expect(mockTransaction).toHaveBeenCalledTimes(1)
      expect(mockTransaction).toHaveBeenCalledWith()

      await databaseClient.rollbackTransaction()

      expect(mockTransaction().rollback).toHaveBeenCalledTimes(1)
      expect(mockTransaction().rollback).toHaveBeenCalledWith()
    })
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
      const consoleMock = vi.spyOn(console, 'log')

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
      expect(consoleMock).toHaveBeenCalledWith('Failed to create project', expect.any(Error))
    })

    describe('when the user is not authenticated', () => {
      test('creates a new project with no userId', async () => {
        dbTracker.on('query', (query) => {
          query.response([{
            id: 1,
            name: 'Test Project',
            path: '/test/project',
            user_id: null
          }])
        })

        const project = await databaseClient.createProject({
          name: 'Test Project',
          path: '/test/project',
          userId: null
        })

        expect(project).toBeDefined()
        expect(project).toEqual({
          id: 1,
          name: 'Test Project',
          path: '/test/project',
          user_id: null
        })
      })
    })
  })

  describe('createRetrieval', () => {
    test('creates a new retrieval', async () => {
      dbTracker.on('query', (query) => {
        query.response([{
          id: 1,
          user_id: 1,
          environment: 'testenv',
          jsondata: { mock: 'data' },
          updated_at: mockToday,
          created_at: mockToday
        }])
      })

      const retrieval = await databaseClient.createRetrieval({
        environment: 'testenv',
        jsondata: { mock: 'data' },
        token: 'token',
        userId: 1
      })

      expect(retrieval).toBeDefined()
      expect(retrieval).toEqual({
        id: 1,
        user_id: 1,
        environment: 'testenv',
        jsondata: { mock: 'data' },
        updated_at: mockToday,
        created_at: mockToday
      })

      const { queries } = dbTracker.queries

      expect(queries[0].sql).toEqual('insert into "retrievals" ("environment", "jsondata", "token", "user_id") values ($1, $2, $3, $4) returning "id", "user_id", "environment", "jsondata", "updated_at", "created_at"')
      expect(queries[0].bindings).toEqual(['testenv', JSON.stringify({ mock: 'data' }), 'token', 1])
    })

    test('returns an error', async () => {
      const consoleMock = vi.spyOn(console, 'log')

      dbTracker.on('query', (query) => {
        query.reject('Unknown Error')
      })

      await expect(databaseClient.createRetrieval({
        environment: 'testenv',
        jsondata: { mock: 'data' },
        token: 'token',
        userId: 1
      })).rejects.toThrow('Failed to create retrieval')

      const { queries } = dbTracker.queries

      expect(queries[0].sql).toEqual('insert into "retrievals" ("environment", "jsondata", "token", "user_id") values ($1, $2, $3, $4) returning "id", "user_id", "environment", "jsondata", "updated_at", "created_at"')
      expect(queries[0].bindings).toEqual(['testenv', JSON.stringify({ mock: 'data' }), 'token', 1])

      expect(consoleMock).toHaveBeenCalledTimes(1)
      expect(consoleMock).toHaveBeenCalledWith('Failed to create retrieval', expect.any(Error))
    })
  })

  describe('createRetrievalCollection', () => {
    test('creates a new retrieval collection', async () => {
      dbTracker.on('query', (query) => {
        query.response([{
          id: 1,
          access_method: { mock: 'access method' },
          collection_id: 'collectionId',
          collection_metadata: { mock: 'collection metadata' },
          granule_params: { mock: 'granule params' },
          granule_count: 42,
          granule_link_count: 42
        }])
      })

      const retrievalCollection = await databaseClient.createRetrievalCollection({
        accessMethod: { mock: 'access method' },
        collectionId: 'collectionId',
        collectionMetadata: { mock: 'collection metadata' },
        granuleCount: 42,
        granuleLinkCount: 42,
        granuleParams: { mock: 'granule params' },
        retrievalId: 1
      })

      expect(retrievalCollection).toBeDefined()
      expect(retrievalCollection).toEqual([{
        id: 1,
        access_method: { mock: 'access method' },
        collection_id: 'collectionId',
        collection_metadata: { mock: 'collection metadata' },
        granule_params: { mock: 'granule params' },
        granule_count: 42,
        granule_link_count: 42
      }])

      const { queries } = dbTracker.queries

      expect(queries[0].sql).toEqual('insert into "retrieval_collections" ("access_method", "collection_id", "collection_metadata", "granule_count", "granule_link_count", "granule_params", "retrieval_id") values ($1, $2, $3, $4, $5, $6, $7) returning "id", "access_method", "collection_id", "collection_metadata", "granule_params", "granule_count", "granule_link_count"')
      expect(queries[0].bindings).toEqual([
        JSON.stringify({ mock: 'access method' }),
        'collectionId',
        JSON.stringify({ mock: 'collection metadata' }),
        42,
        42,
        JSON.stringify({ mock: 'granule params' }),
        1
      ])
    })

    test('returns an error', async () => {
      const consoleMock = vi.spyOn(console, 'log')

      dbTracker.on('query', (query) => {
        query.reject('Unknown Error')
      })

      await expect(
        databaseClient.createRetrievalCollection({
          accessMethod: { mock: 'access method' },
          collectionId: 'collectionId',
          collectionMetadata: { mock: 'collection metadata' },
          granuleCount: 42,
          granuleLinkCount: 42,
          granuleParams: { mock: 'granule params' },
          retrievalId: 1
        })
      ).rejects.toThrow('Failed to create retrieval collection')

      const { queries } = dbTracker.queries

      expect(queries[0].sql).toEqual('insert into "retrieval_collections" ("access_method", "collection_id", "collection_metadata", "granule_count", "granule_link_count", "granule_params", "retrieval_id") values ($1, $2, $3, $4, $5, $6, $7) returning "id", "access_method", "collection_id", "collection_metadata", "granule_params", "granule_count", "granule_link_count"')
      expect(queries[0].bindings).toEqual([
        JSON.stringify({ mock: 'access method' }),
        'collectionId',
        JSON.stringify({ mock: 'collection metadata' }),
        42,
        42,
        JSON.stringify({ mock: 'granule params' }),
        1
      ])

      expect(consoleMock).toHaveBeenCalledTimes(1)
      expect(consoleMock).toHaveBeenCalledWith('Failed to create retrieval collection', expect.any(Error))
    })
  })

  describe('createRetrievalOrder', () => {
    test('creates a new retrieval order', async () => {
      dbTracker.on('query', (query) => {
        query.response([{
          id: 1
        }])
      })

      const retrievalCollection = await databaseClient.createRetrievalOrder({
        orderPayload: { mock: 'order payload' },
        retrievalCollectionId: 1,
        type: 'type'
      })

      expect(retrievalCollection).toBeDefined()
      expect(retrievalCollection).toEqual({
        id: 1
      })

      const { queries } = dbTracker.queries

      expect(queries[0].sql).toEqual('insert into "retrieval_orders" ("granule_params", "retrieval_collection_id", "type") values ($1, $2, $3) returning "id"')
      expect(queries[0].bindings).toEqual([
        JSON.stringify({ mock: 'order payload' }),
        1,
        'type'
      ])
    })

    test('returns an error', async () => {
      const consoleMock = vi.spyOn(console, 'log')

      dbTracker.on('query', (query) => {
        query.reject('Unknown Error')
      })

      await expect(
        databaseClient.createRetrievalOrder({
          orderPayload: { mock: 'order payload' },
          retrievalCollectionId: 1,
          type: 'type'
        })
      ).rejects.toThrow('Failed to create retrieval order')

      const { queries } = dbTracker.queries

      expect(queries[0].sql).toEqual('insert into "retrieval_orders" ("granule_params", "retrieval_collection_id", "type") values ($1, $2, $3) returning "id"')
      expect(queries[0].bindings).toEqual([
        JSON.stringify({ mock: 'order payload' }),
        1,
        'type'
      ])

      expect(consoleMock).toHaveBeenCalledTimes(1)
      expect(consoleMock).toHaveBeenCalledWith('Failed to create retrieval order', expect.any(Error))
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
      const consoleMock = vi.spyOn(console, 'log')

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
      expect(consoleMock).toHaveBeenCalledWith('Failed to delete project', expect.any(Error))
    })
  })

  describe('getAccessConfiguration', () => {
    test('retrieves the access configuration', async () => {
      dbTracker.on('query', (query) => {
        query.response([{
          id: 1,
          collection_id: 'collectionId',
          access_method: { mock: 'access method' }
        }])
      })

      const accessConfig = await databaseClient.getAccessConfiguration({
        collectionId: 'collectionId',
        userId: 1
      })

      expect(accessConfig).toBeDefined()
      expect(accessConfig).toEqual([{
        id: 1,
        collection_id: 'collectionId',
        access_method: { mock: 'access method' }
      }])

      const { queries } = dbTracker.queries

      expect(queries[0].sql).toEqual('select "id", "collection_id", "access_method" from "access_configurations" where "collection_id" = $1 and "user_id" = $2')
      expect(queries[0].bindings).toEqual(['collectionId', 1])
    })

    test('returns an error', async () => {
      const consoleMock = vi.spyOn(console, 'log')

      dbTracker.on('query', (query) => {
        query.reject('Unknown Error')
      })

      await expect(databaseClient.getAccessConfiguration({
        collectionId: 'collectionId',
        userId: 1
      })).rejects.toThrow('Failed to retrieve access configuration')

      const { queries } = dbTracker.queries

      expect(queries[0].sql).toEqual('select "id", "collection_id", "access_method" from "access_configurations" where "collection_id" = $1 and "user_id" = $2')
      expect(queries[0].bindings).toEqual(['collectionId', 1])

      expect(consoleMock).toHaveBeenCalledTimes(1)
      expect(consoleMock).toHaveBeenCalledWith('Failed to retrieve access configuration', expect.any(Error))
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
      const consoleMock = vi.spyOn(console, 'log')

      dbTracker.on('query', (query) => {
        query.reject('Unknown Error')
      })

      await expect(databaseClient.getSitePreferences()).rejects.toThrow('Failed to retrieve site preferences')

      const { queries } = dbTracker.queries

      expect(queries[0].sql).toEqual('select "users"."site_preferences" from "users" where "users"."environment" = $1')
      expect(queries[0].bindings).toEqual(['testenv'])

      expect(consoleMock).toHaveBeenCalledTimes(1)
      expect(consoleMock).toHaveBeenCalledWith('Failed to retrieve site preferences', expect.any(Error))
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

      expect(queries[0].sql).toEqual('select "id", "name", "path", "user_id", "created_at", "updated_at" from "projects" where "id" = $1 limit $2')
      expect(queries[0].bindings).toEqual([1, 1])
    })

    test('returns an error', async () => {
      const consoleMock = vi.spyOn(console, 'log')

      dbTracker.on('query', (query) => {
        query.reject('Unknown Error')
      })

      await expect(databaseClient.getProjectByObfuscatedId('4517239960')).rejects.toThrow('Failed to retrieve project by ID')

      const { queries } = dbTracker.queries

      expect(queries[0].sql).toEqual('select "id", "name", "path", "user_id", "created_at", "updated_at" from "projects" where "id" = $1 limit $2')
      expect(queries[0].bindings).toEqual([1, 1])

      expect(consoleMock).toHaveBeenCalledTimes(1)
      expect(consoleMock).toHaveBeenCalledWith('Failed to retrieve project by ID', expect.any(Error))
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
      const consoleMock = vi.spyOn(console, 'log')

      dbTracker.on('query', (query) => {
        query.reject('Unknown Error')
      })

      await expect(databaseClient.getProjects({})).rejects.toThrow('Failed to retrieve user projects')

      const { queries } = dbTracker.queries

      expect(queries[0].sql).toEqual('select "projects"."id", "projects"."name", "projects"."path", "projects"."created_at", "projects"."updated_at", "users"."id" as "user_id", "users"."urs_id" as "urs_id", count(*) OVER() as total from "projects" inner join "users" on "projects"."user_id" = "users"."id" order by "projects"."id" desc limit $1')
      expect(queries[0].bindings).toEqual([20])

      expect(consoleMock).toHaveBeenCalledTimes(1)
      expect(consoleMock).toHaveBeenCalledWith('Failed to retrieve user projects', expect.any(Error))
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

  describe('getAdminRetrievals', () => {
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

      const retrievals = await databaseClient.getAdminRetrievals({})

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
      const consoleMock = vi.spyOn(console, 'log')

      dbTracker.on('query', (query) => {
        query.reject('Unknown Error')
      })

      await expect(databaseClient.getAdminRetrievals({})).rejects.toThrow('Failed to retrieve user retrievals')

      const { queries } = dbTracker.queries

      expect(queries[0].sql).toEqual('select "retrievals"."id", "retrievals"."user_id", "retrievals"."jsondata", "retrievals"."environment", "retrievals"."created_at", "retrievals"."updated_at", "users"."id" as "user_id", "users"."urs_id" as "urs_id", count(*) OVER() as total from "retrievals" inner join "users" on "retrievals"."user_id" = "users"."id" order by "id" desc')
      expect(queries[0].bindings).toEqual([])

      expect(consoleMock).toHaveBeenCalledTimes(1)
      expect(consoleMock).toHaveBeenCalledWith('Failed to retrieve user retrievals', expect.any(Error))
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

        const retrievals = await databaseClient.getAdminRetrievals({
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

        const retrievals = await databaseClient.getAdminRetrievals({
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

        const retrievals = await databaseClient.getAdminRetrievals({
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

        const retrievals = await databaseClient.getAdminRetrievals({
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

        const retrievals = await databaseClient.getAdminRetrievals({
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

      expect(queries[0].sql).toEqual('select "id", "user_id", "jsondata", "environment", "created_at", "updated_at" from "retrievals" where "id" = $1 limit $2')
      expect(queries[0].bindings).toEqual([1, 1])
    })

    test('returns the retrieval with a userId', async () => {
      dbTracker.on('query', (query) => {
        query.response({
          id: 2,
          user_id: 2,
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

      const collections = await databaseClient.getRetrievalByObfuscatedId('4517239960', 2)

      expect(collections).toBeDefined()
      expect(collections).toEqual({
        id: 2,
        user_id: 2,
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

      expect(queries[0].sql).toEqual('select "id", "user_id", "jsondata", "environment", "created_at", "updated_at" from "retrievals" where "id" = $1 and "user_id" = $2 limit $3')
      expect(queries[0].bindings).toEqual([1, 2, 1])
    })

    test('returns an error', async () => {
      const consoleMock = vi.spyOn(console, 'log')

      dbTracker.on('query', (query) => {
        query.reject('Unknown Error')
      })

      await expect(databaseClient.getRetrievalByObfuscatedId('4517239960')).rejects.toThrow('Failed to retrieve retrieval by ID')

      const { queries } = dbTracker.queries

      expect(queries[0].sql).toEqual('select "id", "user_id", "jsondata", "environment", "created_at", "updated_at" from "retrievals" where "id" = $1 limit $2')
      expect(queries[0].bindings).toEqual([1, 1])

      expect(consoleMock).toHaveBeenCalledTimes(1)
      expect(consoleMock).toHaveBeenCalledWith('Failed to retrieve retrieval by ID', expect.any(Error))
    })
  })

  describe('getHistoryRetrievals', () => {
    test('retrieves the history retrieval', async () => {
      const userId = 123
      const limit = 20
      const offset = 0

      dbTracker.on('query', (query, step) => {
        if (step === 1) {
          query.response([{
            id: 1,
            created_at: '2023-01-01T00:00:00Z',
            portal_id: 'edsc',
            titles: ['title 1'],
            total: 1
          }])
        }
      })

      const historyRetrievals = await databaseClient.getHistoryRetrievals({
        userId,
        limit,
        offset
      })

      expect(historyRetrievals).toEqual([{
        id: 1,
        created_at: '2023-01-01T00:00:00Z',
        portal_id: 'edsc',
        titles: ['title 1'],
        total: 1
      }])

      const { queries } = dbTracker.queries

      expect(queries[0].sql).toEqual('select "retrievals"."id", "retrievals"."created_at", (jsondata->\'portalId\') as portal_id, array_agg(retrieval_collections.collection_metadata->\'title\') as titles, count(*) OVER() as total from "retrievals" inner join "retrieval_collections" on "retrievals"."id" = "retrieval_collections"."retrieval_id" where "retrievals"."user_id" = $1 group by "retrievals"."id", "retrievals"."created_at", "retrievals"."jsondata" order by "retrievals"."created_at" desc limit $2')

      // When offset is 0, it is not included in variables
      expect(queries[0].bindings).toEqual([userId, limit])
    })

    test('returns an error', async () => {
      const consoleMock = vi.spyOn(console, 'log')

      dbTracker.on('query', (query) => {
        query.reject('Unknown Error')
      })

      await expect(databaseClient.getHistoryRetrievals({
        userId: 1,
        limit: 20,
        offset: 0
      })).rejects.toThrow('Failed to retrieve user retrievals')

      const { queries } = dbTracker.queries

      expect(queries[0].sql).toEqual('select "retrievals"."id", "retrievals"."created_at", (jsondata->\'portalId\') as portal_id, array_agg(retrieval_collections.collection_metadata->\'title\') as titles, count(*) OVER() as total from "retrievals" inner join "retrieval_collections" on "retrievals"."id" = "retrieval_collections"."retrieval_id" where "retrievals"."user_id" = $1 group by "retrievals"."id", "retrievals"."created_at", "retrievals"."jsondata" order by "retrievals"."created_at" desc limit $2')
      expect(queries[0].bindings).toEqual([1, 20])

      expect(consoleMock).toHaveBeenCalledTimes(1)
      expect(consoleMock).toHaveBeenCalledWith('Failed to retrieve user retrievals', expect.any(Error))
    })
  })

  describe('deleteRetrieval', () => {
    test('deletes the retrieval', async () => {
      dbTracker.on('query', (query) => {
        query.response(1)
      })

      const result = await databaseClient.deleteRetrieval({
        obfuscatedId: '4517239960',
        userId: 1
      })

      expect(result).toBeDefined()
      expect(result).toEqual(1)

      const { queries } = dbTracker.queries

      expect(queries[0].sql).toEqual('delete from "retrievals" where "user_id" = $1 and "id" = $2')
      expect(queries[0].bindings).toEqual([1, 1])
    })

    test('returns an error', async () => {
      const consoleMock = vi.spyOn(console, 'log')

      dbTracker.on('query', (query) => {
        query.reject('Unknown Error')
      })

      await expect(databaseClient.deleteRetrieval({
        obfuscatedId: '4517239960',
        userId: 1
      })).rejects.toThrow('Failed to delete retrieval')

      const { queries } = dbTracker.queries

      expect(queries[0].sql).toEqual('delete from "retrievals" where "user_id" = $1 and "id" = $2')
      expect(queries[0].bindings).toEqual([1, 1])

      expect(consoleMock).toHaveBeenCalledTimes(1)
      expect(consoleMock).toHaveBeenCalledWith('Failed to delete retrieval', expect.any(Error))
    })
  })

  describe('getRetrievalCollectionByObfuscatedId', () => {
    test('retrieves the retrieval collection', async () => {
      dbTracker.on('query', (query) => {
        query.response({
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
        })
      })

      const collection = await databaseClient.getRetrievalCollectionByObfuscatedId('4517239960', 2)

      expect(collection).toBeDefined()
      expect(collection).toEqual({
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
      })

      const { queries } = dbTracker.queries

      expect(queries[0].sql).toEqual('select "retrieval_collections"."id", "retrieval_collections"."retrieval_id", "retrieval_collections"."access_method", "retrieval_collections"."collection_id", "retrieval_collections"."collection_metadata", "retrieval_collections"."granule_params", "retrieval_collections"."granule_count", "retrieval_collections"."granule_link_count", "retrieval_collections"."updated_at", "retrieval_orders"."id" as "retrieval_order_id", "retrieval_orders"."type", "retrieval_orders"."order_number", "retrieval_orders"."order_information", "retrieval_orders"."state", "retrieval_orders"."error", "retrieval_orders"."updated_at" as "retrieval_order_updated_at" from "retrieval_collections" left join "retrieval_orders" on "retrieval_collections"."id" = "retrieval_orders"."retrieval_collection_id" inner join "retrievals" on "retrieval_collections"."retrieval_id" = "retrievals"."id" inner join "users" on "retrievals"."user_id" = "users"."id" where "retrieval_collections"."id" = $1 and "users"."id" = $2 limit $3')
      expect(queries[0].bindings).toEqual([1, 2, 1])
    })

    test('returns an error', async () => {
      const consoleMock = vi.spyOn(console, 'log')

      dbTracker.on('query', (query) => {
        query.reject('Unknown Error')
      })

      await expect(
        databaseClient.getRetrievalCollectionByObfuscatedId('4517239960', 2)
      ).rejects.toThrow('Failed to retrieve retrieval collection by ID')

      const { queries } = dbTracker.queries

      expect(queries[0].sql).toEqual('select "retrieval_collections"."id", "retrieval_collections"."retrieval_id", "retrieval_collections"."access_method", "retrieval_collections"."collection_id", "retrieval_collections"."collection_metadata", "retrieval_collections"."granule_params", "retrieval_collections"."granule_count", "retrieval_collections"."granule_link_count", "retrieval_collections"."updated_at", "retrieval_orders"."id" as "retrieval_order_id", "retrieval_orders"."type", "retrieval_orders"."order_number", "retrieval_orders"."order_information", "retrieval_orders"."state", "retrieval_orders"."error", "retrieval_orders"."updated_at" as "retrieval_order_updated_at" from "retrieval_collections" left join "retrieval_orders" on "retrieval_collections"."id" = "retrieval_orders"."retrieval_collection_id" inner join "retrievals" on "retrieval_collections"."retrieval_id" = "retrievals"."id" inner join "users" on "retrievals"."user_id" = "users"."id" where "retrieval_collections"."id" = $1 and "users"."id" = $2 limit $3')
      expect(queries[0].bindings).toEqual([1, 2, 1])

      expect(consoleMock).toHaveBeenCalledTimes(1)
      expect(consoleMock).toHaveBeenCalledWith('Failed to retrieve retrieval collection by ID', expect.any(Error))
    })
  })

  describe('getRetrievalCollectionsForGranuleLinks', () => {
    test('retrieves the retrieval collections for granule links', async () => {
      dbTracker.on('query', (query) => {
        query.response([{
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
          order_information: {
            jobId: '12345'
          }
        }])
      })

      const collections = await databaseClient.getRetrievalCollectionsForGranuleLinks(12345, 2)

      expect(collections).toBeDefined()
      expect(collections).toEqual([{
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
        order_information: {
          jobId: '12345'
        }
      }])

      const { queries } = dbTracker.queries

      expect(queries[0].sql).toEqual('select "retrieval_collections"."access_method", "retrieval_collections"."collection_id", "retrieval_collections"."collection_metadata", "retrieval_collections"."granule_params", "retrieval_orders"."order_information" from "retrieval_collections" inner join "retrievals" on "retrieval_collections"."retrieval_id" = "retrievals"."id" left join "retrieval_orders" on "retrieval_orders"."retrieval_collection_id" = "retrieval_collections"."id" inner join "users" on "retrievals"."user_id" = "users"."id" where "retrieval_collections"."id" = $1 and "users"."id" = $2')
      expect(queries[0].bindings).toEqual([12345, 2])
    })

    test('returns an error', async () => {
      const consoleMock = vi.spyOn(console, 'log')

      dbTracker.on('query', (query) => {
        query.reject('Unknown Error')
      })

      await expect(
        databaseClient.getRetrievalCollectionsForGranuleLinks(12345, 2)
      ).rejects.toThrow('Failed to retrieve retrieval collections for granule links')

      const { queries } = dbTracker.queries

      expect(queries[0].sql).toEqual('select "retrieval_collections"."access_method", "retrieval_collections"."collection_id", "retrieval_collections"."collection_metadata", "retrieval_collections"."granule_params", "retrieval_orders"."order_information" from "retrieval_collections" inner join "retrievals" on "retrieval_collections"."retrieval_id" = "retrievals"."id" left join "retrieval_orders" on "retrieval_orders"."retrieval_collection_id" = "retrieval_collections"."id" inner join "users" on "retrievals"."user_id" = "users"."id" where "retrieval_collections"."id" = $1 and "users"."id" = $2')
      expect(queries[0].bindings).toEqual([12345, 2])

      expect(consoleMock).toHaveBeenCalledTimes(1)
      expect(consoleMock).toHaveBeenCalledWith('Failed to retrieve retrieval collections for granule links', expect.any(Error))
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
      const consoleMock = vi.spyOn(console, 'log')

      dbTracker.on('query', (query) => {
        query.reject('Unknown Error')
      })

      await expect(databaseClient.getRetrievalCollectionsByRetrievalId([1, 2])).rejects.toThrow('Failed to retrieve retrieval collections by ID')

      const { queries } = dbTracker.queries

      expect(queries[0].sql).toEqual('select "retrieval_collections"."id", "retrieval_collections"."retrieval_id", "retrieval_collections"."access_method", "retrieval_collections"."collection_id", "retrieval_collections"."collection_metadata", "retrieval_collections"."granule_count", "retrieval_collections"."created_at", "retrieval_collections"."updated_at", "retrieval_collections"."granule_link_count" from "retrieval_collections" where "retrieval_collections"."retrieval_id" in ($1, $2)')
      expect(queries[0].bindings).toEqual([1, 2])

      expect(consoleMock).toHaveBeenCalledTimes(1)
      expect(consoleMock).toHaveBeenCalledWith('Failed to retrieve retrieval collections by ID', expect.any(Error))
    })
  })

  describe('getRetrievalOrdersByOrderId', () => {
    test('retrieves the retrieval orders by order ID', async () => {
      dbTracker.on('query', (query) => {
        query.response({
          retrieval_collection_id: 123,
          type: 'Harmony',
          token: 'mock-token'
        })
      })

      const result = await databaseClient.getRetrievalOrdersByOrderId(1234)

      expect(result).toBeDefined()
      expect(result).toEqual({
        retrieval_collection_id: 123,
        type: 'Harmony',
        token: 'mock-token'
      })

      const { queries } = dbTracker.queries

      expect(queries[0].sql).toEqual('select "retrieval_orders"."retrieval_collection_id", "retrieval_orders"."type", "retrievals"."token" from "retrieval_orders" inner join "retrieval_collections" on "retrieval_orders"."retrieval_collection_id" = "retrieval_collections"."id" inner join "retrievals" on "retrieval_collections"."retrieval_id" = "retrievals"."id" where "retrieval_orders"."id" = $1 limit $2')
      expect(queries[0].bindings).toEqual([1234, 1])
    })

    test('returns an error', async () => {
      const consoleMock = vi.spyOn(console, 'log')

      dbTracker.on('query', (query) => {
        query.reject('Unknown Error')
      })

      await expect(databaseClient.getRetrievalOrdersByOrderId(1234)).rejects.toThrow('Failed to retrieve retrieval order by order ID')

      const { queries } = dbTracker.queries

      expect(queries[0].sql).toEqual('select "retrieval_orders"."retrieval_collection_id", "retrieval_orders"."type", "retrievals"."token" from "retrieval_orders" inner join "retrieval_collections" on "retrieval_orders"."retrieval_collection_id" = "retrieval_collections"."id" inner join "retrievals" on "retrieval_collections"."retrieval_id" = "retrievals"."id" where "retrieval_orders"."id" = $1 limit $2')
      expect(queries[0].bindings).toEqual([1234, 1])

      expect(consoleMock).toHaveBeenCalledTimes(1)
      expect(consoleMock).toHaveBeenCalledWith('Failed to retrieve retrieval order by order ID', expect.any(Error))
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
      const consoleMock = vi.spyOn(console, 'log')

      dbTracker.on('query', (query) => {
        query.reject('Unknown Error')
      })

      await expect(databaseClient.getRetrievalOrdersByRetrievalCollectionId([1, 2])).rejects.toThrow('Failed to retrieve retrieval orders by ID')

      const { queries } = dbTracker.queries

      expect(queries[0].sql).toEqual('select "retrieval_orders"."id", "retrieval_orders"."retrieval_collection_id", "retrieval_orders"."type", "retrieval_orders"."state", "retrieval_orders"."order_information", "retrieval_orders"."order_number" from "retrieval_orders" where "retrieval_orders"."retrieval_collection_id" in ($1, $2)')
      expect(queries[0].bindings).toEqual([1, 2])

      expect(consoleMock).toHaveBeenCalledTimes(1)
      expect(consoleMock).toHaveBeenCalledWith('Failed to retrieve retrieval orders by ID', expect.any(Error))
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
      const consoleMock = vi.spyOn(console, 'log')

      dbTracker.on('query', (query) => {
        query.reject('Unknown Error')
      })

      await expect(databaseClient.getUserById(1)).rejects.toThrow('Failed to retrieve user by ID')

      const { queries } = dbTracker.queries

      expect(queries[0].sql).toEqual('select "users"."id", "users"."site_preferences", "users"."urs_id", "users"."urs_profile" from "users" where "users"."id" = $1 limit $2')
      expect(queries[0].bindings).toEqual([1, 1])

      expect(consoleMock).toHaveBeenCalledTimes(1)
      expect(consoleMock).toHaveBeenCalledWith('Failed to retrieve user by ID', expect.any(Error))
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
      const consoleMock = vi.spyOn(console, 'log')

      dbTracker.on('query', (query) => {
        query.reject('Unknown Error')
      })

      await expect(databaseClient.getUserWhere({ id: 1 })).rejects.toThrow('Failed to retrieve user using where object')

      const { queries } = dbTracker.queries

      expect(queries[0].sql).toEqual('select "users"."id", "users"."site_preferences", "users"."urs_id", "users"."urs_profile" from "users" where "id" = $1 limit $2')
      expect(queries[0].bindings).toEqual([1, 1])

      expect(consoleMock).toHaveBeenCalledTimes(1)
      expect(consoleMock).toHaveBeenCalledWith('Failed to retrieve user using where object', expect.any(Error))
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
      const consoleMock = vi.spyOn(console, 'log')

      dbTracker.on('query', (query) => {
        query.reject('Unknown Error')
      })

      await expect(databaseClient.getUsersById([1, 2])).rejects.toThrow('Failed to retrieve users by ID')

      const { queries } = dbTracker.queries

      expect(queries[0].sql).toEqual('select "users"."id", "users"."urs_id" from "users" where "users"."id" in ($1, $2)')
      expect(queries[0].bindings).toEqual([1, 2])

      expect(consoleMock).toHaveBeenCalledTimes(1)
      expect(consoleMock).toHaveBeenCalledWith('Failed to retrieve users by ID', expect.any(Error))
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

    describe('when the user is not authenticated', () => {
      test('updates an existing project with no userId', async () => {
        dbTracker.on('query', (query) => {
          query.response([{
            id: 1,
            name: 'Updated Project',
            path: '/updated/project',
            user_id: null
          }])
        })

        const project = await databaseClient.updateProject({
          obfuscatedId: '4517239960',
          name: 'Updated Project',
          path: '/updated/project'
        })

        expect(project).toBeDefined()
        expect(project).toEqual({
          id: 1,
          name: 'Updated Project',
          path: '/updated/project',
          user_id: null
        })

        const { queries } = dbTracker.queries

        expect(queries[0].sql).toEqual('update "projects" set "name" = $1, "path" = $2, "updated_at" = $3 where "id" = $4 returning *')
        expect(queries[0].bindings).toEqual(['Updated Project', '/updated/project', new Date(mockToday), 1])
      })
    })

    test('returns an error', async () => {
      const consoleMock = vi.spyOn(console, 'log')

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
      expect(consoleMock).toHaveBeenCalledWith('Failed to update project', expect.any(Error))
    })
  })

  describe('saveAccessConfiguration', () => {
    test('saves the access configuration', async () => {
      dbTracker.on('query', (query) => {
        query.response([])
      })

      const result = await databaseClient.saveAccessConfiguration({
        accessMethod: { mock: 'access method' },
        collectionId: 'collectionId',
        userId: 1
      })

      expect(result).toEqual([])

      const { queries } = dbTracker.queries

      expect(queries[0].sql).toEqual('insert into "access_configurations" ("access_method", "collection_id", "created_at", "updated_at", "user_id") values ($1, $2, $3, $4, $5)')
      expect(queries[0].bindings).toEqual([JSON.stringify(({ mock: 'access method' })), 'collectionId', new Date(mockToday), new Date(mockToday), 1])
    })

    test('returns an error', async () => {
      const consoleMock = vi.spyOn(console, 'log')

      dbTracker.on('query', (query) => {
        query.reject('Unknown Error')
      })

      await expect(databaseClient.saveAccessConfiguration({
        accessMethod: { mock: 'access method' },
        collectionId: 'collectionId',
        userId: 1
      })).rejects.toThrow('Failed to save access configuration')

      const { queries } = dbTracker.queries

      expect(queries[0].sql).toEqual('insert into "access_configurations" ("access_method", "collection_id", "created_at", "updated_at", "user_id") values ($1, $2, $3, $4, $5)')
      expect(queries[0].bindings).toEqual([JSON.stringify(({ mock: 'access method' })), 'collectionId', new Date(mockToday), new Date(mockToday), 1])

      expect(consoleMock).toHaveBeenCalledTimes(1)
      expect(consoleMock).toHaveBeenCalledWith('Failed to save access configuration', expect.any(Error))
    })
  })

  describe('updateAccessConfiguration', () => {
    test('updates the access configuration', async () => {
      dbTracker.on('query', (query) => {
        query.response([])
      })

      const result = await databaseClient.updateAccessConfiguration({
        accessMethod: { mock: 'access method' }
      }, {
        collectionId: 'collectionId',
        userId: 1
      })

      expect(result).toEqual([])

      const { queries } = dbTracker.queries

      expect(queries[0].sql).toEqual('update "access_configurations" set "access_method" = $1, "updated_at" = $2 where "collection_id" = $3 and "user_id" = $4')
      expect(queries[0].bindings).toEqual([{ mock: 'access method' }, new Date(mockToday), 'collectionId', 1])
    })

    test('returns an error', async () => {
      const consoleMock = vi.spyOn(console, 'log')

      dbTracker.on('query', (query) => {
        query.reject('Unknown Error')
      })

      await expect(databaseClient.updateAccessConfiguration({
        accessMethod: { mock: 'access method' }
      }, {
        collectionId: 'collectionId',
        userId: 1
      })).rejects.toThrow('Failed to update access configuration')

      const { queries } = dbTracker.queries

      expect(queries[0].sql).toEqual('update "access_configurations" set "access_method" = $1, "updated_at" = $2 where "collection_id" = $3 and "user_id" = $4')
      expect(queries[0].bindings).toEqual([{ mock: 'access method' }, new Date(mockToday), 'collectionId', 1])

      expect(consoleMock).toHaveBeenCalledTimes(1)
      expect(consoleMock).toHaveBeenCalledWith('Failed to update access configuration', expect.any(Error))
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
      const consoleMock = vi.spyOn(console, 'log')

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
      expect(consoleMock).toHaveBeenCalledWith('Failed to update site preferences', expect.any(Error))
    })
  })

  describe('colormaps', () => {
    test('retrieves the colormaps', async () => {
      dbTracker.on('query', (query) => {
        query.response([{
          product: 'test-product',
          jsondata: { scale: { colors: ['#ff0000'] } }
        }])
      })

      const colormaps = await databaseClient.getColorMapsByProducts(['test-product'])

      expect(colormaps).toBeDefined()
      expect(colormaps).toEqual([{
        product: 'test-product',
        jsondata: { scale: { colors: ['#ff0000'] } }
      }])

      const { queries } = dbTracker.queries
      expect(queries[0].sql).toEqual('select "product", "jsondata" from "colormaps" where "product" in ($1)')
      expect(queries[0].bindings).toEqual(['test-product'])
    })

    test('returns an error', async () => {
      const consoleMock = vi.spyOn(console, 'log')

      dbTracker.on('query', (query) => {
        query.reject('Unknown Error')
      })

      await expect(databaseClient.getColorMapsByProducts(['test-product'])).rejects.toThrow('Failed to retrieve colormaps by products')

      const { queries } = dbTracker.queries
      expect(queries[0].sql).toEqual('select "product", "jsondata" from "colormaps" where "product" in ($1)')
      expect(queries[0].bindings).toEqual(['test-product'])

      expect(consoleMock).toHaveBeenCalledTimes(1)
      expect(consoleMock).toHaveBeenCalledWith('Failed to retrieve colormaps by products')
    })
  })

  describe('getRetrievalsMetricsByAccessType', () => {
    test('retrieves retrieval metrics for admin', async () => {
      dbTracker.on('query', (query) => {
        query.response([
          {
            access_method_type: 'Harmony',
            total_times_access_method_used: '1',
            average_granule_count: '2',
            average_granule_link_count: '50',
            total_granules_retrieved: '2',
            max_granule_link_count: 50,
            min_granule_link_count: 50
          },
          {
            access_method_type: 'download',
            total_times_access_method_used: '3',
            average_granule_count: '5375',
            average_granule_link_count: '207',
            total_granules_retrieved: '16124',
            max_granule_link_count: 240,
            min_granule_link_count: 160
          }
        ])
      })

      const retrievalMetrics = await databaseClient.getRetrievalsMetricsByAccessType({
        startDate: '2020-02-01 23:59:59',
        endDate: '2025-02-01 23:59:59'
      })

      expect(retrievalMetrics).toBeDefined()
      expect(retrievalMetrics).toEqual({
        retrievalMetricsByAccessType: [{
          access_method_type: 'Harmony',
          average_granule_count: '2',
          average_granule_link_count: '50',
          max_granule_link_count: 50,
          min_granule_link_count: 50,
          total_granules_retrieved: '2',
          total_times_access_method_used: '1'
        }, {
          access_method_type: 'download',
          average_granule_count: '5375',
          average_granule_link_count: '207',
          max_granule_link_count: 240,
          min_granule_link_count: 160,
          total_granules_retrieved: '16124',
          total_times_access_method_used: '3'
        }]

      })

      const { queries } = dbTracker.queries
      expect(queries[0].sql).toEqual('select jsonb_path_query("access_method", $1) as "access_method_type", count(*) as "total_times_access_method_used", ROUND(AVG(retrieval_collections.granule_count)) AS average_granule_count, ROUND(AVG(retrieval_collections.granule_link_count)) AS average_granule_link_count, SUM(retrieval_collections.granule_count) AS total_granules_retrieved, MAX(retrieval_collections.granule_link_count) AS max_granule_link_count, MIN(retrieval_collections.granule_link_count) AS min_granule_link_count from "retrieval_collections" where "retrieval_collections"."created_at" >= $2 and "retrieval_collections"."created_at" < $3 group by "access_method_type" order by "total_times_access_method_used" asc')
      expect(queries[0].bindings).toEqual(['$.type', '2020-02-01 23:59:59', '2025-02-01 23:59:59'])
    })

    test('returns an error', async () => {
      const consoleMock = vi.spyOn(console, 'log')

      dbTracker.on('query', (query) => {
        query.reject('Unknown Error')
      })

      await expect(databaseClient.getRetrievalsMetricsByAccessType({
        startDate: '2020-02-01 23:59:59',
        endDate: '2025-02-01 23:59:59'
      })).rejects.toThrow('Failed to retrieve admin retrievals metrics by access type')

      const { queries } = dbTracker.queries
      expect(queries[0].sql).toEqual('select jsonb_path_query("access_method", $1) as "access_method_type", count(*) as "total_times_access_method_used", ROUND(AVG(retrieval_collections.granule_count)) AS average_granule_count, ROUND(AVG(retrieval_collections.granule_link_count)) AS average_granule_link_count, SUM(retrieval_collections.granule_count) AS total_granules_retrieved, MAX(retrieval_collections.granule_link_count) AS max_granule_link_count, MIN(retrieval_collections.granule_link_count) AS min_granule_link_count from "retrieval_collections" where "retrieval_collections"."created_at" >= $2 and "retrieval_collections"."created_at" < $3 group by "access_method_type" order by "total_times_access_method_used" asc')
      expect(queries[0].bindings).toEqual(['$.type', '2020-02-01 23:59:59', '2025-02-01 23:59:59'])

      expect(consoleMock).toHaveBeenCalledTimes(1)
      expect(consoleMock).toHaveBeenCalledWith(
        'Failed to retrieve admin retrievals metrics by access type',
        expect.objectContaining({
          message: expect.stringContaining('Unknown Error')
        })
      )
    })
  })

  describe('getMultiCollectionMetrics', () => {
    test('retrieves retrieval metrics for admin', async () => {
      dbTracker.on('query', (query) => {
        query.response([
          {
            collection_count: 2,
            retrieval_id: 6
          }
        ])
      })

      const retrievalMetrics = await databaseClient.getMultiCollectionMetrics({
        startDate: '2020-02-01 23:59:59',
        endDate: '2025-02-01 23:59:59'
      })

      expect(retrievalMetrics).toBeDefined()
      expect(retrievalMetrics).toEqual({
        multiCollectionResponse: [
          {
            collection_count: 2,
            retrieval_id: 6
          }
        ]
      })

      const { queries } = dbTracker.queries
      expect(queries[0].sql).toEqual('select "retrieval_collections"."retrieval_id" as "retrieval_id", count(*) as "collection_count" from "retrieval_collections" inner join "retrievals" on "retrieval_collections"."retrieval_id" = "retrievals"."id" where "retrieval_collections"."created_at" >= $1 and "retrieval_collections"."created_at" < $2 group by "retrieval_id" having COUNT(*) > $3')
      expect(queries[0].bindings).toEqual(['2020-02-01 23:59:59', '2025-02-01 23:59:59', 1])
    })

    test('returns an error', async () => {
      const consoleMock = vi.spyOn(console, 'log')

      dbTracker.on('query', (query) => {
        query.reject('Unknown Error')
      })

      await expect(databaseClient.getMultiCollectionMetrics({
        startDate: '2020-02-01 23:59:59',
        endDate: '2025-02-01 23:59:59'
      })).rejects.toThrow('Failed to retrieve multi collection retrievals metrics')

      const { queries } = dbTracker.queries
      expect(queries[0].sql).toEqual('select "retrieval_collections"."retrieval_id" as "retrieval_id", count(*) as "collection_count" from "retrieval_collections" inner join "retrievals" on "retrieval_collections"."retrieval_id" = "retrievals"."id" where "retrieval_collections"."created_at" >= $1 and "retrieval_collections"."created_at" < $2 group by "retrieval_id" having COUNT(*) > $3')
      expect(queries[0].bindings).toEqual(['2020-02-01 23:59:59', '2025-02-01 23:59:59', 1])

      expect(consoleMock).toHaveBeenCalledTimes(1)
      expect(consoleMock).toHaveBeenCalledWith(
        'Failed to retrieve multi collection retrievals metrics',
        expect.objectContaining({
          message: expect.stringContaining('Unknown Error')
        })
      )
    })
  })
})
