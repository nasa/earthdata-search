import { gql } from '@apollo/client'

const DELETE_PROJECT = gql`
  mutation DeleteProject($obfuscatedId: String!) {
    deleteProject(obfuscatedId: $obfuscatedId)
  }
`

export default DELETE_PROJECT
