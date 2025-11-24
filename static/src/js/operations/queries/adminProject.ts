import { gql } from '@apollo/client'

const ADMIN_PROJECT = gql`
  query AdminProject($obfuscatedId: String!) {
    adminProject(obfuscatedId: $obfuscatedId) {
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
