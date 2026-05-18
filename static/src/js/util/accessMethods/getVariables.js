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
    const { conceptId, href } = variable

    let variableId = conceptId
    if (!variableId && href) {
      const hrefParts = href.split('/')
      variableId = hrefParts[hrefParts.length - 1]
    }

    variables[variableId] = variable
  })

  return variables
}

/**
 * Fetches the variable metadata for the provided variableIds
 * @param {Object} data variable object response from CMR
 */
export const getOpendapVariables = (data) => {
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

  return {
    hierarchyMappings,
    keywordMappings,
    variables
  }
}

/**
 * Fetches the variable metadata for the provided variableIds
 * @param {Object} data variable object response from CMR
 */
export const getHarmonyVariables = (data = []) => {
  const hierarchyMappings = computeHierarchyMappings(data)
  const keywordMappings = computeKeywordMappings(data)
  const variables = computeVariables(data)

  return {
    hierarchyMappings,
    keywordMappings,
    variables
  }
}
