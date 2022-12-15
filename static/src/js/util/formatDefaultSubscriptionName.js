import { queryToHumanizedList } from './queryToHumanizedList'
import { pluralize } from './pluralize'
import { humanizedQueryKeysMap } from './humanizedQueryKeysMap'

/**
 * Formats a default subscription name
 * @param {Object} queryObj - The subscription query parameters
 * @param {String} subscriptionType - The subscription type. One of the following: granule|collection.
 * @returns {String} - The subscription default name
 */
export const formatDefaultSubscriptionName = (queryObj, subscriptionType) => {
  const humanizedQueryList = queryToHumanizedList(queryObj, subscriptionType)

  // Format the end of the default string first. Formats the string to look like 'Bounding Box',
  // 'Bounding Box & 1 other filter', or 'Bounding Box & 2 other filters'
  const [firstQueryItem] = humanizedQueryList
  const firstFilter = firstQueryItem ? (humanizedQueryKeysMap[firstQueryItem.humanizedKey] || firstQueryItem.humanizedKey) : '0 filters'
  const abbriviatedFilters = humanizedQueryList.length > 1 && ` & ${humanizedQueryList.length - 1} more ${pluralize('filter', humanizedQueryList.length - 1)}`
  let defaultSubscriptionName = `${firstFilter}`

  if (abbriviatedFilters) defaultSubscriptionName += abbriviatedFilters

  // Add a contextual prefix to the filter string depending on subscription type
  if (subscriptionType === 'collection') {
    defaultSubscriptionName = `Dataset Search Subscription (${defaultSubscriptionName})`
  }
  if (subscriptionType === 'granule') {
    defaultSubscriptionName = `Granule Search Subscription (${defaultSubscriptionName})`
  }

  if (defaultSubscriptionName.length > 77) {
    defaultSubscriptionName = `${defaultSubscriptionName.slice(0, 77)}...`
  }

  return defaultSubscriptionName
}
