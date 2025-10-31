import { gql } from '@apollo/client'

const CREATE_PROJECT = gql`
  mutation CreateProject(
    $name: String
    $path: String
  ) {
    createProject(
      name: $name
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

export default CREATE_PROJECT
