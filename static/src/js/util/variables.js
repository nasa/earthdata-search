// eslint-disable-next-line arrow-body-style
export const allVariablesSelected = (variableIds, selectedVariableIds) => {
  return variableIds.every(variableId => selectedVariableIds.indexOf(variableId) > -1)
}

export default allVariablesSelected
