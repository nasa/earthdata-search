import { SendMessageBatchCommand } from '@aws-sdk/client-sqs'
import camelcaseKeys from 'camelcase-keys'

import buildPaginatedResult from '../utils/buildPaginatedResult'
import formatAdminPreferencesMetrics from '../utils/formatAdminPreferencesMetrics'
import { getQueueUrl, QUEUE_NAMES } from '../../util/getQueueUrl'
import { obfuscateId } from '../../util/obfuscation/obfuscateId'

import { ACCESS_METHOD_TYPES } from '../../../../sharedConstants/accessMethodTypes'

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
      const { obfuscatedId } = args

      const data = await databaseClient.getProjectByObfuscatedId(obfuscatedId)

      return camelcaseKeys(data, { deep: true })
    },
    adminProjects: async (source, args, context) => {
      const { databaseClient } = context
      const { limit = 20, offset = 0 } = args

      const data = await databaseClient.getProjects(args)
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
      const { obfuscatedId } = args

      const data = await databaseClient.getRetrievalByObfuscatedId(obfuscatedId)

      return camelcaseKeys(data, { deep: true })
    },
    adminRetrievals: async (source, args, context) => {
      const { databaseClient } = context
      const { limit = 20, offset = 0 } = args

      const data = await databaseClient.getAdminRetrievals(args)
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
      const { startDate = '', endDate } = args

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
  Mutation: {
    adminRequeueOrder: async (source, args, context) => {
      const { databaseClient, sqs } = context

      const { retrievalOrderId } = args

      const retrievalOrder = await databaseClient.getRetrievalOrdersByOrderId(retrievalOrderId)

      const {
        retrieval_collection_id: retrievalCollectionId,
        token: accessToken,
        type
      } = retrievalOrder

      if ([
        ACCESS_METHOD_TYPES.ESI,
        ACCESS_METHOD_TYPES.ECHO_ORDERS,
        ACCESS_METHOD_TYPES.HARMONY
      ].includes(type)) {
        let queueUrl

        if (type === ACCESS_METHOD_TYPES.ESI) {
          // Submits to Catalog Rest and is often referred to as a
          // service order -- this is presenting in EDSC as the 'Customize' access method
          queueUrl = getQueueUrl(QUEUE_NAMES.CatalogRestOrderQueue)
        } else if (type === ACCESS_METHOD_TYPES.ECHO_ORDERS) {
          // Submits to cmr-ordering and is often referred to as an
          // echo order -- this is presenting in EDSC as the 'Stage For Delivery' access method
          queueUrl = getQueueUrl(QUEUE_NAMES.CmrOrderingOrderQueue)
        } else if (type === ACCESS_METHOD_TYPES.HARMONY) {
          // Submits to Harmony
          queueUrl = getQueueUrl(QUEUE_NAMES.HarmonyOrderQueue)
        }

        if (process.env.SKIP_SQS !== 'true') {
          // Send all of the order messages to sqs as a single batch
          await sqs.send(new SendMessageBatchCommand({
            QueueUrl: queueUrl,
            Entries: [{
              Id: `${retrievalCollectionId}`,
              MessageBody: JSON.stringify({
                accessToken,
                id: retrievalOrderId
              })
            }]
          }))
        }
      }

      return true
    }
  },
  MultiCollectionRetrieval: {
    obfuscatedId: async (parent) => {
      const { retrievalId } = parent

      return obfuscateId(retrievalId)
    }
  }
}
