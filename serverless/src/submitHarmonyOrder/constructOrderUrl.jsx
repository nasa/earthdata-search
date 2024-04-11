/**
 * Construct the URL we'll submit this Harmony order to
 * @param {String} collectionId The collection id the user has requested granules for
 * @param {Object} accessMethod The selected access method from the project page
 */
export const constructOrderUrl = (collectionId, accessMethod) => {
  const {
    selectedVariableNames = [],
    url
  } = accessMethod

  let variableParameter = 'all'
  if (selectedVariableNames.length > 0) {
    variableParameter = encodeURIComponent(selectedVariableNames.join(','))
  }

  // Harmony's coverage api url is a bit verbose, construct all of the pieces to be joined below
  const harmonyPathParts = [
    url,
    collectionId,
    'ogc-api-coverages/1.0.0',
    `collections/${variableParameter}`,
    'coverage/rangeset'
  ]

  return harmonyPathParts.join('/')
}
