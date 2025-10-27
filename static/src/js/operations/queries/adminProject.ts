import { gql } from '@apollo/client'

const ADMIN_PROJECT = gql`
  query AdminProject($params: AdminProjectInput!) {
    adminProject(params: $params) {
      id
      name
      obfuscatedId
      path
      user {
        id
        ursId
      }
      updatedAt
      createdAt
    }
  }
  `

export default ADMIN_PROJECT
