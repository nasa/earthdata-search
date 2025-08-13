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
    dbTracker.uninstall()
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

      expect(queries[0].sql).toEqual('select "retrieval_collections".* from "retrieval_collections" where "retrieval_collections"."retrieval_id" in ($1, $2)')
      expect(queries[0].bindings).toEqual([1, 2])
      expect(queries[0].method).toEqual('select')
    })

    test('returns an error', async () => {
      const consoleMock = jest.spyOn(console, 'log')

      dbTracker.on('query', (query) => {
        query.reject('Unknown Error')
      })

      await expect(databaseClient.getRetrievalCollectionsByRetrievalId([1, 2])).rejects.toThrow('Failed to retrieve retrieval collections by ID')

      const { queries } = dbTracker.queries

      expect(queries[0].sql).toEqual('select "retrieval_collections".* from "retrieval_collections" where "retrieval_collections"."retrieval_id" in ($1, $2)')
      expect(queries[0].bindings).toEqual([1, 2])
      expect(queries[0].method).toEqual('select')

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

      expect(queries[0].sql).toEqual('select "retrieval_orders".* from "retrieval_orders" where "retrieval_orders"."retrieval_collection_id" in ($1, $2)')
      expect(queries[0].bindings).toEqual([1, 2])
      expect(queries[0].method).toEqual('select')
    })

    test('returns an error', async () => {
      const consoleMock = jest.spyOn(console, 'log')

      dbTracker.on('query', (query) => {
        query.reject('Unknown Error')
      })

      await expect(databaseClient.getRetrievalOrdersByRetrievalCollectionId([1, 2])).rejects.toThrow('Failed to retrieve retrieval orders by ID')

      const { queries } = dbTracker.queries

      expect(queries[0].sql).toEqual('select "retrieval_orders".* from "retrieval_orders" where "retrieval_orders"."retrieval_collection_id" in ($1, $2)')
      expect(queries[0].bindings).toEqual([1, 2])
      expect(queries[0].method).toEqual('select')

      expect(consoleMock).toHaveBeenCalledTimes(1)
      expect(consoleMock).toHaveBeenCalledWith('Failed to retrieve retrieval orders by ID')
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

      expect(queries[0].sql).toEqual('select "retrievals".* from "retrievals" where "retrievals"."id" = $1 limit $2')
      expect(queries[0].bindings).toEqual([1, 1])
      expect(queries[0].method).toEqual('first')
    })

    test('returns an error', async () => {
      const consoleMock = jest.spyOn(console, 'log')

      dbTracker.on('query', (query) => {
        query.reject('Unknown Error')
      })

      await expect(databaseClient.getRetrievalByObfuscatedId('4517239960')).rejects.toThrow('Failed to retrieve retrieval by ID')

      const { queries } = dbTracker.queries

      expect(queries[0].sql).toEqual('select "retrievals".* from "retrievals" where "retrievals"."id" = $1 limit $2')
      expect(queries[0].bindings).toEqual([1, 1])
      expect(queries[0].method).toEqual('first')

      expect(consoleMock).toHaveBeenCalledTimes(1)
      expect(consoleMock).toHaveBeenCalledWith('Failed to retrieve retrieval by ID')
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

      expect(queries[0].sql).toEqual('select "retrievals".*, "users"."id" as "user_id", "users"."urs_id" as "urs_id", count(*) OVER() as total from "retrievals" inner join "users" on "retrievals"."user_id" = "users"."id" order by "id" desc')
      expect(queries[0].bindings).toEqual([])
      expect(queries[0].method).toEqual('select')
    })

    test('returns an error', async () => {
      const consoleMock = jest.spyOn(console, 'log')

      dbTracker.on('query', (query) => {
        query.reject('Unknown Error')
      })

      await expect(databaseClient.getRetrievals({})).rejects.toThrow('Failed to retrieve user retrievals')

      const { queries } = dbTracker.queries

      expect(queries[0].sql).toEqual('select "retrievals".*, "users"."id" as "user_id", "users"."urs_id" as "urs_id", count(*) OVER() as total from "retrievals" inner join "users" on "retrievals"."user_id" = "users"."id" order by "id" desc')
      expect(queries[0].bindings).toEqual([])
      expect(queries[0].method).toEqual('select')

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
          sortKey: '+created_at'
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

        expect(queries[0].sql).toEqual('select "retrievals".*, "users"."id" as "user_id", "users"."urs_id" as "urs_id", count(*) OVER() as total from "retrievals" inner join "users" on "retrievals"."user_id" = "users"."id" order by "retrievals"."created_at" asc')
        expect(queries[0].bindings).toEqual([])
        expect(queries[0].method).toEqual('select')
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

        expect(queries[0].sql).toEqual('select "retrievals".*, "users"."id" as "user_id", "users"."urs_id" as "urs_id", count(*) OVER() as total from "retrievals" inner join "users" on "retrievals"."user_id" = "users"."id" where "users"."urs_id" = $1 order by "id" desc')
        expect(queries[0].bindings).toEqual(['testuser'])
        expect(queries[0].method).toEqual('select')
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

        expect(queries[0].sql).toEqual('select "retrievals".*, "users"."id" as "user_id", "users"."urs_id" as "urs_id", count(*) OVER() as total from "retrievals" inner join "users" on "retrievals"."user_id" = "users"."id" left join "retrieval_collections" on "retrievals"."id" = "retrieval_collections"."retrieval_id" where "retrieval_collections"."id" = $1 order by "id" desc')
        expect(queries[0].bindings).toEqual([1])
        expect(queries[0].method).toEqual('select')
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

        expect(queries[0].sql).toEqual('select "retrievals".*, "users"."id" as "user_id", "users"."urs_id" as "urs_id", count(*) OVER() as total from "retrievals" inner join "users" on "retrievals"."user_id" = "users"."id" where "retrievals"."id" = $1 order by "id" desc')
        expect(queries[0].bindings).toEqual([1])
        expect(queries[0].method).toEqual('select')
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

        expect(queries[0].sql).toEqual('select "retrievals".*, "users"."id" as "user_id", "users"."urs_id" as "urs_id", count(*) OVER() as total from "retrievals" inner join "users" on "retrievals"."user_id" = "users"."id" order by "id" desc limit $1 offset $2')
        expect(queries[0].bindings).toEqual([2, 2])
        expect(queries[0].method).toEqual('select')
      })
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

      expect(queries[0].sql).toEqual('select "users".* from "users" where "users"."id" = $1 limit $2')
      expect(queries[0].bindings).toEqual([1, 1])
      expect(queries[0].method).toEqual('first')
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

      expect(queries[0].sql).toEqual('select "users".* from "users" where "users"."id" in ($1, $2)')
      expect(queries[0].bindings).toEqual([1, 2])
      expect(queries[0].method).toEqual('select')
    })

    test('returns an error', async () => {
      const consoleMock = jest.spyOn(console, 'log')

      dbTracker.on('query', (query) => {
        query.reject('Unknown Error')
      })

      await expect(databaseClient.getUsersById([1, 2])).rejects.toThrow('Failed to retrieve users by ID')

      const { queries } = dbTracker.queries

      expect(queries[0].sql).toEqual('select "users".* from "users" where "users"."id" in ($1, $2)')
      expect(queries[0].bindings).toEqual([1, 2])
      expect(queries[0].method).toEqual('select')

      expect(consoleMock).toHaveBeenCalledTimes(1)
      expect(consoleMock).toHaveBeenCalledWith('Failed to retrieve users by ID')
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
      expect(queries[0].method).toEqual('select')

      expect(consoleMock).toHaveBeenCalledTimes(1)
      expect(consoleMock).toHaveBeenCalledWith('Failed to retrieve site preferences')
    })
  })
})
