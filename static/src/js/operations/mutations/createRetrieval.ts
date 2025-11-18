import { gql } from '@apollo/client'

const CREATE_RETRIEVAL = gql`
  mutation CreateRetrieval(
    $collections: [RetrievalCollectionInput]
    $environment: String
    $jsondata: JSON
  ) {
    createRetrieval(
      collections: $collections
      environment: $environment
      jsondata: $jsondata
    ) {
      obfuscatedId
      environment
    }
  }
`

export default CREATE_RETRIEVAL
