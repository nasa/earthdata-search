/**
 * Returns true if the collection meets all validation requirements
 * @param {object} method - The collection access method information.
 * @return {boolean}
 */
export const isProjectCollectionValid = (method) => {
  // Here is where we can check the method to see if its valid
  if (method) return true
  return false
}

export default isProjectCollectionValid
