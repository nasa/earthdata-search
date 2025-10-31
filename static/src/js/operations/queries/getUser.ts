import { gql } from '@apollo/client'

const GET_USER = gql`
  query GetUser {
    user {
      id
      sitePreferences
      ursProfile {
        affiliation
        country
        emailAddress
        firstName
        lastName
        organization
        studyArea
        uid
        userType
      }
      ursId
    }
  }
`

export default GET_USER
