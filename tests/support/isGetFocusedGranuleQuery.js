const variablesMatch = (variables, granuleId) => variables.params.conceptId === granuleId

export const isGetFocusedGranuleQuery = (route, granuleId) => {
  let data = JSON.parse(route.request().postData())

  // If the request is going to our lambda, it is nested in a data object
  if (!data.query) {
    ({ data } = data)
  }

  const { query, variables } = data

  return query.includes('query GetFocusedGranule') && variablesMatch(variables, granuleId)
}
