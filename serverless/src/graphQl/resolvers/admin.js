import camelcaseKeys from 'camelcase-keys'
import { obfuscateId } from '../../util/obfuscation/obfuscateId'
import formatAdminPreferencesMetrics from '../utils/formatAdminPreferencesMetrics'
import buildPaginatedResult from '../utils/buildPaginatedResult'

/**
 * GraphQL resolver for admin preferences metrics
 */
export default {
  Query: {
    adminPreferencesMetrics: async (source, args, context) => {
      const { databaseClient } = context

      return formatAdminPreferencesMetrics(await databaseClient.getSitePreferences())
    },
    adminProject: async (source, args, context) => {
      const { databaseClient } = context
      const { params = {} } = args
      const { obfuscatedId } = params

      const data = await databaseClient.getProjectByObfuscatedId(obfuscatedId)

      return camelcaseKeys(data, { deep: true })
    },
    adminProjects: async (source, args, context) => {
      const { databaseClient } = context
      const { params = {} } = args
      const { limit = 20, offset = 0 } = params

      const data = await databaseClient.getProjects(params)
      const result = buildPaginatedResult({
        data,
        limit,
        offset
      })

      return {
        adminProjects: camelcaseKeys(result.data, { deep: true }),
        pageInfo: result.pageInfo,
        count: result.count
      }
    },
    adminRetrieval: async (source, args, context) => {
      const { databaseClient } = context
      const { params = {} } = args
      const { obfuscatedId } = params

      const data = await databaseClient.getRetrievalByObfuscatedId(obfuscatedId)

      return camelcaseKeys(data, { deep: true })
    },
    adminRetrievals: async (source, args, context) => {
      const { databaseClient } = context
      const { params = {} } = args
      const { limit = 20, offset = 0 } = params

      const data = await databaseClient.getRetrievals(params)
      const result = buildPaginatedResult({
        data,
        limit,
        offset
      })

      return {
        adminRetrievals: camelcaseKeys(result.data, { deep: true }),
        pageInfo: result.pageInfo,
        count: result.count
      }
    },
    adminRetrievalsMetrics: async (source, args, context) => {
      const { databaseClient } = context
      const { params = {} } = args
      const { startDate = '', endDate } = params

      const retrievalMetricsByAccessTypeResult = await databaseClient
        .getRetrievalsMetricsByAccessType({
          startDate,
          endDate
        })

      const multiCollectionRetrievalMetricsResult = await databaseClient.getMultiCollectionMetrics({
        startDate,
        endDate
      })

      return {
        retrievalMetricsByAccessType: camelcaseKeys(retrievalMetricsByAccessTypeResult
          .retrievalMetricsByAccessType, { deep: true }),
        multCollectionResponse: camelcaseKeys(multiCollectionRetrievalMetricsResult
          .multCollectionResponse, { deep: true })
      }
    }
  },
  MultiCollectionRetrieval: {
    obfuscatedId: async (parent) => {
      const { retrievalId } = parent

      return obfuscateId(retrievalId)
    }
  },
  AdminRetrieval: {
    user: async (parent, args, context) => {
      const { loaders } = context

      // Use the users dataloader to fetch the user for the retrieval using the userId
      // from the parent AdminRetrieval
      const loaderData = await loaders.users.load(parent.userId)

      return camelcaseKeys(loaderData, { deep: true })
    },
    obfuscatedId: async (parent) => {
      const { id } = parent

      return obfuscateId(id)
    },
    retrievalCollections: async (parent, args, context) => {
      const { loaders } = context

      // Use the retrievalCollections dataloader to fetch the retrieval collections for the retrieval
      // using the id from the parent AdminRetrieval
      const loaderData = await loaders.retrievalCollections.load(parent.id)

      return camelcaseKeys(loaderData, {
        deep: true,
        // Prevent camelcasing of JSON fields
        stopPaths: ['access_method', 'collection_metadata']
      })
    }
  },
  AdminRetrievalCollection: {
    retrievalOrders: async (parent, args, context) => {
      const { loaders } = context

      // Use the retrievalOrders dataloader to fetch the retrieval orders for the collection
      // using the id from the parent AdminRetrievalCollection
      const loaderData = await loaders.retrievalOrders.load(parent.id)

      return camelcaseKeys(loaderData, {
        deep: true,
        // Prevent camelcasing of JSON fields
        stopPaths: ['granule_params', 'order_information']
      })
    }
  }
}
