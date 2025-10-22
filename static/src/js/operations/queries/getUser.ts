const GET_USER = `
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
