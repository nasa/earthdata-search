/**
 * Retrieves the variables of a collection if there are more than 2000
 */

export const retrieveVariablesRequest = async (
  variablesObj,
  requestParams,
  graphQlRequestObject
) => {
  // Pull out cursor and already retrieved items from the variablesObj
  const { cursor, items } = variablesObj

  let collectedItems = items
  let nextCursor = cursor
  while (nextCursor !== null) {
    const varsGraphQuery = `
        query GetCollection(
          $params: CollectionInput, $variableParams: VariablesInput
        ) {
          collection (params: $params) {
            conceptId
            variables (
              params: $variableParams
            ) {
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
        }`
    // Disabling await in loop because we need to retrieve the next cursor in order to retrieve the next set of variables

    // eslint-disable-next-line no-await-in-loop
    const results = await graphQlRequestObject.search(varsGraphQuery, {
      requestParams
    })
    const {
      data: variablesData
    } = results

    const { data: pagedData } = variablesData
    const { collection: pagedCollection } = pagedData
    const { variables: pagedVariables } = pagedCollection
    const { cursor: newCursor, items: vars } = pagedVariables

    collectedItems = collectedItems.concat(vars)
    if (newCursor === nextCursor) break
    nextCursor = newCursor
  }

  return collectedItems
}
