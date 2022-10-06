import { castArray } from 'lodash'

import { humanizedQueryValueFormattingMap } from './humanizedQueryValueFormattingMap'

/**
 * Takes the query object from the state and formats the keys to be displayed in the UI
 * @param {Object} subscriptionsQuery - The granule/collection query object from the state
 * @param {String} subscriptionQueryType - The subscription type. Either 'collection' or 'granule'
 * @return {Array} [{ key, humanizedKey, humanizedValue }]
 */
export const queryToHumanizedList = (subscriptionsQuery, subscriptionQueryType) => {
  const values = []
  const subscriptionsQueryTemp = { ...subscriptionsQuery }

  if (subscriptionQueryType === 'collection') {
    // If the query will return collections wihout granules, add a key of "Collections without granules"
    if (!subscriptionsQuery.hasGranulesOrCwic) {
      values.push({
        key: 'hasGranulesOrCwic',
        humanizedKey: 'Include datasets without granules'
      })
    }

    // If only displaying EOSDIS collections, add a key of "EOSDIS collections"
    if (subscriptionsQuery.consortium && ['EOSDIS'].every((type) => subscriptionsQuery.consortium.includes(type))) {
      values.push({
        key: 'consortium-EOSDIS',
        humanizedKey: 'Include only EOSDIS datasets'
      })
    }

    // If only displaying collections with Map Imagery, add a key of "Map Imagery"
    if (subscriptionsQuery.tagKey && subscriptionsQuery.tagKey.includes('edsc.extra.serverless.gibs')) {
      values.push({
        key: 'tagKey-edsc.extra.serverless.gibs',
        humanizedKey: 'Include only datasets with map imagery'
      })
      subscriptionsQueryTemp.tagKey = castArray(subscriptionsQueryTemp.tagKey).filter((tagKey) => tagKey !== 'edsc.extra.serverless.gibs')
    }

    // If only displaying customizable collections, add a key of "Customizable"
    if (subscriptionsQuery.serviceType && ['esi', 'opendap', 'harmony'].every((type) => subscriptionsQuery.serviceType.includes(type))) {
      values.push({
        key: 'serviceType',
        humanizedKey: 'Include only datasets that support customization'
      })
      subscriptionsQueryTemp.serviceType = []
    }
  }

  const keysToFilter = [
    // hasGranulesOrCwic is the default, so it should not be displayed
    'hasGranulesOrCwic',
    // options are derrived from a users query and should not be displayed
    'options',
    'consortium'
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
        {
          key,
          humanizedKey: key,
          humanizedValue: humanizedQueryValueFormattingMap[key]
            ? humanizedQueryValueFormattingMap[key](subscriptionsQueryTemp[key])
            : subscriptionsQueryTemp[key]
        }
      )
    })

  return values
}
