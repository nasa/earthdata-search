/**
 * Returns variable ids grouped by their scienceKeywords
 * @param {*} items items field from a CMR variable search result
 */
export const computeKeywordMappings = (items) => {
  const calculatedMappings = {}

  items.forEach((variable) => {
    const { meta, umm } = variable
    const { 'concept-id': variableId } = meta
    const { ScienceKeywords: scienceKeywords = [] } = umm

    scienceKeywords.forEach((scienceKeyword) => {
      const values = Object.values(scienceKeyword)
      const leafNode = values[values.length - 1]

      if (!calculatedMappings[leafNode]) calculatedMappings[leafNode] = []

      if (calculatedMappings[leafNode].indexOf(variableId) === -1) {
        calculatedMappings[leafNode].push(variableId)
      }
    })
  })

  const orderedKeywords = {}
  Object.keys(calculatedMappings).sort().forEach((key) => {
    orderedKeywords[key] = calculatedMappings[key]
  })

  return orderedKeywords
}
