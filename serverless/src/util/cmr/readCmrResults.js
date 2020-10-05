/**
 * Return the actual result body from the provided CMR response.
 * @param {String} path The path that was used to create the provided request
 * @param {Object} cmrResponse The response object from CMR
 * @return {Array} The results from a successful response object
 */
export const readCmrResults = (providedPath, cmrResponse) => {
  // Return an empty result for non successful requests
  if (cmrResponse.statusCode !== 200) {
    console.log(cmrResponse.body)

    return []
  }

  const [path, extension] = providedPath.split('.')

  const { body } = cmrResponse

  // The collection and granule search endpoint has a different response
  // than other concepts as does umm_json
  if (
    (extension && !extension.includes('umm_json'))
    && (
      path.includes('collections')
      || path.includes('granules')
    )) {
    const { feed } = body
    const { entry } = feed

    return entry
  }

  // All other endpoints return `items`
  const { items } = body

  return items
}
