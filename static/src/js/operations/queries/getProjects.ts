import { gql } from '@apollo/client'

const GET_PROJECTS = gql`
  query GetProjects($limit: Int, $offset: Int) {
    projects(limit: $limit, offset: $offset) {
      projects {
        createdAt
        name
        obfuscatedId
        path
        updatedAt
      }
      pageInfo {
        currentPage
        hasNextPage
        hasPreviousPage
        pageCount
      }
      count
    }
  }
`

export default GET_PROJECTS
