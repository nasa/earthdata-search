/**
 * Return the actual result body from the provided CMR response.
 * @param {String} path The path that was used to create the provided request
 * @param {Object} cmrResponse The response object from CMR
 * @return {Array} The results from a successful response object
 */
export const readCmrResults = (providedPath, cmrResponse) => {
  const { data, status } = cmrResponse

  // Return an empty result for non successful requests
  if (status !== 200) {
    console.log(data)

    return []
  }

  const [path, extension] = providedPath.split('.')

  // The collection and granule search endpoint has a different response
  // than other concepts as does umm_json
  if (
    (extension && !extension.includes('umm_json'))
    && (
      path.includes('collections')
      || path.includes('granules')
    )) {
    const { feed } = data
    const { entry } = feed

    return entry
  }

  // All other endpoints return `items`
  const { items } = data

  return items
}
