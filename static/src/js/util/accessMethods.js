/**
 * Determine if the selected access method for a give project collection is valid
 * @param {Object} projectCollection Project collection config object, as saved in the redux store
 */
export const isAccessMethodValid = (projectCollection) => {
  if (!projectCollection) return false

  const { accessMethods, selectedAccessMethod } = projectCollection

  if (!selectedAccessMethod) return false

  const selectedMethod = accessMethods[selectedAccessMethod]

  const { isValid = false } = selectedMethod

  return isValid
}

export default isAccessMethodValid
