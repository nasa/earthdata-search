import { gql } from '@apollo/client'

const GET_RETRIEVAL_COLLECTION = gql`
  query GetRetrievalCollection($obfuscatedId: String!) {
    retrievalCollection(obfuscatedId: $obfuscatedId) {
      accessMethod
      collectionMetadata
      granuleCount
      id
      obfuscatedId
      retrievalId
      updatedAt
      retrievalOrders {
        error
        id
        orderInformation
        orderNumber
        state
        type
      }
    }
  }
`

export default GET_RETRIEVAL_COLLECTION
