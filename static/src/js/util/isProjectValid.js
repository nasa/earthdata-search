import { isAccessMethodValid } from './accessMethods'

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

  let valid = { valid: true }
  // loop through each collection, if one is invalid, skip the rest
  collectionIds.forEach((collectionId) => {
    const { valid: isValid } = valid

    if (!isValid) return

    const projectCollection = projectById[collectionId]
    const collection = collectionById[collectionId]

    valid = isAccessMethodValid(projectCollection, collection)
  })

  return valid
}

export default isProjectValid
