export const allVariablesSelected = (variableIds, selectedVariableIds) => (
  variableIds.every((variableId) => selectedVariableIds.indexOf(variableId) > -1)
)

export default allVariablesSelected
