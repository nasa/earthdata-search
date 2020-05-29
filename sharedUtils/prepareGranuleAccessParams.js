/**
 * Takes granule params an returns the params to be used in a CMR request
 * @param {Object} params Queue messages from SQS
 * @returns {Object} The granule params
 */
export const prepareGranuleAccessParams = (params = {}) => {
  let addedGranules = []
  let granuleParams = params
  const { concept_id: conceptIdsFromParams } = granuleParams

  // If the concept_id value is truthy, we know granules have been manually added.
  if (conceptIdsFromParams) {
    // Because concept_id is supported as a string, make sure we wrap a string in an array.
    if (typeof (conceptIdsFromParams) === 'string') {
      addedGranules = [conceptIdsFromParams]
    } else {
      addedGranules = [...conceptIdsFromParams]
    }
  }

  // If there are any added granules, ignore all other granule parameters.
  if (addedGranules.length) {
    granuleParams = {
      concept_id: addedGranules
    }
  }
  return granuleParams
}
