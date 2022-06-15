import { humanizedQueryValueFormattingMap } from './humanizedQueryValueFormattingMap'

/**
 * Takes the query object from the state and formats the keys to be displayed in the UI
 * @param {Object} subscriptionsQuery - The granule/collection query object from the state
 * @param {String} subscriptionQueryType - The subscription type. Either 'collection' or 'granule'
 * @return {Array} [key, humanizedKey, humanizedValue]
 */
export const queryToHumanizedList = (subscriptionsQuery, subscriptionQueryType) => {
  const values = []
  const subscriptionsQueryTemp = { ...subscriptionsQuery }

  if (subscriptionQueryType === 'collection') {
    // If the query will return collections wihout granules, add a key of "Collections without granules"
    if (!subscriptionsQuery.hasGranulesOrCwic) {
      values.push(['hasGranulesOrCwic', 'Include datasets without granules'])
    }

    // If only displaying EOSDIS collections, add a key of "EOSDIS collections"
    if (subscriptionsQuery.tagKey && subscriptionsQuery.tagKey.includes('gov.nasa.eosdis')) {
      values.push(['tagKey-gov.nasa.eosdis', 'Include only EOSDIS datasets'])
      subscriptionsQueryTemp.tagKey = subscriptionsQueryTemp.tagKey.filter((tagKey) => tagKey !== 'gov.nasa.eosdis')
    }

    // If only displaying collections with Map Imagery, add a key of "Map Imagery"
    if (subscriptionsQuery.tagKey && subscriptionsQuery.tagKey.includes('edsc.extra.serverless.gibs')) {
      values.push(['tagKey-edsc.extra.serverless.gibs', 'Include only datasets with map imagery'])
      subscriptionsQueryTemp.tagKey = subscriptionsQueryTemp.tagKey.filter((tagKey) => tagKey !== 'edsc.extra.serverless.gibs')
    }

    // If only displaying customizable collections, add a key of "Customizable"
    if (subscriptionsQuery.serviceType && ['esi', 'opendap', 'harmony'].every((type) => subscriptionsQuery.serviceType.includes(type))) {
      values.push(['serviceType', 'Include only datasets that support customization'])
      subscriptionsQueryTemp.serviceType = []
    }
  }

  const keysToFilter = [
    // hasGranulesOrCwic is the default, so it should not be displayed
    'hasGranulesOrCwic',
    // options are derrived from a users query and should not be displayed
    'options'
  ]

  Object.keys(subscriptionsQueryTemp)
    // Filter out any keys that should not be displayed
    .filter((key) => !keysToFilter.includes(key))
    // Remove any empty array values, like tagKey or serviceType
    .filter((key) => subscriptionsQueryTemp[key].length !== 0)
    .forEach((key) => {
      // Set each item in the array to be an array where the first index is the key
      // and the index is the humanzed value
      values.push(
        [
          key,
          key,
          humanizedQueryValueFormattingMap[key]
            ? humanizedQueryValueFormattingMap[key](subscriptionsQueryTemp[key])
            : subscriptionsQueryTemp[key]
        ]
      )
    })

  return values
}
