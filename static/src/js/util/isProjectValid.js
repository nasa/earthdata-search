import { isAccessMethodValid, validAccessMethod } from './accessMethods'

/**
 * Returns true if every project collection can be downloaded
 * @param {Object} project - Project object from the redux store
 * @param {Object} collections - Collections object from the redux store
 * @return {Object}
 */
export const isProjectValid = (project, collectionsMetadata) => {
  const { collections: projectCollections = {} } = project
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
        // if the valid key goes false, remember it is false
        valid[key] = !valid[key] ? valid[key] : newValid[key]
      } else {
        // if the other keys go true, remember they are true
        valid[key] = valid[key] || newValid[key]
      }
    })
  })

  return valid
}

export default isProjectValid
