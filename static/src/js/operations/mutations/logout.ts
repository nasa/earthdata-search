import { gql } from '@apollo/client'

const LOGOUT = gql`
  mutation Mutation {
    logout
  }
`

export default LOGOUT
