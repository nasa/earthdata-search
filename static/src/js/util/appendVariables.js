/**
 * Returns a JSON object that is the result of one JSON object being appended to a base object with its type as the key.
 * @param {object} baseVariables - JSON object of a list of variables.
 * @param {object} targetVariables - JSON object of a list of variables to be appended to the parent list.
 * @return {object} - JSON object containing the new variables object
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
