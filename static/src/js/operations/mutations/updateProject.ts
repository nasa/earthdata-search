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
      createdAt
      name
      obfuscatedId
      path
      updatedAt
    }
  }
`

export default UPDATE_PROJECT
