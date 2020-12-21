/**
 * Takes granule params and returns the params to be used in a CMR request
 * @param {Object} params Queue messages from SQS
 * @returns {Object} The granule params
 */
export const prepareGranuleAccessParams = (params = {}) => {
  const { concept_id: conceptIdsFromParams = [] } = params

  // If there are added granules, return only the added granules. Otherwise, send
  // all of the granules params.
  if (conceptIdsFromParams.length) {
    return {
      concept_id: conceptIdsFromParams,
      page_size: conceptIdsFromParams.length
    }
  }

  return params
}
