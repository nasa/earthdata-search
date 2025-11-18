import { gql } from '@apollo/client'

const GET_RETRIEVAL = gql`
  query GetRetrieval($obfuscatedId: String!) {
    retrieval(obfuscatedId: $obfuscatedId) {
      retrievalCollections {
        obfuscatedId
        collectionId
        collectionMetadata
        links
      }
      id
      obfuscatedId
      jsondata
    }
  }
`

export default GET_RETRIEVAL
