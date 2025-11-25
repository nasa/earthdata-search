import { gql } from '@apollo/client'

const ADMIN_RETRIEVAL = gql`
  query AdminRetrieval($obfuscatedId: String!) {
    adminRetrieval(obfuscatedId: $obfuscatedId) {
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
