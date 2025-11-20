import ADMIN_PREFERENCES_METRICS from '../../../../../static/src/js/operations/queries/adminPreferencesMetrics'
import ADMIN_RETRIEVAL from '../../../../../static/src/js/operations/queries/adminRetrieval'
import ADMIN_RETRIEVALS from '../../../../../static/src/js/operations/queries/adminRetrievals'
import ADMIN_RETRIEVALS_METRICS from '../../../../../static/src/js/operations/queries/adminRetrievalsMetrics'
import ADMIN_PROJECT from '../../../../../static/src/js/operations/queries/adminProject'
import ADMIN_PROJECTS from '../../../../../static/src/js/operations/queries/adminProjects'
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
          query: ADMIN_PREFERENCES_METRICS
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
          query: ADMIN_PREFERENCES_METRICS
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

    describe('adminProject', () => {
      test('returns results with all fields', async () => {
        const databaseClient = {
          getProjectByObfuscatedId: jest.fn().mockResolvedValue({
            id: 1,
            name: 'Test Project',
            path: '/search?ff=Test%20Project',
            user_id: 1,
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
          ])
        }
        const { contextValue, server } = setupServer({
          databaseClient
        })

        const response = await server.executeOperation({
          query: ADMIN_PROJECT,
          variables: { params: { obfuscatedId: 'test-obfuscated-id' } }
        }, {
          contextValue
        })

        const { data } = response.body.singleResult

        expect(databaseClient.getProjectByObfuscatedId).toHaveBeenCalledWith('test-obfuscated-id')
        expect(databaseClient.getProjectByObfuscatedId).toHaveBeenCalledTimes(1)

        expect(data).toEqual({
          adminProject: {
            createdAt: '2023-06-27T20:22:47.400Z',
            id: 1,
            name: 'Test Project',
            obfuscatedId: '4517239960',
            path: '/search?ff=Test%20Project',
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
          getProjectByObfuscatedId: jest.fn().mockImplementation(() => {
            throw new Error('Something failed')
          })
        }

        const { contextValue, server } = setupServer({
          databaseClient
        })

        const response = await server.executeOperation({
          query: ADMIN_PROJECT,
          variables: { params: { obfuscatedId: 'test-obfuscated-id' } }
        }, {
          contextValue
        })

        const { data, errors } = response.body.singleResult

        const errorMessage = 'Something failed'

        expect(data).toEqual({
          adminProject: null
        })

        expect(errors[0].message).toEqual(errorMessage)
      })
    })

    describe('adminProjects', () => {
      test('returns results with all fields', async () => {
        const databaseClient = {
          getProjects: jest.fn().mockResolvedValue([
            {
              id: 1,
              user_id: 1,
              total: 1,
              name: 'Test Project',
              path: '/search?ff=Test%20Project',
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
          query: ADMIN_PROJECTS,
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

        expect(databaseClient.getProjects).toHaveBeenCalledWith({
          limit: 2,
          offset: 0
        })

        expect(databaseClient.getProjects).toHaveBeenCalledTimes(1)
        expect(databaseClient.getUsersById).toHaveBeenCalledWith([1])
        expect(databaseClient.getUsersById).toHaveBeenCalledTimes(1)

        expect(data).toEqual({
          adminProjects: {
            adminProjects: [{
              createdAt: '2023-06-27T20:22:47.400Z',
              id: 1,
              name: 'Test Project',
              obfuscatedId: '4517239960',
              path: '/search?ff=Test%20Project',
              updatedAt: '2023-06-27T20:22:47.400Z',
              user: {
                id: 1,
                ursId: 'testuser'
              }
            }],
            count: 1,
            pageInfo: {
              currentPage: 1,
              hasNextPage: false,
              hasPreviousPage: false,
              pageCount: 1
            }
          }
        })
      })

      test('throws an error when the query fails', async () => {
        const databaseClient = {
          getProjects: jest.fn().mockImplementation(() => {
            throw new Error('Something failed')
          })
        }

        const { contextValue, server } = setupServer({
          databaseClient
        })

        const response = await server.executeOperation({
          query: ADMIN_PROJECTS
        }, {
          contextValue
        })

        const { data, errors } = response.body.singleResult

        const errorMessage = 'Something failed'
        expect(errors[0].message).toEqual(errorMessage)

        expect(data).toEqual({
          adminProjects: null
        })
      })

      describe('when requesting retrievals from multiple users', () => {
        test('batches requests for users and returns the expected results', async () => {
          const databaseClient = {
            getProjects: jest.fn().mockResolvedValue([
              {
                id: 1,
                user_id: 1,
                total: 2,
                name: 'Test Project 1',
                path: '/search?ff=Test%20Project%201',
                updated_at: '2023-06-27T20:22:47.400Z',
                created_at: '2023-06-27T20:22:47.400Z'
              },
              {
                id: 2,
                user_id: 2,
                total: 2,
                name: 'Test Project 2',
                path: '/search?ff=Test%20Project%202',
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
            query: ADMIN_PROJECTS,
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

          expect(databaseClient.getProjects).toHaveBeenCalledWith({
            limit: 2,
            offset: 0
          })

          expect(databaseClient.getProjects).toHaveBeenCalledTimes(1)
          expect(databaseClient.getUsersById).toHaveBeenCalledWith([1, 2])
          expect(databaseClient.getUsersById).toHaveBeenCalledTimes(1)

          expect(data).toEqual({
            adminProjects: {
              adminProjects: [{
                createdAt: '2023-06-27T20:22:47.400Z',
                id: 1,
                name: 'Test Project 1',
                obfuscatedId: '4517239960',
                path: '/search?ff=Test%20Project%201',
                updatedAt: '2023-06-27T20:22:47.400Z',
                user: {
                  id: 1,
                  ursId: 'testuser'
                }
              }, {
                createdAt: '2023-06-27T20:22:47.400Z',
                id: 2,
                name: 'Test Project 2',
                obfuscatedId: '7023641925',
                path: '/search?ff=Test%20Project%202',
                updatedAt: '2023-06-27T20:22:47.400Z',
                user: {
                  id: 2,
                  ursId: 'testuser2'
                }
              }],
              count: 2,
              pageInfo: {
                currentPage: 1,
                hasNextPage: false,
                hasPreviousPage: false,
                pageCount: 1
              }
            }
          })
        })
      })

      describe('when requesting multiple pages of results', () => {
        test('returns paginated results', async () => {
          const databaseClient = {
            getProjects: jest.fn().mockResolvedValue([
              {
                id: 3,
                user_id: 2,
                total: 3,
                name: 'Test Project 3',
                path: '/search?ff=Test%20Project%203',
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
            query: ADMIN_PROJECTS,
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

          expect(databaseClient.getProjects).toHaveBeenCalledWith({
            limit: 2,
            offset: 2
          })

          expect(databaseClient.getProjects).toHaveBeenCalledTimes(1)
          expect(databaseClient.getUsersById).toHaveBeenCalledWith([2])
          expect(databaseClient.getUsersById).toHaveBeenCalledTimes(1)

          expect(data).toEqual({
            adminProjects: {
              adminProjects: [{
                createdAt: '2023-06-27T20:22:47.400Z',
                id: 3,
                name: 'Test Project 3',
                obfuscatedId: '2057964173',
                path: '/search?ff=Test%20Project%203',
                updatedAt: '2023-06-27T20:22:47.400Z',
                user: {
                  id: 2,
                  ursId: 'testuser2'
                }
              }],
              count: 3,
              pageInfo: {
                currentPage: 2,
                hasNextPage: false,
                hasPreviousPage: true,
                pageCount: 2
              }
            }
          })
        })
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
          query: ADMIN_RETRIEVAL,
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
          query: ADMIN_RETRIEVAL,
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
          query: ADMIN_RETRIEVALS,
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
          query: ADMIN_RETRIEVALS
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
            query: ADMIN_RETRIEVALS,
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
            query: ADMIN_RETRIEVALS,
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

    describe('adminRetrievalsMetrics', () => {
      test('returns results with all fields', async () => {
        const mockRetrievalMetricsByAccessTypeResult = {
          retrievalMetricsByAccessType: [
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
          ]
        }
        const mockMultiCollectionRetrievalMetricsResult = {
          multCollectionResponse: [
            {
              collection_count: 2,
              retrieval_id: 6
            }
          ]
        }
        const databaseClient = {
          getRetrievalsMetricsByAccessType: jest.fn()
            .mockResolvedValue(mockRetrievalMetricsByAccessTypeResult),
          getMultiCollectionMetrics: jest.fn()
            .mockResolvedValue(mockMultiCollectionRetrievalMetricsResult)
        }

        const { contextValue, server } = setupServer({
          databaseClient
        })

        const response = await server.executeOperation({
          query: ADMIN_RETRIEVALS_METRICS,
          variables: {
            params: {
              startDate: '2020-02-01 23:59:59',
              endDate: '2025-02-01 23:59:59'
            }
          }
        }, {
          contextValue
        })

        const { data } = response.body.singleResult

        expect(databaseClient.getRetrievalsMetricsByAccessType).toHaveBeenCalledTimes(1)
        expect(databaseClient.getRetrievalsMetricsByAccessType).toHaveBeenCalledWith({
          startDate: '2020-02-01 23:59:59',
          endDate: '2025-02-01 23:59:59'
        })

        expect(databaseClient.getMultiCollectionMetrics).toHaveBeenCalledTimes(1)
        expect(databaseClient.getMultiCollectionMetrics).toHaveBeenCalledWith({
          startDate: '2020-02-01 23:59:59',
          endDate: '2025-02-01 23:59:59'
        })

        expect(data).toEqual({
          adminRetrievalsMetrics: {
            retrievalMetricsByAccessType: [
              {
                accessMethodType: 'Harmony',
                totalTimesAccessMethodUsed: '1',
                averageGranuleCount: '2',
                averageGranuleLinkCount: '50',
                totalGranulesRetrieved: '2',
                maxGranuleLinkCount: 50,
                minGranuleLinkCount: 50
              },
              {
                accessMethodType: 'download',
                totalTimesAccessMethodUsed: '3',
                averageGranuleCount: '5375',
                averageGranuleLinkCount: '207',
                totalGranulesRetrieved: '16124',
                maxGranuleLinkCount: 240,
                minGranuleLinkCount: 160
              }
            ],
            multCollectionResponse: [
              {
                collectionCount: 2,
                obfuscatedId: '3217430596',
                retrievalId: 6
              }
            ]
          }
        })
      })

      test('throws an error when the query fails', async () => {
        const databaseClient = {
          getRetrievalsMetricsByAccessType: jest.fn().mockImplementation(() => {
            throw new Error('Something failed')
          })

        }
        const { contextValue, server } = setupServer({
          databaseClient
        })

        const response = await server.executeOperation({
          query: ADMIN_RETRIEVALS_METRICS
        }, {
          contextValue
        })

        const { data, errors } = response.body.singleResult

        const errorMessage = 'Something failed'

        expect(data).toEqual({
          adminRetrievalsMetrics: null
        })

        expect(errors[0].message).toEqual(errorMessage)
      })
    })
  })
})
