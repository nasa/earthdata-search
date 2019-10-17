import { isAccessMethodValid } from './accessMethods'

/**
 * Returns true if every collection passed in contains has {isValid: true}
 * @param {Array} collections - An array of collections to check for isValid.
 * @return {Object}
 */
export const isProjectValid = (project, collections) => {
  const { byId: projectById, collectionIds } = project
  const { byId: collectionById } = collections

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
