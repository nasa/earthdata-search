/**
 * Returns variable ids grouped by their scienceKeywords
 * @param {Array} items Array of UMM V Objects
 */
export const computeKeywordMappings = (items) => {
  const calculatedMappings = {}

  items.forEach((variable) => {
    const { conceptId: variableId, scienceKeywords = [] } = variable

    // Skip this iteration of the loop if scienceKeywords is null
    if (scienceKeywords == null) return

    scienceKeywords.forEach((scienceKeyword) => {
      const values = Object.values(scienceKeyword)
      const leafNode = values[values.length - 1]

      if (!calculatedMappings[leafNode]) calculatedMappings[leafNode] = []

      if (calculatedMappings[leafNode].indexOf(variableId) === -1) {
        calculatedMappings[leafNode].push(variableId)
      }
    })
  })

  const orderedKeywords = []
  Object.keys(calculatedMappings).sort().forEach((key) => {
    const variableIds = calculatedMappings[key]

    orderedKeywords.push({
      children: variableIds.map((id) => ({ id })),
      label: key
    })
  })

  return orderedKeywords
}
