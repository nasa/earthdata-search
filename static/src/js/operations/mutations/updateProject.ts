import { gql } from '@apollo/client'

const UPDATE_PROJECT = gql`
  mutation UpdateProject(
    $name: String
    $obfuscatedId: String!
    $path: String
  ) {
    updateProject(
      name: $name
      obfuscatedId: $obfuscatedId
      path: $path
    ) {
      createdAt
      name
      obfuscatedId
      path
      updatedAt
    }
  }
`

export default UPDATE_PROJECT
