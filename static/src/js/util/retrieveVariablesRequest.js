/**
 *
 * @param {*} data
 * @returns data in the correct format to extract the variables from it.
 */
const formatCollection = (data) => {
  if (data.collections) {
    const formattedData = {}

    const { collections } = data
    const { items } = collections
    const { variables } = items[0]
    formattedData.collection = {
      variables
    }

    return formattedData
  }

  return data
}

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

    const varsParams = requestParams
    varsParams.variableParams.cursor = nextCursor

    // Disabling await in loop because we need to retrieve the next cursor in order to retrieve the next set of variables
    // eslint-disable-next-line no-await-in-loop
    const results = await graphQlRequestObject.search(varsGraphQuery, varsParams)
    const {
      data: variablesData
    } = results

    const { data: pagedData } = variablesData
    const formattedData = formatCollection(pagedData)

    const { collection: pagedCollection } = formattedData
    const { variables: pagedVariables } = pagedCollection
    const { cursor: newCursor, items: vars } = pagedVariables

    collectedItems = collectedItems.concat(vars)
    if (newCursor === nextCursor) break
    nextCursor = newCursor
  }

  return collectedItems
}
