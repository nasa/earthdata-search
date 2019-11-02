import { isAccessMethodValid, validAccessMethod } from './accessMethods'

/**
 * Returns true if every project collection can be downloaded
 * @param {Object} project - Project object from the redux store
 * @param {Object} collections - Collections object from the redux store
 * @return {Object}
 */
export const isProjectValid = (project, collections) => {
  const { byId: projectById, collectionIds } = project
  const { byId: collectionById } = collections

  if (collectionIds.length === 0) return { valid: false }

  const valid = { ...validAccessMethod }
  collectionIds.forEach((collectionId) => {
    const projectCollection = projectById[collectionId]
    const collection = collectionById[collectionId]

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
