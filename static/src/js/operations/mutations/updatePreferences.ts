import { gql } from '@apollo/client'

const UPDATE_PREFERENCES = gql`
  mutation UpdatePreferences($preferences: JSON!) {
    updatePreferences(preferences: $preferences) {
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

export default UPDATE_PREFERENCES
