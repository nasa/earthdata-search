/**
 * Takes granule params an returns the params to be used in a CMR request
 * @param {Object} params Queue messages from SQS
 * @returns {Object} The granule params
 */
export const prepareGranuleAccessParams = (params = {}) => {
  let granuleParams = params
  const { concept_id: conceptIdsFromParams } = granuleParams

  // If there are any added granules, overwrite and ignore all
  // other granule parameters.
  if (conceptIdsFromParams.length) {
    granuleParams = {
      concept_id: conceptIdsFromParams
    }
  }

  return granuleParams
}
