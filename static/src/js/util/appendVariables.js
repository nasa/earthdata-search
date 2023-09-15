/**
 * Returns a JSON object that is the result of two variable objects being merged
 * and ignores items with duplicate conceptIds.
 * @param {object} variables1 - JSON object of a list of variables.
 * @param {object} variables2 - JSON object of a list of variables.
 * @return {object} - JSON object containing the merged list variables
 */
export const appendVariables = (baseVariables, targetVariables) => {
  const keyName = targetVariables.items[0].type.toLowerCase()
  const { variables } = targetVariables.items[0]
  // eslint-disable-next-line no-param-reassign
  baseVariables[keyName] = {
    count: variables.items.length,
    items: variables.items
  }
  return baseVariables
}
