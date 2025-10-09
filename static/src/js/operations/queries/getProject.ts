const GET_PROJECT = `
  query GetProject($obfuscatedId: String!) {
    project(obfuscatedId: $obfuscatedId) {
      name
      obfuscatedId
      path
    }
  }
`

export default GET_PROJECT
