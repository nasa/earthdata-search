import { getGranuleLimit } from './collectionMetadata/granuleLimit'
import { getGranuleCount } from './collectionMetadata/granuleCount'

/**
 * Determine if the selected access method for a give project collection is valid
 * @param {Object} projectCollection Project collection config object, as saved in the redux store
 * @param {Object} collection Collection object, as saved in the redux store
 */
export const isAccessMethodValid = (projectCollection, collection) => {
  if (!projectCollection || !collection) return { valid: false }

  // check the granule count and granule limit
  const { granules, metadata } = collection
  const granuleLimit = getGranuleLimit(metadata)

  if (granuleLimit) {
    const granuleCount = getGranuleCount(granules, collection)
    if (granuleLimit && granuleCount > granuleLimit) {
      return { valid: false, tooManyGranules: true }
    }
  }

  // check the access method isValid flag
  const { accessMethods, selectedAccessMethod } = projectCollection

  if (!selectedAccessMethod) return { valid: false }

  const selectedMethod = accessMethods[selectedAccessMethod]

  const { isValid = false } = selectedMethod

  return { valid: isValid }
}

export default isAccessMethodValid
