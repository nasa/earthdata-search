const ADMIN_PROJECTS = `
  query AdminProjects($params: AdminProjectsInput) {
    adminProjects(params: $params) {
      pageInfo {
        currentPage
        hasNextPage
        hasPreviousPage
        pageCount
      }
      count
      adminProjects {
        user {
          ursId
          id
        }
        createdAt
        updatedAt
        obfuscatedId
        id
        path
        name
      }
    }
  }
  `

export default ADMIN_PROJECTS
