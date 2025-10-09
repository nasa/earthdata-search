const UPDATE_PROJECT = `
  mutation UpdateProject(
    $name: String
    $obfuscatedId: String!
    $path: String
  ) {
    updateProject(
      name: $name
      obfuscatedId: $obfuscatedId
      path: $path
    ) {
      name
      obfuscatedId
      path
    }
  }
`

export default UPDATE_PROJECT
