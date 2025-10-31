import { gql } from '@apollo/client'

const ADMIN_PROJECTS = gql`
  query AdminProjects($params: AdminProjectsInput) {
    adminProjects(params: $params) {
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
