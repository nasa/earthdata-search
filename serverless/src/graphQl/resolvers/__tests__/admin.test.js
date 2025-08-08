import { ApolloServer } from '@apollo/server'

import { gql } from '@apollo/client'
import resolvers from '../index'
import typeDefs from '../../types'
import DatabaseClient from '../../utils/databaseClient'
import ADMIN_PREFERENCES_METRICS from '../../../../../static/src/js/operations/queries/adminPreferencesMetrics'
import ADMIN_RETRIEVAL from '../../../../../static/src/js/operations/queries/adminRetrieval'

jest.mock('../../utils/databaseClient', () => jest.fn().mockImplementation(() => ({
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
})))

const databaseClient = new DatabaseClient()

const setupServer = () => (
  new ApolloServer({
    typeDefs,
    resolvers,
    datasources: () => ({
      databaseClient
    })
  })
)

const contextValue = {
  dataSources: { databaseClient },
  requestId: 'mock-request-id',
  user: {
    ursId: 'testuser',
    username: 'testusername'
  }
}

describe('Admin Resolver', () => {
  describe('Query', () => {
    describe('adminPreferencesMetrics', () => {
      test('returns results with all fields', async () => {
        const server = setupServer()

        const response = await server.executeOperation({
          query: gql(ADMIN_PREFERENCES_METRICS)
        }, {
          contextValue: {
            ...contextValue,
            databaseClient
          }
        })

        const { data } = response.body.singleResult

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
        databaseClient.getSitePreferences.mockImplementation(() => {
          throw new Error('Something failed')
        })

        const server = setupServer()

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

    describe.skip('adminRetrieval', () => {
      test('returns results with all fields', async () => {
        const server = setupServer()

        const response = await server.executeOperation({
          query: gql(ADMIN_RETRIEVAL)
        }, {
          contextValue: {
            ...contextValue,
            databaseClient
          }
        })

        const { data } = response.body.singleResult
        console.log('🚀 ~ response.body:', response.body)

        expect(data).toEqual({
        })
      })

      test('throws an error when the query fails', async () => {
        databaseClient.getSitePreferences.mockImplementation(() => {
          throw new Error('Something failed')
        })

        const server = setupServer()

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
  })
})
