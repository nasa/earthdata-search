const GET_PROJECT = `
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
