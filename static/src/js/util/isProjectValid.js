import { isAccessMethodValid, validAccessMethod } from './accessMethods'

/**
 * Returns true if every project collection can be downloaded
 * @param {Object} projectCollections - Project collections from the store
 * @param {Object} collectionsMetadata - Collections object from the store
 * @return {Object}
 */
export const isProjectValid = (projectCollections, collectionsMetadata) => {
  const {
    byId: projectCollectionsById = {},
    allIds = []
  } = projectCollections

  if (allIds.length === 0) return { valid: false }

  // Default valid state
  const valid = { ...validAccessMethod }

  allIds.forEach((collectionId) => {
    const projectCollection = projectCollectionsById[collectionId]
    const collection = collectionsMetadata[collectionId]

    const newValid = isAccessMethodValid(projectCollection, collection)

    Object.keys(validAccessMethod).forEach((key) => {
      if (key === 'valid') {
        // If the valid key goes false, remember it is false
        valid[key] = !valid[key] ? valid[key] : newValid[key]
      } else {
        // If the other keys go true, remember they are true
        valid[key] = valid[key] || newValid[key]
      }
    })
  })

  return valid
}

export default isProjectValid
