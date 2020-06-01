import { getGranuleLimit } from './collectionMetadata/granuleLimit'
import { getGranuleCount } from './collectionMetadata/granuleCount'

/**
 * Helper object for what properties a valid collection access method has
 */
export const validAccessMethod = {
  valid: true,
  zeroGranules: false,
  tooManyGranules: false
}

/**
 * Determine if the selected access method for a give project collection is valid
 * @param {Object} projectCollection Project collection config object, as saved in the redux store
 * @param {Object} collection Collection object, as saved in the redux store
 */
export const isAccessMethodValid = (projectCollection, collection) => {
  if (!projectCollection || !collection) {
    return {
      ...validAccessMethod,
      valid: false
    }
  }

  // check the granule count and granule limit
  const { metadata } = collection
  const granuleLimit = getGranuleLimit(metadata)
  const granuleCount = getGranuleCount(collection)

  if (granuleCount === 0) {
    return {
      ...validAccessMethod,
      valid: false,
      zeroGranules: true
    }
  }

  if (granuleLimit && granuleCount > granuleLimit) {
    return {
      ...validAccessMethod,
      valid: false,
      tooManyGranules: true
    }
  }

  // check the access method isValid flag
  const { accessMethods, selectedAccessMethod } = projectCollection

  if (!selectedAccessMethod) {
    return {
      ...validAccessMethod,
      valid: false
    }
  }

  const selectedMethod = accessMethods[selectedAccessMethod]

  const { isValid = false } = selectedMethod

  return {
    ...validAccessMethod,
    valid: isValid
  }
}
