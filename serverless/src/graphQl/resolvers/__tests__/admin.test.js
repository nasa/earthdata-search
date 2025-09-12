import { gql } from '@apollo/client'

import ADMIN_PREFERENCES_METRICS from '../../../../../static/src/js/operations/queries/adminPreferencesMetrics'
import ADMIN_RETRIEVAL from '../../../../../static/src/js/operations/queries/adminRetrieval'
import ADMIN_RETRIEVALS from '../../../../../static/src/js/operations/queries/adminRetrievals'
import setupServer from './__mocks__/setupServer'

describe('Admin Resolver', () => {
  describe('Query', () => {
    describe('adminPreferencesMetrics', () => {
      test('returns results with all fields', async () => {
        const databaseClient = {
          getSitePreferences: jest.fn().mockResolvedValue([
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
        }
        const { contextValue, server } = setupServer({
          databaseClient
        })

        const response = await server.executeOperation({
          query: gql(ADMIN_PREFERENCES_METRICS)
        }, {
          contextValue
        })

        const { data } = response.body.singleResult

        expect(databaseClient.getSitePreferences).toHaveBeenCalledTimes(1)
        expect(databaseClient.getSitePreferences).toHaveBeenCalledWith()

        expect(data).toEqual({
          adminPreferencesMetrics: {
            baseLayer: [
              {
                value: 'trueColor',
                percentage: '100',
                count: '1'
              }
            ],
            collectionListView: [
              {
                value: 'list',
                percentage: '100',
                count: '1'
              }
            ],
            collectionSort: [
              {
                value: '-score',
                percentage: '100',
                count: '1'
              }
            ],
            granuleListView: [
              {
                value: 'list',
                percentage: '100',
                count: '1'
              }
            ],
            granuleSort: [
              {
                value: '-start_date',
                percentage: '100',
                count: '1'
              }
            ],
            latitude: [
              {
                value: '90',
                percentage: '100',
                count: '1'
              }
            ],
            longitude: [
              {
                value: '135',
                percentage: '100',
                count: '1'
              }
            ],
            overlayLayers: [
              {
                value: 'bordersRoads',
                percentage: '100',
                count: '1'
              },
              {
                value: 'coastlines',
                percentage: '100',
                count: '1'
              }
            ],
            panelState: [
              {
                value: 'full_width',
                percentage: '100',
                count: '1'
              }
            ],
            projection: [
              {
                value: 'epsg3413',
                percentage: '100',
                count: '1'
              }
            ],
            zoom: [
              {
                value: '2',
                percentage: '100',
                count: '1'
              }
            ]
          }
        })
      })

      test('throws an error when the query fails', async () => {
        const databaseClient = {
          getSitePreferences: jest.fn().mockImplementation(() => {
            throw new Error('Something failed')
          })
        }

        const { contextValue, server } = setupServer(databaseClient)

        const response = await server.executeOperation({
          query: gql(ADMIN_PREFERENCES_METRICS)
        }, {
          contextValue: {
            ...contextValue,
            databaseClient
          }
        })

        const { data, errors } = response.body.singleResult

        const errorMessage = 'Something failed'

        expect(data).toEqual({
          adminPreferencesMetrics: null
        })

        expect(errors[0].message).toEqual(errorMessage)
      })
    })

    describe('adminRetrieval', () => {
      test('returns results with all fields', async () => {
        const databaseClient = {
          getRetrievalByObfuscatedId: jest.fn().mockResolvedValue({
            id: 1,
            user_id: 1,
            jsondata: {
              source: '?source=test',
              portalId: 'edsc',
              shapefileId: ''
            },
            token: 'token',
            environment: 'prod',
            updated_at: '2023-06-27T20:22:47.400Z',
            created_at: '2023-06-27T20:22:47.400Z'
          }),
          getUsersById: jest.fn().mockResolvedValue([
            {
              id: 1,
              site_preferences: {},
              urs_id: 'testuser',
              urs_profile: {
                sub: 'testuser'
              },
              updated_at: '2022-10-28T17:57:07.817Z',
              created_at: '2022-10-28T17:57:07.817Z',
              environment: 'prod'
            }
          ]),
          getRetrievalCollectionsByRetrievalId: jest.fn().mockResolvedValue([
            {
              id: 1,
              retrieval_id: 1,
              access_method: {
                type: 'download'
              },
              collection_id: 'C123456789-TEST',
              collection_metadata: {
                conceptId: 'C123456789-TEST'
              },
              granule_params: {},
              granule_count: 5,
              token: 'token',
              environment: 'prod',
              updated_at: '2023-06-27T20:22:47.400Z',
              created_at: '2023-06-27T20:22:47.400Z'
            }
          ]),
          getRetrievalOrdersByRetrievalCollectionId: jest.fn().mockResolvedValue([
            {
              id: 1,
              retrieval_collection_id: 1,
              type: 'download',
              jsondata: {
                source: '?source=test'
              },
              token: 'token',
              environment: 'prod',
              updated_at: '2023-06-27T20:22:47.400Z',
              created_at: '2023-06-27T20:22:47.400Z'
            }
          ])
        }
        const { contextValue, server } = setupServer({
          databaseClient
        })

        const response = await server.executeOperation({
          query: gql(ADMIN_RETRIEVAL),
          variables: { params: { obfuscatedId: 'test-obfuscated-id' } }
        }, {
          contextValue
        })

        const { data } = response.body.singleResult

        expect(databaseClient.getRetrievalByObfuscatedId).toHaveBeenCalledWith('test-obfuscated-id')
        expect(databaseClient.getRetrievalByObfuscatedId).toHaveBeenCalledTimes(1)
        expect(databaseClient.getUsersById).toHaveBeenCalledWith([1])
        expect(databaseClient.getUsersById).toHaveBeenCalledTimes(1)
        expect(databaseClient.getRetrievalCollectionsByRetrievalId).toHaveBeenCalledWith([1])
        expect(databaseClient.getRetrievalCollectionsByRetrievalId).toHaveBeenCalledTimes(1)
        expect(databaseClient.getRetrievalOrdersByRetrievalCollectionId).toHaveBeenCalledWith([1])
        expect(databaseClient.getRetrievalOrdersByRetrievalCollectionId).toHaveBeenCalledTimes(1)

        expect(data).toEqual({
          adminRetrieval: {
            createdAt: '2023-06-27T20:22:47.400Z',
            environment: 'prod',
            id: 1,
            jsondata: {
              portalId: 'edsc',
              shapefileId: '',
              source: '?source=test'
            },
            obfuscatedId: '4517239960',
            retrievalCollections: [
              {
                accessMethod: {
                  type: 'download'
                },
                collectionId: 'C123456789-TEST',
                collectionMetadata: {
                  conceptId: 'C123456789-TEST'
                },
                createdAt: '2023-06-27T20:22:47.400Z',
                granuleCount: 5,
                id: 1,
                retrievalOrders: [
                  {
                    id: 1,
                    orderInformation: null,
                    orderNumber: null,
                    state: null,
                    type: 'download'
                  }
                ],
                updatedAt: '2023-06-27T20:22:47.400Z'
              }
            ],
            updatedAt: '2023-06-27T20:22:47.400Z',
            user: {
              id: 1,
              ursId: 'testuser'
            }
          }
        })
      })

      test('throws an error when the query fails', async () => {
        const databaseClient = {
          getRetrievalByObfuscatedId: jest.fn().mockImplementation(() => {
            throw new Error('Something failed')
          })
        }

        const { contextValue, server } = setupServer({
          databaseClient
        })

        const response = await server.executeOperation({
          query: gql(ADMIN_RETRIEVAL),
          variables: { params: { obfuscatedId: 'test-obfuscated-id' } }
        }, {
          contextValue
        })

        const { data, errors } = response.body.singleResult

        const errorMessage = 'Something failed'

        expect(data).toEqual({
          adminRetrieval: null
        })

        expect(errors[0].message).toEqual(errorMessage)
      })
    })

    describe('adminRetrievals', () => {
      test('returns results with all fields', async () => {
        const databaseClient = {
          getRetrievals: jest.fn().mockResolvedValue([
            {
              id: 1,
              user_id: 1,
              total: 1,
              jsondata: {
                source: '?source=test',
                portalId: 'edsc',
                shapefileId: ''
              },
              token: 'token',
              environment: 'prod',
              updated_at: '2023-06-27T20:22:47.400Z',
              created_at: '2023-06-27T20:22:47.400Z'
            }
          ]),
          getUsersById: jest.fn().mockResolvedValue([
            {
              id: 1,
              site_preferences: {},
              urs_id: 'testuser',
              urs_profile: {
                sub: 'testuser'
              },
              updated_at: '2022-10-28T17:57:07.817Z',
              created_at: '2022-10-28T17:57:07.817Z',
              environment: 'prod'
            }
          ])
        }
        const { contextValue, server } = setupServer({
          databaseClient
        })

        const response = await server.executeOperation({
          query: gql(ADMIN_RETRIEVALS),
          variables: {
            params: {
              limit: 2,
              offset: 0
            }
          }
        }, {
          contextValue
        })

        const { data } = response.body.singleResult

        expect(databaseClient.getRetrievals).toHaveBeenCalledWith({
          limit: 2,
          offset: 0
        })

        expect(databaseClient.getRetrievals).toHaveBeenCalledTimes(1)
        expect(databaseClient.getUsersById).toHaveBeenCalledWith([1])
        expect(databaseClient.getUsersById).toHaveBeenCalledTimes(1)

        expect(data).toEqual({
          adminRetrievals: {
            pageInfo: {
              pageCount: 1,
              hasNextPage: false,
              hasPreviousPage: false,
              currentPage: 1
            },
            count: 1,
            adminRetrievals: [
              {
                createdAt: '2023-06-27T20:22:47.400Z',
                environment: 'prod',
                id: 1,
                jsondata: {
                  portalId: 'edsc',
                  shapefileId: '',
                  source: '?source=test'
                },
                obfuscatedId: '4517239960',
                updatedAt: '2023-06-27T20:22:47.400Z',
                user: {
                  id: 1,
                  ursId: 'testuser'
                }
              }
            ]
          }
        })
      })

      test('throws an error when the query fails', async () => {
        const databaseClient = {
          getRetrievals: jest.fn().mockImplementation(() => {
            throw new Error('Something failed')
          })

        }
        const { contextValue, server } = setupServer({
          databaseClient
        })

        const response = await server.executeOperation({
          query: gql(ADMIN_RETRIEVALS)
        }, {
          contextValue
        })

        const { data, errors } = response.body.singleResult

        const errorMessage = 'Something failed'

        expect(data).toEqual({
          adminRetrievals: null
        })

        expect(errors[0].message).toEqual(errorMessage)
      })

      describe('when requesting retrievals from multiple users', () => {
        test('batches requests for users and returns the expected results', async () => {
          const databaseClient = {
            getRetrievals: jest.fn().mockResolvedValue([
              {
                id: 1,
                user_id: 1,
                total: 1,
                jsondata: {
                  source: '?source=test',
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
                user_id: 2,
                total: 1,
                jsondata: {
                  source: '?source=test',
                  portalId: 'edsc',
                  shapefileId: ''
                },
                token: 'token',
                environment: 'prod',
                updated_at: '2023-06-27T20:22:47.400Z',
                created_at: '2023-06-27T20:22:47.400Z'
              }
            ]),
            getUsersById: jest.fn().mockResolvedValue([
              {
                id: 1,
                site_preferences: {},
                urs_id: 'testuser',
                urs_profile: {
                  sub: 'testuser'
                },
                updated_at: '2022-10-28T17:57:07.817Z',
                created_at: '2022-10-28T17:57:07.817Z',
                environment: 'prod'
              },
              {
                id: 2,
                site_preferences: {},
                urs_id: 'testuser2',
                urs_profile: {
                  sub: 'testuser2'
                },
                updated_at: '2022-10-28T17:57:07.817Z',
                created_at: '2022-10-28T17:57:07.817Z',
                environment: 'prod'
              }
            ])
          }
          const { contextValue, server } = setupServer({
            databaseClient
          })

          const response = await server.executeOperation({
            query: gql(ADMIN_RETRIEVALS),
            variables: {
              params: {
                limit: 2,
                offset: 0
              }
            }
          }, {
            contextValue
          })

          const { data } = response.body.singleResult

          expect(databaseClient.getRetrievals).toHaveBeenCalledWith({
            limit: 2,
            offset: 0
          })

          expect(databaseClient.getRetrievals).toHaveBeenCalledTimes(1)
          expect(databaseClient.getUsersById).toHaveBeenCalledWith([1, 2])
          expect(databaseClient.getUsersById).toHaveBeenCalledTimes(1)

          expect(data).toEqual({
            adminRetrievals: {
              pageInfo: {
                pageCount: 1,
                hasNextPage: false,
                hasPreviousPage: false,
                currentPage: 1
              },
              count: 1,
              adminRetrievals: [
                {
                  createdAt: '2023-06-27T20:22:47.400Z',
                  environment: 'prod',
                  id: 1,
                  jsondata: {
                    portalId: 'edsc',
                    shapefileId: '',
                    source: '?source=test'
                  },
                  obfuscatedId: '4517239960',
                  updatedAt: '2023-06-27T20:22:47.400Z',
                  user: {
                    id: 1,
                    ursId: 'testuser'
                  }
                },
                {
                  createdAt: '2023-06-27T20:22:47.400Z',
                  environment: 'prod',
                  id: 2,
                  jsondata: {
                    portalId: 'edsc',
                    shapefileId: '',
                    source: '?source=test'
                  },
                  obfuscatedId: '7023641925',
                  updatedAt: '2023-06-27T20:22:47.400Z',
                  user: {
                    id: 2,
                    ursId: 'testuser2'
                  }
                }
              ]
            }
          })
        })
      })

      describe('when requesting multiple pages of results', () => {
        test('returns paginated results', async () => {
          const databaseClient = {
            getRetrievals: jest.fn().mockResolvedValue([
              {
                id: 3,
                user_id: 2,
                total: 3,
                jsondata: {
                  source: '?source=test',
                  portalId: 'edsc',
                  shapefileId: ''
                },
                token: 'token',
                environment: 'prod',
                updated_at: '2023-06-27T20:22:47.400Z',
                created_at: '2023-06-27T20:22:47.400Z'
              }
            ]),
            getUsersById: jest.fn().mockResolvedValue([
              {
                id: 1,
                site_preferences: {},
                urs_id: 'testuser',
                urs_profile: {
                  sub: 'testuser'
                },
                updated_at: '2022-10-28T17:57:07.817Z',
                created_at: '2022-10-28T17:57:07.817Z',
                environment: 'prod'
              },
              {
                id: 2,
                site_preferences: {},
                urs_id: 'testuser2',
                urs_profile: {
                  sub: 'testuser2'
                },
                updated_at: '2022-10-28T17:57:07.817Z',
                created_at: '2022-10-28T17:57:07.817Z',
                environment: 'prod'
              }
            ])
          }
          const { contextValue, server } = setupServer({
            databaseClient
          })

          const response = await server.executeOperation({
            query: gql(ADMIN_RETRIEVALS),
            variables: {
              params: {
                limit: 2,
                offset: 2
              }
            }
          }, {
            contextValue
          })

          const { data } = response.body.singleResult

          expect(databaseClient.getRetrievals).toHaveBeenCalledWith({
            limit: 2,
            offset: 2
          })

          expect(databaseClient.getRetrievals).toHaveBeenCalledTimes(1)
          expect(databaseClient.getUsersById).toHaveBeenCalledWith([2])
          expect(databaseClient.getUsersById).toHaveBeenCalledTimes(1)

          expect(data).toEqual({
            adminRetrievals: {
              pageInfo: {
                pageCount: 2,
                hasNextPage: false,
                hasPreviousPage: true,
                currentPage: 2
              },
              count: 3,
              adminRetrievals: [
                {
                  createdAt: '2023-06-27T20:22:47.400Z',
                  environment: 'prod',
                  id: 3,
                  jsondata: {
                    portalId: 'edsc',
                    shapefileId: '',
                    source: '?source=test'
                  },
                  obfuscatedId: '2057964173',
                  updatedAt: '2023-06-27T20:22:47.400Z',
                  user: {
                    id: 2,
                    ursId: 'testuser2'
                  }
                }
              ]
            }
          })
        })
      })
    })
  })
})
