import { gql } from '@apollo/client'

const GET_RETRIEVAL_GRANULE_LINKS = gql`
  query GetRetrievalGranuleLinks(
    $obfuscatedRetrievalCollectionId: String
    $linkTypes: [String]
    $flattenLinks: Boolean
    $cursor: String
  ) {
    retrieveGranuleLinks(
      obfuscatedRetrievalCollectionId: $obfuscatedRetrievalCollectionId
      linkTypes: $linkTypes
      flattenLinks: $flattenLinks
      cursor: $cursor
    ) {
      cursor
      done
      links
    }
  }
`

export default GET_RETRIEVAL_GRANULE_LINKS
