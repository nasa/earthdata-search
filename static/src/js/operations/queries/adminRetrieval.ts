const ADMIN_RETRIEVAL = `
  query AdminRetrieval($params: AdminRetrievalInput!) {
    adminRetrieval(params: $params) {
      id
      jsondata
      obfuscatedId
      user {
        id
        ursId
      }
      retrievalCollections {
        id
        accessMethod
        collectionId
        collectionMetadata
        granuleCount
        updatedAt
        createdAt
        retrievalOrders {
          id
          state
          orderNumber
          orderInformation
          type
        }
      }
      jsondata
      environment
      updatedAt
      createdAt
    }
  }
  `

export default ADMIN_RETRIEVAL
