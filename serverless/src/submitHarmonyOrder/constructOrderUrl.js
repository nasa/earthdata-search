/**
 * Construct the URL we'll submit this Harmony order to
 * @param {String} collectionId The collection id the user has requested granules for
 * @param {Object} accessMethod The selected access method from the project page
 */
export const constructOrderUrl = (collectionId, accessMethod) => {
  console.log('Got to parsing name in constructOrderUrl ')
  const {
    selectedVariables,
    url
  } = accessMethod
  console.log('🚀 ~ file: constructOrderUrl.js:13 ~ constructOrderUrl ~ selectedVariables:', selectedVariables)

  const selectedVariableNames = []

  if (selectedVariables) {
    selectedVariables.forEach((variable) => {
      console.log('🚀 ~ file: constructOrderUrl.js:18 ~ selectedVariables.forEach ~ variable:', variable)
      // Const { [variable]: variableObject } = variable
      const { name } = variable
      console.log('🚀 ~ file: constructOrderUrl.js:19 ~ selectedVariables.forEach ~ name:', name)

      selectedVariableNames.push(name)
    })
  }

  let variableParameter = 'all'
  if (selectedVariableNames.length > 0) {
    console.log('🚀 ~ file: constructOrderUrl.js:28 ~ constructOrderUrl ~ variableParameter:', variableParameter)
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
  console.log('🚀 ~ file: constructOrderUrl.js:39 ~ constructOrderUrl ~ harmonyPathParts:', harmonyPathParts)

  return harmonyPathParts.join('/')
}
