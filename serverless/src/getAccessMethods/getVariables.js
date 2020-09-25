import { computeKeywordMappings } from './computeKeywordMappings'
import { computeHierarchyMappings } from './computeHierarchyMappings'

/**
 * Given the items result from a CMR variable search, returns the variables in an object with the key being the concept id
 * and the value being the variable metadata
 * @param {Array} items Items key from a CMR variable search result
 */
const computeVariables = (items) => {
  const variables = {}

  items.forEach((variable) => {
    const { conceptId: variableId } = variable

    variables[variableId] = variable
  })

  return variables
}

/**
 * Fetches the variable metadata for the provided variableIds
 * @param {Array} variableIds An array of variable Concept Ids
 * @param {String} jwtToken JWT returned from edlAuthorizer
 */
export const getVariables = (data) => {
  const { count } = data

  // Default items to an empty array
  let items = []

  // If variables exist, pull them from the response
  if (count > 0) {
    ({ items } = data)
  }

  const hierarchyMappings = computeHierarchyMappings(items)
  const keywordMappings = computeKeywordMappings(items)
  const variables = computeVariables(items)

  return { hierarchyMappings, keywordMappings, variables }
}
