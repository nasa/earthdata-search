const variablesMatch = (variables, collectionId) => variables.params.conceptId === collectionId
  && variables.params.includeHasGranules === true
  && variables.params.includeTags === 'edsc.*,opensearch.granule.osdd'
  && variables.variableParams.limit === 2000

/**
 * Check if the route is a GetFocusedCollections query for the specified collection ID
 * @param {Object} route Playwright route object
 * @param {string} collectionId The collection ID to check against
 * @returns boolean
 */
export const isGetFocusedCollectionsQuery = (route, collectionId) => {
  let data = JSON.parse(route.request().postData())

  // If the request is going to our lambda, it is nested in a data object
  if (!data.query) {
    ({ data } = data)
  }

  const { query, variables } = data

  return query.includes('query GetFocusedCollection') && variablesMatch(variables, collectionId)
}
