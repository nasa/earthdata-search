import DataLoader from 'dataloader'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import DatabaseClient from './databaseClient'

/**
 * Gets the DataLoaders for the GraphQL resolvers
 * @param {Object} context The GraphQL context
 * @param {DatabaseClient} context.databaseClient The database client instance
 * @returns The DataLoaders object
 */
const getLoaders = ({ databaseClient }) => ({
  /**
   * DataLoader for retrieving retrieval collections
   * @param {Array} ids The IDs of the retrieval collections to retrieve
   * @returns {Promise<Array>} A promise that resolves to the array of retrieval collection objects
   */
  retrievalCollections: new DataLoader(async (ids) => {
    const retrievalCollections = await databaseClient.getRetrievalCollectionsByRetrievalId(ids)

    const grouped = new Map()

    // Group the retrieval collections by their retrieval_id
    retrievalCollections.forEach((retrievalCollection) => {
      if (!grouped.has(retrievalCollection.retrieval_id)) {
        grouped.set(retrievalCollection.retrieval_id, [])
      }

      grouped.get(retrievalCollection.retrieval_id).push({
        ...retrievalCollection
      })
    })

    // Return the retrieval collections in the same order as the requested IDs
    return ids.map((id) => grouped.get(id) || [])
  }),
  /**
   * DataLoader for retrieving retrieval orders
   * @param {Array} ids The IDs of the retrieval orders to retrieve
   * @returns {Promise<Array>} A promise that resolves to the array of retrieval order objects
   */
  retrievalOrders: new DataLoader(async (ids) => {
    const retrievalOrders = await databaseClient.getRetrievalOrdersByRetrievalCollectionId(ids)

    const grouped = new Map()

    // Group the retrieval orders by their retrieval_collection_id
    retrievalOrders.forEach((retrievalOrder) => {
      if (!grouped.has(retrievalOrder.retrieval_collection_id)) {
        grouped.set(retrievalOrder.retrieval_collection_id, [])
      }

      grouped.get(retrievalOrder.retrieval_collection_id).push({
        ...retrievalOrder
      })
    })

    // Return the retrieval orders in the same order as the requested IDs
    return ids.map((id) => grouped.get(id) || [])
  }),
  /**
   * DataLoader for retrieving users
   * @param {Array} ids The IDs of the users to retrieve
   * @returns {Promise<Array>} A promise that resolves to the array of user objects
   */
  users: new DataLoader(async (ids) => {
    const users = await databaseClient.getUsersById(ids)

    // Group the users by their ID
    const map = new Map(users.map((user) => [user.id, user]))

    // Return the users in the same order as the requested IDs
    return ids.map((id) => map.get(id))
  })
})

export default getLoaders
