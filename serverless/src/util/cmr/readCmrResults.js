/**
 * Return the actual result body from the provided CMR response.
 * @param {String} path The path that was used to create the provided request
 * @param {Object} cmrResponse The response object from CMR
 * @return {Array} The results from a successful response object
 */
export const readCmrResults = (path, cmrResponse) => {
  // Return an empty result for non successful requests
  if (cmrResponse.statusCode !== 200) {
    console.log(cmrResponse.body)

    return []
  }

  const { body } = cmrResponse

  // The collection search endpoint has a different response than all of the others
  if (path.includes('collections')) {
    const { feed } = body
    const { entry } = feed

    return entry
  }

  // All other endpoints return `items`
  const { items } = body

  return items
}
