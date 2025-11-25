import { gql } from '@apollo/client'

const ADMIN_RETRIEVALS = gql`
  query AdminRetrievals(
    $limit: Int
    $obfuscatedId: String
    $offset: Int
    $retrievalCollectionId: Int
    $sortKey: String
    $ursId: String
  ) {
    adminRetrievals(
      limit: $limit
      obfuscatedId: $obfuscatedId
      offset: $offset
      retrievalCollectionId: $retrievalCollectionId
      sortKey: $sortKey
      ursId: $ursId
    ) {
      pageInfo {
        currentPage
        hasNextPage
        hasPreviousPage
        pageCount
      }
      count
      adminRetrievals {
        id
        obfuscatedId
        user {
          id
          ursId
        }
        jsondata
        environment
        updatedAt
        createdAt
      }
    }
  }
  `

export default ADMIN_RETRIEVALS
