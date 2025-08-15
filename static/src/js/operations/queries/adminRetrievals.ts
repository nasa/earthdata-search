const ADMIN_RETRIEVALS = `
  query AdminRetrievals($params: AdminRetrievalsInput) {
    adminRetrievals(params: $params) {
      pageInfo {
        currentPage
        hasNextPage
        hasPreviousPage
        pageCount
      }
      count
      adminRetrievals {
        id
        obfuscatedId
        user {
          id
          ursId
        }
        jsondata
        environment
        updatedAt
        createdAt
      }
    }
  }
  `

export default ADMIN_RETRIEVALS
