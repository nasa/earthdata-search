import { gql } from '@apollo/client'

const ADMIN_PROJECTS = gql`
  query AdminProjects(
    $limit: Int
    $offset: Int
    $sortKey: String
    $ursId: String
    $obfuscatedId: String
  ) {
    adminProjects(
      limit: $limit
      offset: $offset
      sortKey: $sortKey
      ursId: $ursId
      obfuscatedId: $obfuscatedId
    ) {
      pageInfo {
        currentPage
        hasNextPage
        hasPreviousPage
        pageCount
      }
      count
      adminProjects {
        user {
          ursId
          id
        }
        createdAt
        updatedAt
        obfuscatedId
        id
        path
        name
      }
    }
  }
  `

export default ADMIN_PROJECTS
