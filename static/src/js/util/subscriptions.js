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
  delete prunedParams.echoCollectionId
  delete prunedParams.includeFacets
  delete prunedParams.includeGranuleCounts
  delete prunedParams.includeHasGranules
  delete prunedParams.includeTags
  delete prunedParams.isOpenSearch
  delete prunedParams.pageNum
  delete prunedParams.pageSize
  delete prunedParams.sortKey

  // Return the remaining parameters, don't encode the values because CMR won't accept them
  return prunedParams
}

/**
 * Removes the provided disabledFields from the subscription query object
 * @param {Object} query Subscription query object
 * @param {Object} disabledFields Subscription query disabled fields object
 */
export const removeDisabledFieldsFromQuery = (query, disabledFields) => {
  const newQuery = { ...query }
  let tags = query.tagKey

  Object.keys(disabledFields).forEach((key) => {
    // If the disabledField is false, the user has re-enabled the field, don't remove it
    if (!disabledFields[key]) return

    // If the key starts with `tagKey`, remove the correct tag from the tags array
    if (key.startsWith('tagKey')) {
      const [, tagValue] = key.split('-')

      tags = tags.filter((value) => value !== tagValue)
      return
    }

    // Remove the field from the newQuery
    delete newQuery[key]
  })

  // If some tags still exist, set the new tagKey to the updates tags array
  if (tags && tags.length > 0) {
    newQuery.tagKey = tags
  }

  // If no tags remain, delete the tagKey from the newQuery
  if (tags && tags.length === 0) {
    delete newQuery.tagKey
  }

  return newQuery
}
