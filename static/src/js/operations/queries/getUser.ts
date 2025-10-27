import { gql } from '@apollo/client'

const GET_USER = gql`
  query GetUser {
    user {
      id
      sitePreferences
      ursProfile
      ursId
    }
  }
`

export default GET_USER
