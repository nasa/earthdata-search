
/**
 * Returns true if every collection passed in contains has {isValid: true}
 * @param {array} collections - An array of collections to check for isValid.
 * @return {boolean} // TODO: We may want to return an object here to be able to provide more information as
 * to why a project is invalid
 */
// eslint-disable-next-line arrow-body-style
export const isProjectValid = (collections) => {
  // TODO: Return more specific information as to why the project is invalid. This will likely require
  // a similar change to the individual collection validation
  return collections.every(collection => collection.isValid)
}

export default isProjectValid
