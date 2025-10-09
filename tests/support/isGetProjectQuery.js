/**
 * Check if the variables match the specified project ID
 * @param {Object} variables The variables object from the GraphQL request
 * @param {String} projectId The project ID to check against
 * @returns boolean
 */
const variablesMatch = (variables, projectId) => variables.obfuscatedId === projectId

/**
 * Check if the route is a GetProject query for the specified project ID
 * @param {Object} route Playwright route object
 * @param {String} projectId The project ID to check against
 * @returns boolean
 */
export const isGetProjectQuery = (route, projectId) => {
  let data = JSON.parse(route.request().postData())

  // If the request is going to our lambda, it is nested in a data object
  if (!data.query) {
    ({ data } = data)
  }

  const { query, variables } = data

  return query.includes('query GetProject') && variablesMatch(variables, projectId)
}
