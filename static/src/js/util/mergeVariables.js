/**
 * Returns a JSON object that is the result of two variable objects being merged
 * and ignores items with duplicate conceptIds.
 * @param {object} variables1 - JSON object of a list of variables.
 * @param {object} variables2 - JSON object of a list of variables.
 * @return {object} - JSON object containing the merged list variables
 */
export const mergeVariables = (variables1, variables2) => {
  if (variables2.items) { if (!variables1.items) return variables2 }
  if (!variables2.items) return variables1

  const existingConceptIds = new Set(variables1.items.map((item) => item.conceptId))
  let uniqueVariableItems = 0
  variables2.items.forEach((item2) => {
    if (!existingConceptIds.has(item2.conceptId)) {
      variables1.items.push(item2)
      existingConceptIds.add(item2.conceptId)
      uniqueVariableItems += 1
    }
  })

  // eslint-disable-next-line no-param-reassign
  variables1.count += variables1.count + uniqueVariableItems

  return variables1
}
