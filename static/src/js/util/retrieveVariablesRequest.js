/**
 * Retrieves the variables of a collection if there are more than 2000
 */

export const retrieveVariablesRequest = async (
  variablesObj,
  requestParams,
  graphQlRequestObject,
  query
) => {
  // Pull out cursor and already retrieved items from the variablesObj
  const { cursor, items } = variablesObj
  let collectedItems = items
  let nextCursor = cursor
  while (nextCursor !== null) {
    const varsParams = requestParams
    varsParams.variableParams.cursor = nextCursor

    // Disabling await in loop because we need to retrieve the next cursor in order to retrieve the next set of variables
    // eslint-disable-next-line no-await-in-loop
    const results = await graphQlRequestObject.search(query, varsParams)
    const {
      data: variablesData
    } = results

    const { data: pagedData } = variablesData

    let pulledPagedVariables = null

    if (pagedData.collection) {
      const { collection: pagedCollection } = pagedData
      const { variables: pagedVariables } = pagedCollection

      pulledPagedVariables = pagedVariables
    } else if (pagedData.collections) {
      const { collections: pagedCollections } = pagedData
      const { items: pagedItems } = pagedCollections
      console.log(pagedItems)
      const { variables: pagedVariables } = pagedItems[0]

      pulledPagedVariables = pagedVariables
    }

    const { cursor: newCursor, items: vars } = pulledPagedVariables

    collectedItems = collectedItems.concat(vars)
    if (newCursor === nextCursor) break
    nextCursor = newCursor
  }

  return collectedItems
}
