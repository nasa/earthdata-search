import { stringify } from 'qs'
import { pruneFilters } from './pruneFilters'

/**
 * Prunes the given parameters of empty values and removes values that should not be included in a subscription query
 * @param {Object} params CMR parameters
 */
export const prepareSubscriptionQuery = (params) => {
  const prunedParams = pruneFilters(params)

  // Remove fields that should not be included in a subscription query
  delete prunedParams.collectionId
  delete prunedParams.conceptId
  delete prunedParams.pageNum
  delete prunedParams.sortKey

  // Return the remianing parameters stringified
  return stringify(prunedParams)
}
