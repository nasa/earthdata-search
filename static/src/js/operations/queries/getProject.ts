import { gql } from '@apollo/client'

const GET_PROJECT = gql`
  query GetProject($obfuscatedId: String!) {
    project(obfuscatedId: $obfuscatedId) {
      createdAt
      name
      obfuscatedId
      path
      updatedAt
    }
  }
`

export default GET_PROJECT
