import { isEmpty } from 'lodash'

/**
 * Returns true if the collection meets all validation requirements
 * @param {object} method - The collection access method information.
 * @return {boolean}
 */
export const isProjectCollectionValid = (method) => {
  // Here is where we can check the method to see if its valid
  console.log('method', method)
  if (!isEmpty(method)) return true
  return false
}

export default isProjectCollectionValid
