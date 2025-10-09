const DELETE_PROJECT = `
  mutation DeleteProject($obfuscatedId: String!) {
    deleteProject(obfuscatedId: $obfuscatedId)
  }
`

export default DELETE_PROJECT
