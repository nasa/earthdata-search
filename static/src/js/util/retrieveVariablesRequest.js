/**
 *
  * @param {Object} data collection metadata
  * @returns {Object} data with the additional variables to be extracted
 */
const formatCollectionObject = (data) => {
  // If the input object contains multiple collections
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
    const formattedData = formatCollectionObject(pagedData)

    const { collection: pagedCollection } = formattedData
    const { variables: pagedVariables } = pagedCollection
    const { cursor: newCursor, items: vars } = pagedVariables

    collectedItems = collectedItems.concat(vars)
    if (newCursor === nextCursor) break
    nextCursor = newCursor
  }

  return collectedItems
}
