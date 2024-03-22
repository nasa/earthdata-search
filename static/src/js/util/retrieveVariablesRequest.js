/**
 * Retrieves the variables of a collection if there are more than `maxCmrPageSize`
  * @param {Object} variablesObj: contains cusor and item from the original graphQlReuqest
  * @param {Object} requestParams: the variable request params
  * @param {Object} graphQlRequestObject: used to make additional graphql requests
  * @returns {Object} retrieves the rest of the variables for a given collection
 */
export const retrieveVariablesRequest = async (
  variablesObj,
  requestParams,
  graphQlRequestObject
) => {
  // Pull out cursor and already retrieved items from the variablesObj
  const { cursor, items } = variablesObj

  let allVariables = items
  let nextCursor = cursor
  while (nextCursor !== null) {
    const varsGraphQuery = `
    query ($params: VariablesInput) {
      variables(params: $params) {
        count
        cursor
        items {
          conceptId
          definition
          instanceInformation
          longName
          name
          nativeId
          scienceKeywords
        }
      }
    }
    `

    const newParams = {
      params: {
        keyword: requestParams.params.conceptId,
        limit: requestParams.variableParams.limit,
        cursor: nextCursor
      }
    }

    // Disabling await in loop because we need to retrieve the next cursor in order to retrieve the next set of variables
    // eslint-disable-next-line no-await-in-loop
    const results = await graphQlRequestObject.search(varsGraphQuery, newParams)
    const {
      data: variablesData
    } = results

    const { data: pagedData } = variablesData

    const { variables: pagedVariables } = pagedData
    const { cursor: newCursor, items: vars } = pagedVariables

    allVariables = allVariables.concat(vars)

    nextCursor = newCursor
  }

  return allVariables
}
