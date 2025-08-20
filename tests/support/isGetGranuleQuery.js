/**
 * Check if the variables match the specified granule ID
 * @param {Object} variables The variables object from the GraphQL request
 * @param {String} granuleId The granule ID to check against
 * @returns boolean
 */
const variablesMatch = (variables, granuleId) => variables.params.conceptId === granuleId

/**
 * Check if the route is a GetGranule query for the specified granule ID
 * @param {Object} route Playwright route object
 * @param {String} granuleId The granule ID to check against
 * @returns boolean
 */
export const isGetGranuleQuery = (route, granuleId) => {
  let data = JSON.parse(route.request().postData())

  // If the request is going to our lambda, it is nested in a data object
  if (!data.query) {
    ({ data } = data)
  }

  const { query, variables } = data

  return query.includes('query GetGranule') && variablesMatch(variables, granuleId)
}
