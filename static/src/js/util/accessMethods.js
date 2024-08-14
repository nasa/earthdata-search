import { getGranuleLimit } from './collectionMetadata/granuleLimit'

/**
 * Helper object for what properties a valid collection access method has
 */
export const validAccessMethod = {
  valid: true,
  noGranules: false,
  tooManyGranules: false,
  needsCustomization: false
}

/**
 * Determine if the selected access method for a given project collection is valid
 * @param {Object} projectCollection Project collection config object, as saved in the redux store
 * @param {Object} collection Collection object, as saved in the redux store
 */
export const isAccessMethodValid = (projectCollection, collectionMetadata) => {
  if (!projectCollection || !collectionMetadata) {
    return {
      ...validAccessMethod,
      valid: false
    }
  }

  // Check the granule count and granule limit
  const granuleLimit = getGranuleLimit(collectionMetadata)

  const { granules: projectCollectionGranules } = projectCollection
  const { hits: granuleCount } = projectCollectionGranules

  if (granuleCount <= 0) {
    return {
      ...validAccessMethod,
      valid: false,
      noGranules: true
    }
  }

  if (granuleLimit && granuleCount > granuleLimit) {
    return {
      ...validAccessMethod,
      valid: false,
      tooManyGranules: true
    }
  }

  // Check the access method isValid flag
  const {
    accessMethods = {},
    selectedAccessMethod
  } = projectCollection

  if (!selectedAccessMethod) {
    return {
      ...validAccessMethod,
      valid: false
    }
  }

  const { [selectedAccessMethod]: selectedMethod = {} } = accessMethods

  const {
    isValid = false,
    hasChanged = false
  } = selectedMethod

  console.log('🚀 ~ file: accessMethods.js:65 ~ isAccessMethodValid ~ isValid:', isValid)
  let esiNeedsCustomization = false
  let swoldrTooManyGranules = false

  if (selectedAccessMethod.startsWith('esi') && !hasChanged) {
    esiNeedsCustomization = true
  }

  console.log('🚀 ~ file: accessMethods.js:77 ~ isAccessMethodValid ~ selectedAccessMethod:', selectedAccessMethod)
  // TODO prevent from selecting swodlr if count it too high
  if (selectedAccessMethod.startsWith('swodlr') && granuleCount > 10) {
    console.log('🚀 ~ file: accessMethods.js:75 ~ isAccessMethodValid ~ granuleCount:', granuleCount)
    console.log('Granule count is too high 🚀')
    swoldrTooManyGranules = true
  }

  return {
    ...validAccessMethod,
    valid: isValid && !esiNeedsCustomization && !swoldrTooManyGranules,
    needsCustomization: esiNeedsCustomization
  }
}
