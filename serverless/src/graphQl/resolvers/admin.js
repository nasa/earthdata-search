import camelcaseKeys from 'camelcase-keys'
import { obfuscateId } from '../../util/obfuscation/obfuscateId'
import formatAdminPreferencesMetrics from '../utils/formatAdminPreferencesMetrics'

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
      const {
        limit = 20,
        offset = 0,
        sortKey,
        ursId,
        obfuscatedId
      } = params

      const data = await databaseClient.getProjects({
        ursId,
        obfuscatedId,
        limit,
        offset,
        sortKey
      })

      let currentPage = null

      const projectCount = data.length
        ? data[0].total
        : 0

      const pageCount = data.length
        ? Math.ceil(projectCount / limit)
        : 0

      if (pageCount > 0) {
        if (offset) {
          currentPage = Math.floor(offset / limit) + 1
        } else {
          currentPage = 1
        }
      }

      const hasNextPage = currentPage < pageCount
      const hasPreviousPage = currentPage > 1

      return {
        adminProjects: camelcaseKeys(data, { deep: true }),
        pageInfo: {
          pageCount,
          hasNextPage,
          hasPreviousPage,
          currentPage
        },
        count: projectCount
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
      const {
        limit = 20,
        offset = 0,
        sortKey,
        ursId,
        obfuscatedId,
        retrievalCollectionId
      } = params

      const data = await databaseClient.getRetrievals({
        ursId,
        retrievalCollectionId,
        obfuscatedId,
        limit,
        offset,
        sortKey
      })

      let currentPage = null

      const retrievalCount = data.length
        ? data[0].total
        : 0

      const pageCount = data.length
        ? Math.ceil(retrievalCount / limit)
        : 0

      if (pageCount > 0) {
        if (offset) {
          currentPage = Math.floor(offset / limit) + 1
        } else {
          currentPage = 1
        }
      }

      const hasNextPage = currentPage < pageCount
      const hasPreviousPage = currentPage > 1

      return {
        adminRetrievals: camelcaseKeys(data, { deep: true }),
        pageInfo: {
          pageCount,
          hasNextPage,
          hasPreviousPage,
          currentPage
        },
        count: retrievalCount
      }
    }
  },
  AdminProject: {
    user: async (parent, args, context) => {
      const { loaders } = context

      // Use the users dataloader to fetch the user for the project using the userId
      // from the parent AdminProject
      const loaderData = await loaders.users.load(parent.userId)

      return camelcaseKeys(loaderData, { deep: true })
    },
    obfuscatedId: async (parent) => {
      const { id } = parent

      return obfuscateId(id)
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
