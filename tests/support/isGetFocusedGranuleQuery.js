const variablesMatch = (variables, granuleId) => variables.params.conceptId === granuleId

/**
 * Check if the route is a GetFocusedGranule query for the specified granule ID
 * @param {Object} route Playwright route object
 * @param {string} granuleId The granule ID to check against
 * @returns boolean
 */
export const isGetFocusedGranuleQuery = (route, granuleId) => {
  let data = JSON.parse(route.request().postData())

  // If the request is going to our lambda, it is nested in a data object
  if (!data.query) {
    ({ data } = data)
  }

  const { query, variables } = data

  return query.includes('query GetFocusedGranule') && variablesMatch(variables, granuleId)
}
