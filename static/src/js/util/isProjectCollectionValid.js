import { isEmpty } from 'lodash'

/**
 * Returns true if the collection meets all validation requirements
 * @param {object} method - The collection access method information.
 * @return {boolean}
 */
export const isProjectCollectionValid = (method) => {
  if (!method) return false

  // Here is where we can check the method to see if its valid
  const [methodKey] = Object.keys(method)

  if (methodKey === 'download' && !isEmpty(method)) return true

  const accessMethod = method[methodKey]
  const { isValid = false } = accessMethod || {}

  return isValid
}
