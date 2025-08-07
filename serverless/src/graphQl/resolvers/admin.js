import camelcaseKeys from 'camelcase-keys'
import { obfuscateId } from '../../util/obfuscation/obfuscateId'
import formatAdminPreferencesMetrics from '../utils/formatAdminPreferencesMetrics'

// Const paginateData = async (query, key, { limit, offset }) => {
//   const paginatedData = await query.limit(limit).offset(offset)

//   let currentPage = null

//   const pageCount = paginatedData.length
//     ? Math.ceil(paginatedData[0].total / limit)
//     : 0

//   if (pageCount > 0) {
//     if (offset) {
//       currentPage = Math.floor(offset / limit) + 1
//     } else {
//       currentPage = 1
//     }
//   }

//   const hasNextPage = currentPage < pageCount
//   const hasPreviousPage = currentPage > 1

//   return {
//     [key]: paginatedData,
//     pageInfo: {
//       pageCount,
//       hasNextPage,
//       hasPreviousPage,
//       currentPage
//     },
//     count: paginatedData.length
//   }
// }

/**
 * GraphQL resolver for admin preferences metrics
 */
export default {
  Query: {
    adminPreferencesMetrics: async (source, args, context) => {
      const { databaseClient } = context

      return formatAdminPreferencesMetrics(await databaseClient.getSitePreferences())
    },
    adminRetrieval: async (source, args, context) => {
      const { databaseClient } = context
      const { params = {} } = args
      const { obfuscatedId } = params

      const data = await databaseClient.getRetrievalById(obfuscatedId)

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

      try {
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
      } catch (error) {
        console.error('Error fetching retrievals:', error)
        throw new Error('Failed to fetch retrievals')
      }
    }
  },
  AdminRetrieval: {
    user: async (parent, args, context) => {
      console.log('🚀 ~ parent:', parent)
      const { loaders } = context

      const loaderData = await loaders.users.load(parent.userId)

      return camelcaseKeys(loaderData, { deep: true })
    },
    obfuscatedId: async (parent) => {
      const { id } = parent

      return obfuscateId(id)
    },
    retrievalCollections: async (parent, args, context) => {
      const { loaders } = context

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

      const loaderData = await loaders.retrievalOrders.load(parent.id)

      return camelcaseKeys(loaderData, {
        deep: true,
        // Prevent camelcasing of JSON fields
        stopPaths: ['granule_params', 'order_information']
      })
    }
  }
}
