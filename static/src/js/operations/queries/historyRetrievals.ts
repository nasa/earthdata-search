import { gql } from '@apollo/client'

const HISTORY_RETRIEVALS = gql`
  query historyRetrievals($limit: Int, $offset: Int) {
    historyRetrievals(limit: $limit, offset: $offset) {
      count
      historyRetrievals {
        createdAt
        id
        obfuscatedId
        portalId
        titles
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        currentPage
        pageCount
      }
    }
  }
`

export default HISTORY_RETRIEVALS
