import DataLoader from 'dataloader'

/**
 * Gets the DataLoaders for the GraphQL resolvers
 * @param {*} params The parameters for the DataLoaders
 * @returns The DataLoaders object
 */
const getLoaders = ({ databaseClient }) => ({
  retrievalCollections: new DataLoader(async (ids) => {
    const retrievalCollections = await databaseClient.getRetrievalCollectionsByRetrievalId(ids)

    const grouped = new Map()

    retrievalCollections.forEach((retrievalCollection) => {
      if (!grouped.has(retrievalCollection.retrieval_id)) {
        grouped.set(retrievalCollection.retrieval_id, [])
      }

      grouped.get(retrievalCollection.retrieval_id).push({
        ...retrievalCollection
      })
    })

    return ids.map((id) => grouped.get(id) || [])
  }),
  retrievalOrders: new DataLoader(async (ids) => {
    const retrievalOrders = await databaseClient.getRetrievalOrdersByRetrievalCollectionId(ids)

    const grouped = new Map()

    retrievalOrders.forEach((retrievalOrder) => {
      if (!grouped.has(retrievalOrder.retrieval_collection_id)) {
        grouped.set(retrievalOrder.retrieval_collection_id, [])
      }

      grouped.get(retrievalOrder.retrieval_collection_id).push({
        ...retrievalOrder
      })
    })

    return ids.map((id) => grouped.get(id) || [])
  }),
  users: new DataLoader(async (ids) => {
    const users = await databaseClient.getUsersById(ids)

    const map = new Map(users.map((user) => [user.id, user]))

    return ids.map((id) => map.get(id))
  })
})

export default getLoaders
