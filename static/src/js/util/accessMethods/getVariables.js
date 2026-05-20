import { computeKeywordMappings } from './computeKeywordMappings'
import { computeHierarchyMappings } from './computeHierarchyMappings'
import { determineVariableId } from '../determineVariableId'

/**
 * Given the items result from a CMR variable search, returns the variables in an object with the key being the concept id
 * and the value being the variable metadata
 * @param {Array} items Items key from a CMR variable search result
 */
const computeVariables = (items) => {
  const variables = {}

  items.forEach((variable) => {
    const variableId = determineVariableId(variable)

    variables[variableId] = variable
  })

  return variables
}

/**
 * Processes variable data from CMR into a consistent format.
 * This function can handle both the object structure from a CMR search (`{ count, items }`)
 * and a direct array of variable items.
 * @param {Object|Array} data - Variable object response from CMR or an array of variables from the harmony capabilities document.
 * @returns {{hierarchyMappings: Array, keywordMappings: Array, variables: Object}} An object containing the computed mappings and variables.
 */
export const getVariables = (data) => {
  // Determine the source of the variable items, defaulting to an empty array.
  const variableItems = (Array.isArray(data) ? data : data?.items) || []

  const hierarchyMappings = computeHierarchyMappings(variableItems)
  const keywordMappings = computeKeywordMappings(variableItems)
  const variables = computeVariables(variableItems)

  return {
    hierarchyMappings,
    keywordMappings,
    variables
  }
}
