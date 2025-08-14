/**
 * Check if the variables match the specified collection ID
 * @param {Object} variables The variables object from the GraphQL request
 * @param {String} collectionId The collection ID to check against
 * @returns boolean
 */
const variablesMatch = (variables, collectionId) => variables.params.conceptId === collectionId
  && variables.params.includeHasGranules === true
  && variables.params.includeTags === 'edsc.*,opensearch.granule.osdd'
  && variables.variableParams.limit === 2000

/**
 * Check if the route is a GetCollection query for the specified collection ID
 * @param {Object} route Playwright route object
 * @param {String} collectionId The collection ID to check against
 * @returns boolean
 */
export const isGetCollectionQuery = (route, collectionId) => {
  let data = JSON.parse(route.request().postData())

  // If the request is going to our lambda, it is nested in a data object
  if (!data.query) {
    ({ data } = data)
  }

  const { query, variables } = data

  return query.includes('query GetCollection') && variablesMatch(variables, collectionId)
}
