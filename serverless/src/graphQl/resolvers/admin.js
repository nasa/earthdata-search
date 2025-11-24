import camelcaseKeys from 'camelcase-keys'
import { obfuscateId } from '../../util/obfuscation/obfuscateId'
import formatAdminPreferencesMetrics from '../utils/formatAdminPreferencesMetrics'
import buildPaginatedResult from '../utils/buildPaginatedResult'

/**
 * GraphQL resolver for admin preferences metrics
 */
export default {
  Query: {
    // If the request made it through the permissions check, then the user is an admin
    // and we just need to return true
    adminIsAuthorized: async () => true,

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
        multiCollectionResponse: camelcaseKeys(multiCollectionRetrievalMetricsResult
          .multiCollectionResponse, { deep: true })
      }
    }
  },
  MultiCollectionRetrieval: {
    obfuscatedId: async (parent) => {
      const { retrievalId } = parent

      return obfuscateId(retrievalId)
    }
  }
}
