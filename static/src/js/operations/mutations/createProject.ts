const CREATE_PROJECT = `
  mutation CreateProject(
    $name: String
    $path: String
  ) {
    createProject(
      name: $name
      path: $path
    ) {
      name
      obfuscatedId
      path
    }
  }
`

export default CREATE_PROJECT
