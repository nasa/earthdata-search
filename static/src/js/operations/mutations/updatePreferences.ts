const UPDATE_PREFERENCES = `
  mutation UpdatePreferences($preferences: JSON!) {
    updatePreferences(preferences: $preferences) {
      id
      sitePreferences
      ursProfile
      ursId
    }
  }
`

export default UPDATE_PREFERENCES
